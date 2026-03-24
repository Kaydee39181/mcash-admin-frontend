import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import {
  FETCH_TRANSACTIONS,
  FETCH_TRANSACTIONS_TYPES,
  FETCH_TRANSACTIONS_SINGLE,
  FETCH_TRANSACTIONS_STATUS,
} from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
// import { history } from "../../utils/history";

const buildTransactionUrl = (page, length, filters = {}) => {
  const params = new URLSearchParams();

  params.append("startPage", page);
  params.append("length", length);

  const appendIfPresent = (key, value) => {
    if (value === null || value === undefined) return;
    const normalized = String(value).trim();
    if (!normalized) return;
    params.append(key, normalized);
  };

  appendIfPresent("agentId", filters.agentId);
  appendIfPresent("agentManagerId", filters.agentManagerId);
  appendIfPresent("agentManagerName", filters.agentManagerName);
  appendIfPresent("startDate", filters.startDate);
  appendIfPresent("endDate", filters.endDate);
  appendIfPresent("terminalId", filters.terminalId);
  appendIfPresent("status", filters.status);
  appendIfPresent("transactionTypeId", filters.transactionType);
  appendIfPresent("transactionId", filters.transactionId);
  appendIfPresent("rrn", filters.rrn);
  appendIfPresent("pan", filters.pan);
  appendIfPresent("stan", filters.stan);
  appendIfPresent("draw", filters.draw);

  return `${AgentConstant.FETCH_TRANSACTIONS_URL}${params.toString()}`;
};

export const FetchTransaction = (
  page,
  length,
  {
    startDate,
    endDate,
    terminalId,
    status,
    transactionType,
    transactionId,
    rrn,
    pan,
    stan,
    agentId,
    agentManagerId,
    agentManagerName,
    draw,
  }
) => (dispatch) => {
  dispatch(asyncActions(FETCH_TRANSACTIONS).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(buildTransactionUrl(page, length, {
      startDate,
      endDate,
      terminalId,
      status,
      transactionType,
      transactionId,
      rrn,
      pan,
      stan,
      agentId,
      agentManagerId,
      agentManagerName,
      draw,
    }), {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch(asyncActions(FETCH_TRANSACTIONS).success(res.data));
      }
    })
    .catch((error) => {
      // console.log(error)
      dispatch(asyncActions(FETCH_TRANSACTIONS).failure(true, error));
    });
};

export const FetchTransactionTypes = () => (dispatch) => {
  dispatch(asyncActions(FETCH_TRANSACTIONS_TYPES).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(`${AgentConstant.FETCH_TRANSACTIONS_TYPES_URL}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;

      console.log(response);
      if (res.status === 200) {
        console.log(response.data);

        dispatch(
          asyncActions(FETCH_TRANSACTIONS_TYPES).success(
            response.data ? response : ""
          )
        );
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(asyncActions(FETCH_TRANSACTIONS_TYPES).failure(true, error));
    });
};

export const FetchTransactionSingle = (
  page,
  length,
  {
    startDate,
    endDate,
    terminalId,
    status,
    transactionType,
    transactionId,
    rrn,
    pan,
    stan,
    agentId,
    agentManagerId,
    agentManagerName,
    draw,
  }
) => (dispatch) => {
  dispatch(asyncActions(FETCH_TRANSACTIONS_SINGLE).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  const agentIde = localStorage.getItem("agentId");
  console.log(agentIde);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(buildTransactionUrl(page, length, {
      startDate,
      endDate,
      terminalId,
      status,
      transactionType,
      transactionId,
      rrn,
      pan,
      stan,
      agentId: agentIde,
      agentManagerId,
      agentManagerName,
      draw,
    }), {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch(asyncActions(FETCH_TRANSACTIONS_SINGLE).success(res.data));
      }
    })
    .catch((error) => {
      // console.log(error)
      dispatch(asyncActions(FETCH_TRANSACTIONS_SINGLE).failure(true, error));
    });
};

export const FetchTransactionStatus = () => (dispatch) => {
  dispatch(asyncActions(FETCH_TRANSACTIONS_STATUS).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(`${AgentConstant.FETCH_TRANSACTIONS_STATUS_URL}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;

      console.log(response);
      if (res.status === 200) {
        dispatch(
          asyncActions(FETCH_TRANSACTIONS_STATUS).success(
            response.data ? response : ""
          )
        );
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(asyncActions(FETCH_TRANSACTIONS_STATUS).failure(true, error));
    });
};
