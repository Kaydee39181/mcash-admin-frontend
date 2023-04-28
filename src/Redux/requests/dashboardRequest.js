import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { DASHBOARD_BREAKDOWN , DASHBOARD_TRANSACTION_DETAILS} from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
import { history } from '../../utils/history'


export const DashboardBreakdown = () => dispatch => {
    dispatch(asyncActions(DASHBOARD_BREAKDOWN).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.DASHBOARD_BREAKDOWN_URL}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            // console.log(res)
            const response = res.data
            if (response.responseCode === '00') {
                dispatch(asyncActions(DASHBOARD_BREAKDOWN).success(response.data?response.data:''));
            }
        })
        .catch(error => {
            // console.log(error)
            dispatch(asyncActions(DASHBOARD_BREAKDOWN).failure(true, error))
        });
};

export const DashboardDetails= () => dispatch => {
    dispatch(asyncActions(DASHBOARD_TRANSACTION_DETAILS).loading(true));
    const token = JSON.parse(localStorage.getItem("data"))
    axios
        .get(`${AgentConstant.DASHBOARD_TRANSACTION_DETAILS_URL}`, {
            headers: {
                'Authorization': `bearer ${token.access_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            console.log(res)
            const response = res.data
            if (response.responseCode === '00') {
                dispatch(asyncActions(DASHBOARD_TRANSACTION_DETAILS).success(response.data?response.data:''));
            }
        })
        .catch(error => {
            // console.log(error)
            dispatch(asyncActions(DASHBOARD_TRANSACTION_DETAILS).failure(true, error))
        });
};