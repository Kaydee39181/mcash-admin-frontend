import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { FETCH_HARDWARES, ACTIVATE_HARDWARES,DEACTIVATE_HARDWARES } from "../actions/actionTypes";

export const FetchHardWare = (memberId) => async (dispatch) => {
    console.log("memberId",memberId)
  dispatch(asyncActions(FETCH_HARDWARES).loading(true));
  try {
    dispatch(asyncActions(FETCH_HARDWARES).loading(true));
    const { data } = await axios.get(
      `https://cashout.mcashpoint.com/hardware?memberId=${memberId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data.data)
    dispatch(asyncActions(FETCH_HARDWARES).success(data.data));
  } catch (error) {
    dispatch(asyncActions(FETCH_HARDWARES).failure(true, error));
  }
};

export const ActivateHardWare =
  ({ serialNumber }, memberId) =>
  async (dispatch) => {
    dispatch(asyncActions(ACTIVATE_HARDWARES).loading(true));
    try {
      const { data } = await axios.post(
        `https://cashout.mcashpoint.com/hardware/assign`,
        { memberId, serialNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("dataResponse", data.responseCode);
      if (data.responseCode === "00") {
        dispatch(
          asyncActions(ACTIVATE_HARDWARES).success(data)
        );
      } else {
        console.log("dataResponse", data);

        dispatch(
          asyncActions(ACTIVATE_HARDWARES).success(data)
        );
      }
    } catch (error) {
      dispatch(asyncActions(ACTIVATE_HARDWARES).failure(true, error));
    }
  };

  export const DeActivateHardWare =
  ({ serialNumber }, memberId) =>
  async (dispatch) => {
    dispatch(asyncActions(DEACTIVATE_HARDWARES).loading(true));
    try {
      const { data } = await axios.post(
        `https://cashout.mcashpoint.com/hardware/un-assign`,
        { memberId, serialNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("dataResponse", data.responseCode);
      if (data.responseCode === "00") {
        dispatch(
          asyncActions(DEACTIVATE_HARDWARES).success(data)
        );
      } else {
        console.log("dataResponse", data);

        dispatch(
          asyncActions(DEACTIVATE_HARDWARES).success(data)
        );
      }
    } catch (error) {
      dispatch(asyncActions(DEACTIVATE_HARDWARES).failure(true, error));
    }
  };

