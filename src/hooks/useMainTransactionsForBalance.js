import { useEffect, useState } from "react";
import axios from "axios";

import { AgentConstant } from "../constants/constants";

const DEFAULT_START_PAGE = 0;
const DEFAULT_LENGTH = 10;

const mainTransactionsAxios = axios.create();

const safeParseToken = () => {
  const raw = localStorage.getItem("data");
  if (!raw) return null;

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

const resolveTransactionTimestamp = (transaction) => {
  const rawValue =
    transaction?.systemTime ||
    transaction?.appTime ||
    transaction?.transactionDate ||
    transaction?.createdAt ||
    transaction?.date ||
    transaction?.timestamp;

  if (!rawValue) {
    return 0;
  }

  const parsedValue = new Date(rawValue).getTime();
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const getLatestTransaction = (transactions) => {
  const rows = Array.isArray(transactions) ? [...transactions] : [];

  return rows
    .sort(
      (leftTransaction, rightTransaction) =>
        resolveTransactionTimestamp(rightTransaction) -
        resolveTransactionTimestamp(leftTransaction)
    )
    .find(Boolean) || null;
};

const buildMainTransactionsUrl = (startPage, length) => {
  const params = new URLSearchParams();
  params.append("startPage", String(startPage));
  params.append("length", String(length));

  return `${AgentConstant.FETCH_TRANSACTIONS_URL}${params.toString()}`;
};

export const useMainTransactionsForBalance = ({
  enabled = false,
  startPage = DEFAULT_START_PAGE,
  length = DEFAULT_LENGTH,
} = {}) => {
  const [state, setState] = useState({
    balance: null,
    loading: false,
    error: null,
    latestTransaction: null,
  });

  const token = safeParseToken();
  const accessToken = token?.access_token || "";

  useEffect(() => {
    let isActive = true;

    if (!enabled) {
      setState({
        balance: null,
        loading: false,
        error: null,
        latestTransaction: null,
      });
      return undefined;
    }

    if (!accessToken) {
      setState({
        balance: null,
        loading: false,
        error: new Error("Unauthorized"),
        latestTransaction: null,
      });
      return undefined;
    }

    const fetchBalance = async () => {
      setState((previousState) => ({
        ...previousState,
        loading: true,
        error: null,
      }));

      try {
        const response = await mainTransactionsAxios.get(
          buildMainTransactionsUrl(startPage, length),
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

        const latestTransaction = getLatestTransaction(
          normalizeTransactions(response?.data)
        );

        setState({
          balance: latestTransaction?.postPurseBalance ?? null,
          loading: false,
          error: null,
          latestTransaction,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({
          balance: null,
          loading: false,
          error,
          latestTransaction: null,
        });
      }
    };

    fetchBalance();

    return () => {
      isActive = false;
    };
  }, [accessToken, enabled, length, startPage]);

  return state;
};

export default useMainTransactionsForBalance;
