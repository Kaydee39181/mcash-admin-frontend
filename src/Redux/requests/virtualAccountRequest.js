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

const buildVirtualAccountUrl = (filters) => {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.append("status", filters.status);
  }

  if (filters?.transactionId) {
    params.append("transactionId", filters.transactionId);
  }

  if (filters?.startDate) {
    params.append("startDate", filters.startDate);
  }

  if (filters?.endDate) {
    params.append("endDate", filters.endDate);
  }

  const query = params.toString();
  if (!query) return `${AgentConstant.VIRTUAL_ACCOUNT_TRANSACTIONS_URL}?`;
  return `${AgentConstant.VIRTUAL_ACCOUNT_TRANSACTIONS_URL}?${query}`;
};

export const FetchVirtualAccountTransactions =
  (filters = {}) =>
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
      const url = buildVirtualAccountUrl(filters);
      const response = await virtualAxios.get(url, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const payload = response?.data;
      const data = normalizeTransactions(payload);
      const total =
        payload?.recordsFiltered ?? payload?.recordsTotal ?? payload?.total ?? data.length;
      const agentDetails = normalizeAgentDetails(payload);

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
