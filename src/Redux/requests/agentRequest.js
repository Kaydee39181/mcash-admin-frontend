import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import {
  FETCH_AGENTS,
  ACTIVATION_CODE,
  FETCH_BANK_TERMINAL,
  ACTIVATE_ASSIGN_TERMINAL,
  UNACTIVATE_ASSIGN_TERMINAL,
  CREATE_AGENTS,
  FETCH_AMBASSADOR_AGENTS,
  ACTIVATE_DEACTIVATE_USER,
  RESET_AGENT_PASSWORD,
  UPDATE_AGENT,
} from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";

export const FetchAgent =
  (
    page,
    length,
    { startDate, endDate, username, businessName, phone, agentId }
  ) =>
  (dispatch) => {
    dispatch(asyncActions(FETCH_AGENTS).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    console.log(`bearer ${token.access_token}`);
    axios
      .get(
        `${AgentConstant.FETCH_AGENT_URL}startPage=${page}&length=${length}&startDate=${startDate}&endDate=${endDate}&username=${username}&businessName=${businessName}&phone=${phone}&agentId=${agentId}
        `,
        {
          headers: {
            Authorization: `bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.status === 200);
        if (res.status === 200) {
          dispatch(asyncActions(FETCH_AGENTS).success(res.data));
        }
      })
      .catch((error) => {
        dispatch(asyncActions(FETCH_AGENTS).failure(true, error));
      });
  };

export const FetchSingleAgent = (username) => (dispatch) => {
  dispatch(asyncActions(FETCH_AGENTS).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(`bearer ${token.access_token}`);
  axios
    .get(
      `${AgentConstant.FETCH_AGENT_URL}&username=${username}
        `,
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log(res);
      console.log(res.status === 200);
      if (res.status === 200) {
        dispatch(asyncActions(FETCH_AGENTS).success(res.data));
      }
    })
    .catch((error) => {
      dispatch(asyncActions(FETCH_AGENTS).failure(true, error));
    });
};

export const FetchambassadorAgent =
  (
    page,
    length,
    { startDate, endDate, username, businessName, phone, agentId }
  ) =>
  (dispatch) => {
    console.log(
      page,
      length,
      startDate,
      endDate,
      username,
      businessName,
      phone,
      agentId
    );
    dispatch(asyncActions(FETCH_AMBASSADOR_AGENTS).loading(true));
    const agentIde = localStorage.getItem("viewagentId");
    const token = JSON.parse(localStorage.getItem("data"));
    console.log(`bearer ${token.access_token}`);
    axios
      .get(
        `${AgentConstant.FETCH_AGENT_URL}startPage=${page}&length=${length}&startDate=${startDate}&endDate=${endDate}&username=${username}&businessName=${businessName}&phone=${phone}&agentManagerId=${agentIde}
        `,
        {
          headers: {
            Authorization: `bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.status === 200);
        if (res.status === 200) {
          dispatch(asyncActions(FETCH_AMBASSADOR_AGENTS).success(res.data));
        }
      })
      .catch((error) => {
        dispatch(asyncActions(FETCH_AMBASSADOR_AGENTS).failure(true, error));
      });
  };

export const ActivatateCode = (agentid) => (dispatch) => {
  console.log(agentid);
  dispatch(asyncActions(ACTIVATION_CODE).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .get(`${AgentConstant.ACTIVATION_CODE_URL}${encodeURIComponent(agentid)}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;
      if (response.responseCode === "00") {
        dispatch(
          asyncActions(ACTIVATION_CODE).success(res.data.activationCode)
        );
      }
    })
    .catch((error) => {
      console.dir(error);
      dispatch(asyncActions(ACTIVATION_CODE).failure(true, error));
    });
};

export const FetchBankTerminal = (agentid) => (dispatch) => {
  console.log(agentid);
  dispatch(asyncActions(FETCH_BANK_TERMINAL).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  axios
    .get(`${AgentConstant.FETCH_BANK_TERMINAAL_URL}${encodeURIComponent(agentid)}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;
      console.log(response);
      if (response.responseCode === "00") {
        dispatch(asyncActions(FETCH_BANK_TERMINAL).success(response.data));
      } else if (response.status === 400) {
        dispatch(
          asyncActions(FETCH_BANK_TERMINAL).failure(
            true,
            response.data.error.message
          )
        );
      }
    })
    .catch((error) =>
      dispatch(asyncActions(FETCH_BANK_TERMINAL).failure(true, error))
    );
};

export const AssignTerminal = (agentid, bankId) => (dispatch) => {
  console.log(agentid);
  dispatch(asyncActions(ACTIVATE_ASSIGN_TERMINAL).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  axios
    .get(
      `${AgentConstant.ACTIVATE_ASSIGN_TERMINAL_URL}${encodeURIComponent(agentid)}&bankCode=${encodeURIComponent(bankId)}`,
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
          asyncActions(ACTIVATE_ASSIGN_TERMINAL).success(response.responseCode)
        );
      } else if (response.status === 400) {
        dispatch(
          asyncActions(ACTIVATE_ASSIGN_TERMINAL).failure(
            true,
            response.data.error.message
          )
        );
      }
    })
    .catch((error) =>
      dispatch(asyncActions(ACTIVATE_ASSIGN_TERMINAL).failure(true, error))
    );
};

