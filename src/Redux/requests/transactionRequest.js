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
    agentManagerName,
    draw,
  }
) => (dispatch) => {
  dispatch(asyncActions(FETCH_TRANSACTIONS).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(
      `${
        AgentConstant.FETCH_TRANSACTIONS_URL
      }startPage=${page}&length=${length}&agentId=${agentId}&agentManagerName=${encodeURIComponent(agentManagerName || "")}&startDate=${
        startDate ? startDate : ""
      }&endDate=${endDate || ""}&terminalId=${terminalId}&status=${status}&transactionTypeId=${transactionType}&transactionId=${transactionId}&rrn=${rrn}&pan=${pan}&stan=${stan}`,
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
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
    .get(
      `${
        AgentConstant.FETCH_TRANSACTIONS_URL
      }startPage=${page}&length=${length}&agentId=${agentIde}&startDate=${
        startDate ? startDate : ""
      }&endDate=${endDate || ""}&terminalId=${terminalId}&status=${status}&transactionTypeId=${transactionType}&transactionId=${transactionId}&rrn=${rrn}&pan=${pan}&stan=${stan}&agentManagerName=${encodeURIComponent(agentManagerName || "")}`,
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
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
