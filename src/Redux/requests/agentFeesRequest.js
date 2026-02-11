import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import {
    MAXIMUM_RANGE,
    CONVIENIENCE_FEE,
    UPDATE_FEE,
    CREATE_CONVIENCE_FEE
} from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
// import { history } from "../../utils/history";

export const FetchRangeMax = (transactionTypeId) => async (dispatch) => {
    try {
        dispatch(asyncActions(MAXIMUM_RANGE).loading(true));
        const token = JSON.parse(localStorage.getItem("data"));
        console.log(token);
        console.log(`bearer ${token.access_token}`);
        const { data } = await axios.get(
            `${AgentConstant.MAXIMUM_RANGE_URL}transactionTypeId=${transactionTypeId}`,
            {
                headers: {
                    Authorization: `bearer ${token.access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log({ requests_data: data });

        if (data.responseCode === "00") {
            dispatch(asyncActions(MAXIMUM_RANGE).success(data ? data : ""));
        }
        return data;
    } catch (error) {
        console.log(error);
        dispatch(asyncActions(MAXIMUM_RANGE).failure(true, error));
    }
};

export const FetchConvieneceFee = () => (dispatch) => {
    dispatch(asyncActions(CONVIENIENCE_FEE).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    console.log(`bearer ${token.access_token}`);
    axios
        .get(`${AgentConstant.CONVIENIENCE_FEE_URL}`, {
            headers: {
                Authorization: `bearer ${token.access_token}`,
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            console.log(res);
            const response = res.data;
            if (response.responseCode === "00") {
                dispatch(
                    asyncActions(CONVIENIENCE_FEE).success(
                        response.data ? response.data : ""
                    )
                );
            }
        })
        .catch((error) => {
            console.log(error);
            dispatch(asyncActions(CONVIENIENCE_FEE).failure(true, error));
        });
};

export const UpdateFee = ({ id, fee, rangeType, ambassadorCut }) => (
    dispatch
) => {
    console.log(parseInt(id), id);
    dispatch(asyncActions(UPDATE_FEE).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    axios
        .put(
            `${AgentConstant.CONVIENIENCE_FEE_URL}`,
            {
                id: parseInt(id),
                fee,
                rangeType,
                ambassadorCut,
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
                dispatch(asyncActions(UPDATE_FEE).success(response.data));
            } else if (response.responseCode === "XX") {
                dispatch(
                    asyncActions(UPDATE_FEE).failure(true, response.responseMessage)
                );
            }
        })
        .catch((error) => dispatch(asyncActions(UPDATE_FEE).failure(true, error)));
};

export const CreateConvenienceFee = (details) => dispatch => {
    console.log("details", details.fees)
    const { fees:createRequest } = details
   

    dispatch(asyncActions(CREATE_CONVIENCE_FEE).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    axios
        .post(`${AgentConstant.CONVIENIENCE_FEE_URL}`, {
            createRequest
        }, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            const response = res.data
            console.log(response)
            if (response.responseCode === "00") {
                dispatch(asyncActions(CREATE_CONVIENCE_FEE).success(response.data));
            }
            else if (response.responseCode === "XX") {
                dispatch(asyncActions(CREATE_CONVIENCE_FEE).failure(true, response.responseMessage));
            }
        })
        .catch(error => dispatch(asyncActions(CREATE_CONVIENCE_FEE).failure(true, error)));
};