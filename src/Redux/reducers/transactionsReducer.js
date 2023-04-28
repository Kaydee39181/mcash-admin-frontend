import { asyncActionName } from "../../utils/asyncUtil";
import {
  FETCH_TRANSACTIONS,
  FETCH_TRANSACTIONS_TYPES,
  FETCH_TRANSACTIONS_SINGLE,
  FETCH_TRANSACTIONS_STATUS
} from "../actions/actionTypes";

const initialState = {
  transactions: [],
  transactionsType: [],
  transactionTotal: 0,
  successTransaction: false,
  transactionStatus:[]
  // failure:'user cant be logged in'
};

const TransactionsReducer = (state = initialState, action) => {
  // console.log(action.type )
  switch (action.type) {
    case asyncActionName(FETCH_TRANSACTIONS).loading:
      // console.log('1')
      return { ...state, loading: true };
    case asyncActionName(FETCH_TRANSACTIONS).success:
      console.log(action.payload.recordsFiltered);

      return {
        ...state,
        transactions: action.payload.data,
        transactionTotal: action.payload.recordsFiltered,
        successTransaction: true,
        loading: false,
        error: false,
      };
    case asyncActionName(FETCH_TRANSACTIONS_SINGLE).loading:
      // console.log('1')
      return { ...state, loading: true };
    case asyncActionName(FETCH_TRANSACTIONS_SINGLE).success:
      console.log(action.payload.recordsFiltered);

      return {
        ...state,
        transactions: action.payload.data,
        transactionTotal: action.payload.recordsFiltered,
        successTransaction: true,
        loading: false,
        error: false,
      };
    case asyncActionName(FETCH_TRANSACTIONS_SINGLE).failure:
      return {
        ...state,
        error: true,
        loading: false,
        transactionTotal: "",
        successTransaction: false,
        // failure
      };
    case asyncActionName(FETCH_TRANSACTIONS_TYPES).loading:
      // console.log('1')
      return { ...state };
    case asyncActionName(FETCH_TRANSACTIONS_TYPES).success:
      return {
        ...state,
        transactionsType: action.payload.data,
        success: true,
        error: false,
      };
    case asyncActionName(FETCH_TRANSACTIONS_TYPES).failure:
      return {
        ...state,
        error: true,
        success: false,
        // failure
      };
    case asyncActionName(FETCH_TRANSACTIONS_STATUS).loading:
      // console.log('1')
      return { ...state };
    case asyncActionName(FETCH_TRANSACTIONS_STATUS).success:
      return {
        ...state,
        transactionStatus: action.payload.data,
        success: true,
        error: false,
      };
    case asyncActionName(FETCH_TRANSACTIONS_STATUS).failure:
      return {
        ...state,
        error: true,
        success: false,
        // failure
      };
    default:
      return state;
  }
};

export default TransactionsReducer;
