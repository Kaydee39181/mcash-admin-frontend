import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { FETCH_AGENTS_MANAGER, FETCH_LGA, FETCH_STATE, FETCH_BANK, CREATE_AGENTS_MANAGER, AGENT_MANAGER_SETTLEMENT } from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
import { history } from '../../utils/history'


export const FetchAgentManager = (
    page,
    length, {
        username,
        phone
    }
) => dispatch => {
    dispatch(asyncActions(FETCH_AGENTS_MANAGER).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.FETCH_AGENT_MANAGER_URL}startPage=${page}&length=${length}&username=${username}&phone=${phone}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            console.log(res.status == 200)
            if (res.status == 200) {
                dispatch(asyncActions(FETCH_AGENTS_MANAGER).success(res.data));
            }
        })
        .catch(error => {
            // console.log(error)
            dispatch(asyncActions(FETCH_AGENTS_MANAGER).failure(true, error))
        });
};

export const FetchState = () => dispatch => {
    dispatch(asyncActions(FETCH_STATE).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.FETCH_STATE_URL}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            const response = res.data
            console.log(response)
            if (response.responseCode === "00") {
                dispatch(asyncActions(FETCH_STATE).success(response.data));
            } else if (response.status === 400) {
                dispatch(asyncActions(FETCH_STATE).failure(true, response.data.error.message));
            }
        })
        .catch(error => dispatch(asyncActions(FETCH_STATE).failure(true, error)));
};


export const FetchLga = (stateCode) => dispatch => {
    console.log(stateCode)
    dispatch(asyncActions(FETCH_LGA).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.FETCH_LGA_URL}=${stateCode}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            const response = res.data
            console.log(response)
            if (response.responseCode === "00") {
                dispatch(asyncActions(FETCH_LGA).success(response.data));
            } else if (response.status === 400) {
                dispatch(asyncActions(FETCH_LGA).failure(true, response.data.error.message));
            }
        })
        .catch(error => dispatch(asyncActions(FETCH_LGA).failure(true, error)));
};

export const FetchBank = () => dispatch => {
    dispatch(asyncActions(FETCH_BANK).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.FETCH_BANK_URL}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            const response = res.data
            console.log(response)
            if (response.responseCode === "00") {
                dispatch(asyncActions(FETCH_BANK).success(response.data));
            } else if (response.status === 400) {
                dispatch(asyncActions(FETCH_BANK).failure(true, response.data.error.message));
            }
        })
        .catch(error => dispatch(asyncActions(FETCH_BANK).failure(true, error)));
};


export const CreateAgentManager = ({
    firstname,
    lastname,
    gender,
    email,
    phone,
    accountName,
    accountNumber,
    address,
    accountBvn,
    dateOfBirth,
    username,
    nationality,
    identityType,
    stateId,
    lgaId,
    bankId
}) => dispatch => {
    dispatch(asyncActions(CREATE_AGENTS_MANAGER).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .post(`${AgentConstant.CREATE_AGENT_MANAGER_URL}`, {
            firstname,
            lastname,
            gender,
            email,
            phone,
            accountName,
            accountNumber,
            address,
            accountBvn,
            dateOfBirth,
            username,
            nationality,
            identityType,
            stateId,
            lgaId,
            bankId
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
                dispatch(asyncActions(CREATE_AGENTS_MANAGER).success(response.data));
            } else if (response.responseCode === "XX") {
                console.log(response.responseMessage)
                dispatch(asyncActions(CREATE_AGENTS_MANAGER).failure(true, response.responseMessage));
            }
        })
        .catch(error => dispatch(asyncActions(CREATE_AGENTS_MANAGER).failure(true, error)));
};

export const FetchSettlement = (
    page,
    length, {
        username,
        month,
        year
    }
) => dispatch => {
    dispatch(asyncActions(AGENT_MANAGER_SETTLEMENT).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.AGENT_MANAGER_SETTLEMENT_URL}startPage=${page}&length=${length}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            const response = res.data
            console.log(response.data.data)
            if (response.responseCode === "00") {
                dispatch(asyncActions(AGENT_MANAGER_SETTLEMENT).success(response.data));
            } else if (response.status === 400) {
                dispatch(asyncActions(AGENT_MANAGER_SETTLEMENT).failure(true, response.data.error.message));
            }
        })
        .catch(error => dispatch(asyncActions(AGENT_MANAGER_SETTLEMENT).failure(true, error)));
};