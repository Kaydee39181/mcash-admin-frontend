import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import {
  AGENT_PURSE,
  CENTRAL_PURSE,
  CREDIT_DEBIT_PURSE,
  PURSE_BALANCE_SUMMARY
} from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
// import { history } from "../../utils/history";

export const FetchAgentPurse = (page, length, { businessName }) => (
  dispatch
) => {
  dispatch(asyncActions(AGENT_PURSE).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  axios
    .get(
      `${AgentConstant.FETCH_AGENT_PURSE_URL}startPage=${page}&length=${length}&businessName=${businessName}`,
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      const response = res.data;
      if (response.responseCode === "00") {
        dispatch(
          asyncActions(AGENT_PURSE).success(response.data ? response.data : [])
        );
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(asyncActions(AGENT_PURSE).failure(true, error));
    });
};

export const FetchCentralPurse = (length, page,
  {
    startDate,
    endDate,
    transactionId,
    transactionType
  }) => (dispatch) => {
    console.log(startDate,
      endDate,
      transactionId,
      transactionType)
    dispatch(asyncActions(CENTRAL_PURSE).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    console.log(token);
    console.log(`bearer ${token.access_token}`);
    axios
      .get(
        `${AgentConstant.FETCH_CENTRAL_PURSE_URL}startPage=${page}&length=${length}&startDate=${startDate}&endDate=${endDate}&transactionId=${transactionId}&transactionType=${transactionType}`,
        {
          headers: {
            Authorization: `bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data)
        const response = res.data;
        if (res.status === 200) {
          dispatch(
            asyncActions(CENTRAL_PURSE).success(response.data ? response : "")
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(asyncActions(CENTRAL_PURSE).failure(true, error));
      });
  };

export const CreditDebitPurse = (
  { amount, action, reason, transactionId },
  agentId
) => (dispatch) => {
  console.log(agentId, amount, action, reason, transactionId);
  dispatch(asyncActions(CREDIT_DEBIT_PURSE).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  axios
    .post(
      `${AgentConstant.CREDIT_DEBIT_PURSE_URL}`,
      {
        agentId,
        amount,
        action,
        reason,
        transactionId,
      },
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      const response = res.data;
      console.log(response);
      if (response.responseCode === "00") {
        dispatch(asyncActions(CREDIT_DEBIT_PURSE).success(response.data));
      } else if (response.responseCode === "XX") {
        dispatch(
          asyncActions(CREDIT_DEBIT_PURSE).failure(
            true,
            response.responseMessage
          )
        );
      }
    })
    .catch((error) =>
      dispatch(asyncActions(CREDIT_DEBIT_PURSE).failure(true, error))
    );
};

export const FetchPurseBalance = () => (dispatch) => {
  dispatch(asyncActions(PURSE_BALANCE_SUMMARY).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(
      `${AgentConstant.PURSE_BALANCE_SUMMARY_URL}`,
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      const response = res.data;

      console.log(response);
      if (response.responseCode === "00") {
        dispatch(
          asyncActions(PURSE_BALANCE_SUMMARY).success(response.data ? response : "")
        );
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(asyncActions(PURSE_BALANCE_SUMMARY).failure(true, error));
    });
};
