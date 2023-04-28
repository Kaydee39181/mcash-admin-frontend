import { asyncActionName } from "../../utils/asyncUtil";
import {
    MAXIMUM_RANGE, CONVIENIENCE_FEE, UPDATE_FEE, CREATE_CONVIENCE_FEE
} from "../actions/actionTypes";

const initialState = {
    maxrange: null,
    loading: false,
    conviencefees: [],
    successCreatefees:null

};

const AgentsFeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case asyncActionName(MAXIMUM_RANGE).loading:
            console.log("1");
            return { ...state, loading: true };
        case asyncActionName(MAXIMUM_RANGE).success:
            return {
                ...state,
                maxrange: action.payload,
                success: true,
                loading: false,
                error: false,
            };
        case asyncActionName(MAXIMUM_RANGE).failure:
            return {
                ...state,
                maxrange: null,
                success: false,
                loading: false,
                error: true,
                // failure
            };
        case asyncActionName(CONVIENIENCE_FEE).loading:
            console.log("1");
            return { ...state, loading: true };
        case asyncActionName(CONVIENIENCE_FEE).success:
            return {
                ...state,
                conviencefees: action.payload,
                success: true,
                loading: false,
                error: false,
            };
        case asyncActionName(CONVIENIENCE_FEE).failure:
            return {
                ...state,
                maxrange: null,
                success: false,
                loading: false,
                error: true,
                // failure
            };
        case asyncActionName(UPDATE_FEE).loading:
            return { ...state, loading: true };
        case asyncActionName(UPDATE_FEE).success:
            return {
                ...state,
                loading: false,
                successUpdate: true
            };
        case asyncActionName(UPDATE_FEE).failure:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload,
                error: true,
                successUpdate: false
            };
        case asyncActionName(CREATE_CONVIENCE_FEE).loading:
            return { ...state, loading: true };
        case asyncActionName(CREATE_CONVIENCE_FEE).success:
            return {
                ...state,
                loading: false,
                successCreatefees: true
            };
        case asyncActionName(CREATE_CONVIENCE_FEE).failure:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload,
                error: true,
                successCreatefees: false
            };

        default:
            return state;
    }
};

export default AgentsFeeReducer;
