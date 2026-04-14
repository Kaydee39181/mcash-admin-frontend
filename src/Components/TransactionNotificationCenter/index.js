import { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AgentConstant } from "../../constants/constants";
import { AUTH_STORAGE_EVENT } from "../../theme";
import useNotificationPreferences from "../../hooks/useNotificationPreferences";
import {
  clearSeenTransactionKeys,
  mergeSeenTransactionKeys,
  readSeenTransactionKeys,
  saveSeenTransactionKeys,
} from "../../utils/notificationPreferences";

const POLL_INTERVAL_MS = 60000;
const MAIN_TRANSACTION_LENGTH = 20;
const VIRTUAL_TRANSACTION_LENGTH = 10;
const TOAST_CONTAINER_ID = "transaction-alerts";
const SW_REGISTRATION_KEY = "__mcashNotificationSwRegistration";

const notificationAxios = axios.create();

const safeParseToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem("data");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const normalizeTransactions = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return [];
};

const toText = (value) => String(value || "").trim();

const formatAmount = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "";
  }

  return `NGN ${numeric.toLocaleString()}`;
};

const resolveTransactionTimestamp = (transaction) => {
  const rawValue =
    transaction?.transactionDate ||
    transaction?.createdAt ||
    transaction?.systemTime ||
    transaction?.appTime ||
    transaction?.date ||
    transaction?.timestamp;

  if (!rawValue) {
    return 0;
  }

  const parsedValue = new Date(rawValue).getTime();
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const resolveTransactionKey = (transaction, source) => {
  const rawKey =
    transaction?.transactionId ||
    transaction?.id ||
    transaction?.reference ||
    transaction?.rrn ||
    transaction?.stan ||
    `${resolveTransactionTimestamp(transaction)}-${transaction?.amount ?? transaction?.transactionAmount ?? ""}`;

  return `${source}:${toText(rawKey)}`;
};

const resolveTransactionType = (transaction, source) => {
  const transactionType = toText(transaction?.transactionType?.type || transaction?.type);
  if (transactionType) {
    return transactionType;
  }

  return source === "virtual" ? "Virtual Account" : "Transaction";
};

const resolveTransactionStatus = (transaction) =>
  toText(
    transaction?.statusMessage ||
      transaction?.responseMessage ||
      transaction?.status ||
      transaction?.statusCode
  ) || "New update";

const resolveTransactionReference = (transaction) =>
  toText(
    transaction?.reference ||
      transaction?.transactionReference ||
      transaction?.externalReference ||
      transaction?.transactionId ||
      transaction?.rrn
  );

const buildTransactionSummary = (transaction, source) => {
  const amount =
    formatAmount(transaction?.amount ?? transaction?.transactionAmount) || "Amount unavailable";
  const type = resolveTransactionType(transaction, source);
  const status = resolveTransactionStatus(transaction);
  const reference = resolveTransactionReference(transaction);

  return `${type} | ${amount} | ${status}${reference ? ` | Ref: ${reference}` : ""}`;
};

const buildDigestSummary = (items) => {
  const totalAmount = items.reduce((sum, item) => {
    const amount = Number(item?.transaction?.amount ?? item?.transaction?.transactionAmount);
    return Number.isNaN(amount) ? sum : sum + amount;
  }, 0);

  const mainCount = items.filter((item) => item.source === "main").length;
  const virtualCount = items.filter((item) => item.source === "virtual").length;
  const totalCount = items.length;
  const sourceSummary = [
    mainCount ? `${mainCount} main` : "",
    virtualCount ? `${virtualCount} virtual` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return `${totalCount} new transaction${totalCount > 1 ? "s" : ""}${
    sourceSummary ? ` (${sourceSummary})` : ""
  }${totalAmount > 0 ? ` | Total: NGN ${totalAmount.toLocaleString()}` : ""}`;
};

const buildNotificationTargetUrl = (source) =>
  source === "virtual" ? "/virtual-account" : "/transactions";

const shouldRequestVirtualTransactions = (token) => {
  const roles = Array.isArray(token?.user?.roleGroup?.role)
    ? token.user.roleGroup.role
    : [];

  return roles.some((role) => role?.roleCode === "ROLE_VIEW_ALL_AGENT");
};

const buildMainTransactionsUrl = () => {
  const params = new URLSearchParams();
  params.append("startPage", "0");
  params.append("length", String(MAIN_TRANSACTION_LENGTH));
  return `${AgentConstant.FETCH_TRANSACTIONS_URL}${params.toString()}`;
};

const buildVirtualTransactionsUrl = () => {
  const params = new URLSearchParams();
  params.append("startPage", "0");
  params.append("length", String(VIRTUAL_TRANSACTION_LENGTH));
  return `${AgentConstant.VIRTUAL_ACCOUNT_TRANSACTIONS_URL}?${params.toString()}`;
};

const registerNotificationServiceWorker = async () => {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    window[SW_REGISTRATION_KEY]
  ) {
    return window?.[SW_REGISTRATION_KEY] || null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      `${process.env.PUBLIC_URL || ""}/notifications-sw.js`
    );
    window[SW_REGISTRATION_KEY] = registration;
    return registration;
  } catch {
    return null;
  }
};

