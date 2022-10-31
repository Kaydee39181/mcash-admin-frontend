import { AgentConstant } from "../../constants/constants";
import { asyncActions } from "../../utils/asyncUtil";
import { OPEN_GTB_ACCOUNT } from "../actions/actionTypes";
import axios from "axios";
export const openGTBankAccount = (data) => async (dispatch) => {
  dispatch(asyncActions(OPEN_GTB_ACCOUNT).loading(true));
  try {
    const data = await axios.post(`${AgentConstant.OPEN_GTB_ACCOUNT}`, data);
    console.log(data);
    /* if (data.responseCode === '00') {
      dispatch(asyncActions(OPEN_GTB_ACCOUNT).success(data.data));
    }
    else {
      dispatch(asyncActions(OPEN_GTB_ACCOUNT).failure(true));

    } */
  } catch (error) {
    dispatch(asyncActions(OPEN_GTB_ACCOUNT).failure(true, error));
  }
};
