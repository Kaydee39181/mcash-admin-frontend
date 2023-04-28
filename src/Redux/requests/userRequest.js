import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { LOGIN_USER, LOGOUT_USER, USER_CHANGE_PASSWORD } from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
import { history } from '../../utils/history'


export const loginUser = ({ username, password }) => async (dispatch) => {
  dispatch(asyncActions(LOGIN_USER).loading(true));
  try {
    const { data } = await axios.post(`${AgentConstant.LOGIN_AGENT_URL}`, { username, password })
    if (data.responseCode === '00') {
      dispatch(asyncActions(LOGIN_USER).success(data.data));
    } else if (data.responseCode === '03') {
      dispatch(asyncActions(LOGIN_USER).success(data.data));
      window.location.replace('/changepassword')
    }
    else {
      dispatch(asyncActions(LOGIN_USER).failure(true));

    }
  } catch (error) {
    dispatch(asyncActions(LOGIN_USER).failure(true, error))
  }
};

export const logoutUser = () => dispatch => {
  dispatch(asyncActions(LOGOUT_USER).success(true));
}

export const UserChangePassword = ({ oldPassword, password, confirmPassword }) => async (dispatch) => {
  dispatch(asyncActions(USER_CHANGE_PASSWORD).loading(true));
  const token = JSON.parse(localStorage.getItem("data"))
  try {
    const { data } = await axios.patch(`${AgentConstant.CHANGE_PASSWORD_URL}`, { oldPassword, password, confirmPassword }, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    if (data.responseCode === '00') {
      dispatch(asyncActions(USER_CHANGE_PASSWORD).success(data.data));
    } else if (data.responseCode === "XX") {
      dispatch(
        asyncActions(USER_CHANGE_PASSWORD).failure(true, data.responseMessage)
      );
    }

  } catch (error) {
    return dispatch(asyncActions(USER_CHANGE_PASSWORD).failure(true, error))
  }
};

