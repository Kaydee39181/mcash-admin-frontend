import { asyncActionName } from "../../utils/asyncUtil";
import { FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS } from "../actions/actionTypes";

const initialState = {
  transactions: [],
  transactionTotal: 0,
  loading: false,
  error: null,
};

const VirtualAccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case asyncActionName(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).loading:
      return { ...state, loading: true, error: null };
    case asyncActionName(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).success:
      return {
        ...state,
        transactions: action.payload.data,
        transactionTotal: action.payload.total,
        loading: false,
        error: null,
      };
    case asyncActionName(FETCH_VIRTUAL_ACCOUNT_TRANSACTIONS).failure:
      return {
        ...state,
        loading: false,
        error: action.payload,
        transactions: [],
        transactionTotal: 0,
      };
    default:
      return state;
  }
};

export default VirtualAccountReducer;
