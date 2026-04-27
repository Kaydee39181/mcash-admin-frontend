import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS } from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";

const virtualAxios = axios.create();

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

const normalizeAgentDetails = (payload) => {
  if (payload?.agentDetails && typeof payload.agentDetails === "object") {
    return payload.agentDetails;
  }

  if (payload?.data?.agentDetails && typeof payload.data.agentDetails === "object") {
    return payload.data.agentDetails;
  }

  return null;
};

const appendIfPresent = (params, key, value) => {
  if (value === null || value === undefined) return;

  const normalizedValue = String(value).trim();
  if (!normalizedValue) return;

  params.append(key, normalizedValue);
};

const normalizeVirtualAccountTypeFilter = (value) => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue.replace(/\s+(credit|debit)$/i, "");
};

export const buildVirtualAccountUrl = (page = 0, length = 10, filters = {}) => {
  const params = new URLSearchParams();

  params.append("startPage", String(Math.max(0, Number(page) || 0)));
  params.append("length", String(Math.max(1, Number(length) || 10)));

  appendIfPresent(params, "status", filters?.status);
  appendIfPresent(params, "transactionId", filters?.transactionId);
  appendIfPresent(params, "startDate", filters?.startDate);
  appendIfPresent(params, "endDate", filters?.endDate);
  appendIfPresent(params, "accountNumber", filters?.accountNumber);
  appendIfPresent(params, "accountName", filters?.accountName);
  appendIfPresent(params, "bankName", filters?.bankName);
  appendIfPresent(params, "type", normalizeVirtualAccountTypeFilter(filters?.type));
  appendIfPresent(params, "reference", filters?.reference);

  return `${AgentConstant.VIRTUAL_ACCOUNT_TRANSACTIONS_URL}?${params.toString()}`;
};

export const FetchVirtualAccountTransactions =
  (page = 0, length = 10, filters = {}, options = {}) =>
  async (dispatch) => {
    dispatch(asyncActions(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).loading(true));
    const token = safeParseToken();

    if (!token?.access_token) {
      dispatch(
        asyncActions(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).failure(
          true,
          "Unauthorized"
        )
      );
      return;
    }

    try {
      const requestHeaders = {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      };
      const shouldFetchAll = options?.fetchAll === true;

      let payload;
      let data = [];
      let total = 0;
      let agentDetails = null;

      if (shouldFetchAll) {
        const chunkLength = Math.max(1, Number(length) || 100);
        let currentPage = 0;
        let lastPayload = null;
        let expectedTotal = 0;

        while (true) {
          const url = buildVirtualAccountUrl(currentPage, chunkLength, filters);
          const response = await virtualAxios.get(url, {
            headers: requestHeaders,
          });

          const currentPayload = response?.data;
          const currentBatch = normalizeTransactions(currentPayload);
          const currentTotal =
            currentPayload?.recordsFiltered ??
            currentPayload?.recordsTotal ??
            currentPayload?.total ??
            currentBatch.length;

          data = [...data, ...currentBatch];
          expectedTotal = Math.max(expectedTotal, Number(currentTotal) || 0);
          agentDetails = normalizeAgentDetails(currentPayload) || agentDetails;
          lastPayload = currentPayload;

          if (
            currentBatch.length === 0 ||
            currentBatch.length < chunkLength ||
            (expectedTotal > 0 && data.length >= expectedTotal)
          ) {
            payload = lastPayload;
            total = expectedTotal || data.length;
            break;
          }

          currentPage += 1;
        }
      } else {
        const url = buildVirtualAccountUrl(page, length, filters);
        const response = await virtualAxios.get(url, {
          headers: requestHeaders,
        });

        payload = response?.data;
        data = normalizeTransactions(payload);
        total =
          payload?.recordsFiltered ?? payload?.recordsTotal ?? payload?.total ?? data.length;
        agentDetails = normalizeAgentDetails(payload);
      }

      dispatch(
        asyncActions(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).success({
          data,
          total,
          agentDetails,
          raw: payload,
        })
      );
    } catch (error) {
      dispatch(asyncActions(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).failure(true, error));
    }
  };