export const UnAssignTerminal = (agentid) => (dispatch) => {
  console.log(agentid);
  dispatch(asyncActions(UNACTIVATE_ASSIGN_TERMINAL).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  axios
    .get(`${AgentConstant.UNACTIVATE_ASSIGN_TERMINAL_URL}${encodeURIComponent(agentid)}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;
      console.log(response);
      if (response.responseCode === "00") {
        dispatch(
          asyncActions(UNACTIVATE_ASSIGN_TERMINAL).success(
            response.responseCode
          )
        );
      } else if (response.status === 400) {
        dispatch(
          asyncActions(UNACTIVATE_ASSIGN_TERMINAL).failure(
            true,
            response.data.error.message
          )
        );
      }
    })
    .catch((error) =>
      dispatch(asyncActions(UNACTIVATE_ASSIGN_TERMINAL).failure(true, error))
    );
};

export const CreateAgent =
  ({
    accountNumber,
    accountName,
    accountBvn,
    businessName,
    businessPhone,
    businessAddress,
    gender,
    firstname,
    middlename,
    lastname,
    email,
    username,
    dateOfBirth,
    stateId,
    lgaId,
    bankId,
    agentManagerId,
  }) =>
  (dispatch) => {
    dispatch(asyncActions(CREATE_AGENTS).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    axios
      .post(
        `${AgentConstant.CREATE_AGENT_URL}`,
        {
          accountNumber,
          accountName,
          accountBvn,
          businessName,
          businessPhone,
          businessAddress,
          gender,
          dateOfBirth,
          firstname,
          middlename,
          lastname,
          email,
          username,
          stateId,
          lgaId,
          bankId,
          agentManagerId,
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
          dispatch(asyncActions(CREATE_AGENTS).success(response.data));
        } else if (response.responseCode === "XX") {
          dispatch(
            asyncActions(CREATE_AGENTS).failure(true, response.responseMessage)
          );
        }
      })
      .catch((error) =>
        dispatch(asyncActions(CREATE_AGENTS).failure(true, error))
      );
  };

export const UpdateAgent =
  ({
    accountNumber,
    accountName,
    accountBvn,
    businessName,
    businessPhone,
    businessAddress,
    gender,
    firstname,
    middlename,
    lastname,
    email,
    username,
    stateId,
    lgaId,
    bankId,
  }) =>
  (dispatch) => {
    console.log(
      accountNumber,
      accountName,
      accountBvn,
      businessName,
      businessPhone,
      businessAddress,
      gender,
      firstname,
      middlename,
      lastname,
      email,
      username,
      stateId,
      lgaId,
      bankId
    );
    dispatch(asyncActions(UPDATE_AGENT).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    axios
      .put(
        `${AgentConstant.CREATE_AGENT_URL}`,
        {
          accountNumber,
          accountName,
          accountBvn,
          businessName,
          businessPhone,
          businessAddress,
          gender,
          firstname,
          middlename,
          lastname,
          email,
          username,
          stateId,
          lgaId,
          bankId,
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
          dispatch(asyncActions(UPDATE_AGENT).success(response.data));
        } else if (response.responseCode === "XX") {
          dispatch(
            asyncActions(UPDATE_AGENT).failure(true, response.responseMessage)
          );
        }
      })
      .catch((error) => {
        console.dir(error);
        dispatch(asyncActions(UPDATE_AGENT).failure(true, error));
      });
  };

export const ActivateDeactivateUser = (userId, isActivate) => (dispatch) => {
  console.log(userId, isActivate);
  dispatch(asyncActions(ACTIVATE_DEACTIVATE_USER).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  console.log(token);
  console.log(`bearer ${token.access_token}`);
  axios
    .post(
      `${AgentConstant.ACTIVATE_DEACTIVATE_USER_URL}`,
      {
        userId,
        isActivate,
      },
      {
        headers: {
          Authorization: `bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log(res);
      const response = res.data;
      if (response.responseCode === "00") {
        dispatch(asyncActions(ACTIVATE_DEACTIVATE_USER).success(res.data));
      }
    })
    .catch((error) => {
      console.dir(error);
      dispatch(asyncActions(ACTIVATE_DEACTIVATE_USER).failure(true, error));
    });
};

export const ResetPassword = (agentid) => (dispatch) => {
  dispatch(asyncActions(RESET_AGENT_PASSWORD).loading(true));
  const token = JSON.parse(localStorage.getItem("data"));
  axios
    .get(`${AgentConstant.RESET_AGENT_PASSWORD_URL}${encodeURIComponent(agentid)}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;
      console.log(response);
      if (response.responseCode === "00") {
        dispatch(
          asyncActions(RESET_AGENT_PASSWORD).success(response.responseCode)
        );
      } else {
        dispatch(
          asyncActions(RESET_AGENT_PASSWORD).failure(
            true,
            response?.responseMessage || "Password reset failed"
          )
        );
      }
    })
    .catch((error) => {
      console.dir(error);
      dispatch(asyncActions(RESET_AGENT_PASSWORD).failure(true, error));
    });
};