const showBrowserNotification = async ({ title, body, url, tag }) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (window.Notification.permission !== "granted") {
    return;
  }

  const options = {
    body,
    icon: `${process.env.PUBLIC_URL || ""}/mcp_icon_192.png`,
    badge: `${process.env.PUBLIC_URL || ""}/mcp_icon_192.png`,
    tag,
    data: {
      url,
    },
  };

  try {
    const registration = await registerNotificationServiceWorker();
    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return;
    }
  } catch {
    // Fall back to page notifications below.
  }

  const notificationInstance = new window.Notification(title, options);
  notificationInstance.onclick = () => {
    window.focus();
    window.location.assign(url);
  };
};

const fetchTransactions = async (token, preferences) => {
  const headers = {
    Authorization: `Bearer ${token.access_token}`,
    "Content-Type": "application/json",
  };

  const requests = [
    notificationAxios
      .get(buildMainTransactionsUrl(), { headers })
      .then((response) => ({
        source: "main",
        transactions: normalizeTransactions(response?.data),
      })),
  ];

  if (preferences.enabled && shouldRequestVirtualTransactions(token)) {
    requests.push(
      notificationAxios
        .get(buildVirtualTransactionsUrl(), { headers })
        .then((response) => ({
          source: "virtual",
          transactions: normalizeTransactions(response?.data),
        }))
        .catch(() => ({
          source: "virtual",
          transactions: [],
        }))
    );
  }

  const results = await Promise.allSettled(requests);

  return results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => {
      const value = result.value || {};
      const transactions = Array.isArray(value.transactions) ? value.transactions : [];

      return transactions.map((transaction) => ({
        source: value.source || "main",
        transaction,
        key: resolveTransactionKey(transaction, value.source || "main"),
        timestamp: resolveTransactionTimestamp(transaction),
      }));
    })
    .sort((left, right) => left.timestamp - right.timestamp);
};

const emitTransactionToasts = (items) => {
  items.forEach((item) => {
    toast.info(buildTransactionSummary(item.transaction, item.source), {
      containerId: TOAST_CONTAINER_ID,
      toastId: item.key,
      autoClose: 7000,
    });
  });
};

const emitDigestToast = (items) => {
  toast.info(buildDigestSummary(items), {
    containerId: TOAST_CONTAINER_ID,
    toastId: `digest:${items[items.length - 1]?.key || Date.now()}`,
    autoClose: 8000,
  });
};

const notifyBrowserIfNeeded = async (items, preferences) => {
  if (
    !preferences.browserNotifications ||
    typeof document === "undefined" ||
    !document.hidden
  ) {
    return;
  }

  if (items.length === 1) {
    const item = items[0];
    await showBrowserNotification({
      title: item.source === "virtual" ? "Virtual Account Alert" : "Transaction Alert",
      body: buildTransactionSummary(item.transaction, item.source),
      url: buildNotificationTargetUrl(item.source),
      tag: item.key,
    });
    return;
  }

  if (!preferences.summaryNotifications) {
    for (const item of items) {
      await showBrowserNotification({
        title: item.source === "virtual" ? "Virtual Account Alert" : "Transaction Alert",
        body: buildTransactionSummary(item.transaction, item.source),
        url: buildNotificationTargetUrl(item.source),
        tag: item.key,
      });
    }
    return;
  }

  await showBrowserNotification({
    title: "Transaction Summary",
    body: buildDigestSummary(items),
    url: buildNotificationTargetUrl(items.some((item) => item.source === "virtual") ? "virtual" : "main"),
    tag: `digest:${items[items.length - 1]?.key || Date.now()}`,
  });
};

const seedSeenTransactions = (items) => {
  saveSeenTransactionKeys(items.map((item) => item.key));
};

const findNewTransactions = (items) => {
  const seenKeys = new Set(readSeenTransactionKeys());
  return items.filter((item) => !seenKeys.has(item.key));
};

const TransactionNotificationCenter = () => {
  const { preferences } = useNotificationPreferences();
  const intervalRef = useRef(null);
  const hasSeededRef = useRef(false);

  useEffect(() => {
    registerNotificationServiceWorker();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const clearPollingInterval = () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const resetNotificationState = () => {
      hasSeededRef.current = false;
      clearSeenTransactionKeys();
      clearPollingInterval();
    };

    const pollTransactions = async () => {
      const token = safeParseToken();

      if (!preferences.enabled || !token?.access_token || !navigator.onLine) {
        return;
      }

      try {
        const items = await fetchTransactions(token, preferences);
        if (!items.length) {
          return;
        }

        if (!hasSeededRef.current) {
          seedSeenTransactions(items);
          hasSeededRef.current = true;
          return;
        }

        const newItems = findNewTransactions(items);
        if (!newItems.length) {
          return;
        }

        emitTransactionToasts(newItems);

        if (preferences.summaryNotifications && newItems.length > 1) {
          emitDigestToast(newItems);
        }

        await notifyBrowserIfNeeded(newItems, preferences);
        mergeSeenTransactionKeys(newItems.map((item) => item.key));
      } catch {
        // Frontend-only notifications should fail silently.
      }
    };

    const startPolling = () => {
      clearPollingInterval();

      if (!preferences.enabled) {
        hasSeededRef.current = false;
        return;
      }

      pollTransactions();
      intervalRef.current = window.setInterval(pollTransactions, POLL_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        pollTransactions();
      }
    };

    const handleOnline = () => {
      pollTransactions();
    };

    const handleAuthChange = () => {
      resetNotificationState();
      startPolling();
    };

    startPolling();
    window.addEventListener("online", handleOnline);
    window.addEventListener(AUTH_STORAGE_EVENT, handleAuthChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearPollingInterval();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener(AUTH_STORAGE_EVENT, handleAuthChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [preferences]);

  return null;
};

export default TransactionNotificationCenter;
