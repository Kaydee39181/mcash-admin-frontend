import React, { useEffect, useMemo, useState } from "react";

import { copyTextToClipboard } from "../../utils/copyToClipboard";

import "./style.css";

const BALANCE_VISIBILITY_STORAGE_KEY =
  "mcash_virtual_account_balance_visibility";

const CopyIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="9"
      y="9"
      width="10"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M6 15H5C3.9 15 3 14.1 3 13V5C3 3.9 3.9 3 5 3H13C14.1 3 15 3.9 15 5V6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = ({ hidden = false }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d={
        hidden
          ? "M3 4.5L20 21.5M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42M9.88 5.09C10.56 4.86 11.27 4.75 12 4.75C17.25 4.75 21 12 21 12C20.43 13.06 19.69 14.02 18.81 14.84M14.12 18.91C13.44 19.14 12.73 19.25 12 19.25C6.75 19.25 3 12 3 12C3.57 10.94 4.31 9.98 5.19 9.16"
          : "M2.25 12S5.25 5.25 12 5.25S21.75 12 21.75 12S18.75 18.75 12 18.75S2.25 12 2.25 12Z"
      }
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {!hidden && (
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    )}
  </svg>
);

const formatBalance = (value) => {
  if (value === null || value === undefined || value === "") {
    return "₦0.00";
  }

  const numeric = Number(String(value).replace(/,/g, ""));

  if (Number.isNaN(numeric)) {
    return "₦0.00";
  }

  return `₦${numeric.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const readValue = (value) => {
  const text = String(value ?? "").trim();
  return text || "--";
};

const safeParseToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawToken = window.localStorage.getItem("data");
  if (!rawToken) {
    return null;
  }

  try {
    return JSON.parse(rawToken);
  } catch {
    return null;
  }
};

const resolvePreferenceKey = (accountNumber = "") => {
  const token = safeParseToken();
  const user = token?.user;

  const userId = String(user?.id ?? "").trim();
  if (userId) {
    return `user-id:${userId}`;
  }

  const username = String(user?.username ?? "").trim();
  if (username) {
    return `username:${username.toLowerCase()}`;
  }

  const agentId = String(user?.agent?.id ?? "").trim();
  if (agentId) {
    return `agent-id:${agentId}`;
  }

  const normalizedAccountNumber = String(accountNumber ?? "").trim();
  if (normalizedAccountNumber) {
    return `account:${normalizedAccountNumber}`;
  }

  return "";
};

const readBalanceVisibilityPreference = (preferenceKey) => {
  if (typeof window === "undefined" || !preferenceKey) {
    return true;
  }

  try {
    const rawPreferences = window.localStorage.getItem(
      BALANCE_VISIBILITY_STORAGE_KEY
    );
    if (!rawPreferences) {
      return true;
    }

    const parsedPreferences = JSON.parse(rawPreferences);
    if (
      !parsedPreferences ||
      typeof parsedPreferences !== "object" ||
      Array.isArray(parsedPreferences)
    ) {
      return true;
    }

    const storedValue = parsedPreferences[preferenceKey];
    return typeof storedValue === "boolean" ? storedValue : true;
  } catch {
    return true;
  }
};

const writeBalanceVisibilityPreference = (preferenceKey, isVisible) => {
  if (typeof window === "undefined" || !preferenceKey) {
    return;
  }

  try {
    const rawPreferences = window.localStorage.getItem(
      BALANCE_VISIBILITY_STORAGE_KEY
    );
    const parsedPreferences = rawPreferences ? JSON.parse(rawPreferences) : {};
    const nextPreferences =
      parsedPreferences &&
      typeof parsedPreferences === "object" &&
      !Array.isArray(parsedPreferences)
        ? parsedPreferences
        : {};

    nextPreferences[preferenceKey] = isVisible;

    window.localStorage.setItem(
      BALANCE_VISIBILITY_STORAGE_KEY,
      JSON.stringify(nextPreferences)
    );
  } catch {
    // Ignore persistence failures and keep the in-memory toggle working.
  }
};

const MASKED_BALANCE = "₦ •••••";

const VirtualAccountSummary = ({
  accountName = "",
  accountNumber = "",
  bankName = "",
  balance = null,
  balanceLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const preferenceKey = useMemo(
    () => resolvePreferenceKey(accountNumber),
    [accountNumber]
  );
  const [isBalanceVisible, setIsBalanceVisible] = useState(() =>
    readBalanceVisibilityPreference(resolvePreferenceKey(accountNumber))
  );

  const formattedBalance = useMemo(() => formatBalance(balance), [balance]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  useEffect(() => {
    setIsBalanceVisible(readBalanceVisibilityPreference(preferenceKey));
  }, [preferenceKey]);

  const handleCopy = async () => {
    if (!accountNumber) {
      return;
    }

    try {
      await copyTextToClipboard(accountNumber);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleBalanceVisibilityToggle = () => {
    setIsBalanceVisible((previousState) => {
      const nextState = !previousState;
      writeBalanceVisibilityPreference(preferenceKey, nextState);
      return nextState;
    });
  };

  return (
    <section
      className="virtual-account-summary"
      aria-label="Agent virtual account summary"
    >
      <div className="virtual-account-summary__grid">
        <div className="virtual-account-summary__balance-card">
          <div className="virtual-account-summary__balance-top">
            <span className="virtual-account-summary__eyebrow">Available Balance</span>

            <button
              type="button"
              className="virtual-account-summary__icon-btn"
              onClick={handleBalanceVisibilityToggle}
              aria-label={isBalanceVisible ? "Hide available balance" : "Show available balance"}
              aria-pressed={!isBalanceVisible}
              title={isBalanceVisible ? "Hide balance" : "Show balance"}
            >
              <EyeIcon hidden={!isBalanceVisible} />
            </button>
          </div>

          <div
            className={`virtual-account-summary__balance-value${
              !isBalanceVisible && !balanceLoading
                ? " virtual-account-summary__balance-value--masked"
                : ""
            }`}
          >
            {balanceLoading ? (
              <span
                className="virtual-account-summary__balance-skeleton"
                aria-hidden="true"
              />
            ) : isBalanceVisible ? (
              formattedBalance
            ) : (
              MASKED_BALANCE
            )}
          </div>
        </div>

        <div className="virtual-account-summary__detail-card">
          <span className="virtual-account-summary__detail-label">Account Name</span>
          <span className="virtual-account-summary__detail-value">
            {readValue(accountName)}
          </span>
        </div>

        <div className="virtual-account-summary__detail-card">
          <span className="virtual-account-summary__detail-label">Account Number</span>

          <div className="virtual-account-summary__account-row">
            <span className="virtual-account-summary__detail-value virtual-account-summary__detail-value--mono">
              {readValue(accountNumber)}
            </span>

            <button
              type="button"
              className={`virtual-account-summary__copy-btn${
                copied ? " virtual-account-summary__copy-btn--copied" : ""
              }`}
              onClick={handleCopy}
              disabled={!accountNumber}
              aria-label={copied ? "Account number copied" : "Copy account number"}
              title={copied ? "Copied!" : "Copy account number"}
            >
              <CopyIcon />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>

        <div className="virtual-account-summary__detail-card">
          <span className="virtual-account-summary__detail-label">Bank Name</span>
          <span className="virtual-account-summary__detail-value">
            {readValue(bankName)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default VirtualAccountSummary;
