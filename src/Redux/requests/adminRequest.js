import axios from "axios";
import {
    asyncActions
} from "../../utils/asyncUtil";
import {
    FETCH_ADMIN_USERS,
    CREATE_ADMIN,
    UPDATE_ADMIN
} from "../actions/actionTypes";
import {
    AgentConstant
} from "../../constants/constants";

export const FetchAdmin = (
    page,
    length
) => dispatch => {
    dispatch(asyncActions(FETCH_ADMIN_USERS).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.ADMIN_USERS_URL}startPage=${page}&length=${length}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then((res) => {
            const response = res.data;
            if (response.responseCode === "00") {
                dispatch(asyncActions(FETCH_ADMIN_USERS).success(response.data));
            }
        })
        .catch((error) => {
            dispatch(asyncActions(FETCH_ADMIN_USERS).failure(true, error));
        });
};

export const CreateAdmin = ({
    firstname,
    lastname,
    email,
    username,
    roleGroupName,
}) => (dispatch) => {
    dispatch(asyncActions(CREATE_ADMIN).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    axios
        .post(
            `${AgentConstant.ADMIN_USERS_URL}`, {
                firstname,
                lastname,
                email,
                username,
                roleGroupName,
            }, {
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
                dispatch(asyncActions(CREATE_ADMIN).success(response.data));
            } else if (response.responseCode === "XX") {
                dispatch(
                    asyncActions(CREATE_ADMIN).failure(true, response.responseMessage)
                );
            }
        })
        .catch((error) =>
            dispatch(asyncActions(CREATE_ADMIN).failure(true, error))
        );
};

export const UpdateAdmin = ({
    id,
    firstname,
    lastname,
    email,
    username,
    roleGroupName,
}) => (dispatch) => {
    console.log(parseInt(id), id)
    dispatch(asyncActions(UPDATE_ADMIN).loading(true));
    const token = JSON.parse(localStorage.getItem("data"));
    axios
        .put(
            `${AgentConstant.ADMIN_USERS_URL}`, {
                id: parseInt(id),
                firstname,
                lastname,
                email,
                username,
                roleGroupName,
            }, {
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
                dispatch(asyncActions(UPDATE_ADMIN).success(response.data));
            } else if (response.responseCode === "XX") {
                dispatch(
                    asyncActions(UPDATE_ADMIN).failure(true, response.responseMessage)
                );
            }
        })
        .catch((error) =>
            dispatch(asyncActions(UPDATE_ADMIN).failure(true, error))
        );
};