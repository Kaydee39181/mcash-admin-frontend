import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { FETCH_AUDIT } from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
import { history } from '../../utils/history'


export const FetchAudit = (
    page,
    length,
    {
        startDate,
        endDate,

    }
) => dispatch => {
    dispatch(asyncActions(FETCH_AUDIT).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    console.log(token)
    console.log(`bearer ${token.access_token}`,)
    axios
        .get(`${AgentConstant.FETCH_AUDIT_URL}startPage=${page}&length=${length}&startDate=${startDate ? startDate : ""
            }&endDate=${endDate}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            console.log(res)
            const response = res.data
            if (response.responseCode === '00') {
                dispatch(asyncActions(FETCH_AUDIT).success(response.data ? response.data : ''));
            }
        })
        .catch(error => {
            console.log(error)
            dispatch(asyncActions(FETCH_AUDIT).failure(true, error))
        });
};