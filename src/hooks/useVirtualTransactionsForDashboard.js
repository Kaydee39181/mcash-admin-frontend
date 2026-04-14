import { useEffect, useState } from "react";
import axios from "axios";

import { AgentConstant } from "../constants/constants";

const DEFAULT_START_PAGE = 0;
const DEFAULT_LENGTH = 10;
const FALLBACK_VALUE = "N/A";

const dashboardVirtualAxios = axios.create();

const safeParseToken = () => {
  const raw = localStorage.getItem("data");
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

const formatAccountName = (transaction) => {
  const firstName = toText(transaction?.agent?.user?.firstname);
  const lastName = toText(transaction?.agent?.user?.lastname);
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName ? `MCASHPOINT-${fullName}` : FALLBACK_VALUE;
};

const extractDashboardAccountInfo = (transaction) => ({
  accountNumber: toText(transaction?.agent?.globusVirtualAccount) || FALLBACK_VALUE,
  accountName: formatAccountName(transaction),
});

const buildDashboardVirtualTransactionsUrl = (startPage, length) => {
  const params = new URLSearchParams();
  params.append("startPage", String(Math.max(0, Number(startPage) || 0)));
  params.append("length", String(Math.max(1, Number(length) || DEFAULT_LENGTH)));

  return `${AgentConstant.VIRTUAL_ACCOUNT_TRANSACTIONS_URL}?${params.toString()}`;
};

export const useVirtualTransactionsForDashboard = ({
  enabled = false,
  startPage = DEFAULT_START_PAGE,
  length = DEFAULT_LENGTH,
} = {}) => {
  const [state, setState] = useState({
    accountNumber: FALLBACK_VALUE,
    accountName: FALLBACK_VALUE,
    loading: false,
  });

  const token = safeParseToken();
  const accessToken = token?.access_token || "";

  useEffect(() => {
    let isActive = true;

    if (!enabled) {
      setState({
        accountNumber: FALLBACK_VALUE,
        accountName: FALLBACK_VALUE,
        loading: false,
      });
      return undefined;
    }

    if (!accessToken) {
      setState({
        accountNumber: FALLBACK_VALUE,
        accountName: FALLBACK_VALUE,
        loading: false,
      });
      return undefined;
    }

    const fetchVirtualTransactions = async () => {
      setState((previousState) => ({
        ...previousState,
        loading: true,
      }));

      try {
        const response = await dashboardVirtualAxios.get(
          buildDashboardVirtualTransactionsUrl(startPage, length),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!isActive) {
          return;
        }

        const transactions = normalizeTransactions(response?.data);
        const latestTransaction = Array.isArray(transactions) ? transactions[0] : null;

        setState({
          ...extractDashboardAccountInfo(latestTransaction),
          loading: false,
        });
      } catch {
        if (!isActive) {
          return;
        }

        setState({
          accountNumber: FALLBACK_VALUE,
          accountName: FALLBACK_VALUE,
          loading: false,
        });
      }
    };

    fetchVirtualTransactions();

    return () => {
      isActive = false;
    };
  }, [accessToken, enabled, length, startPage]);

  return state;
};

export default useVirtualTransactionsForDashboard;
