import axios from "axios";
import { asyncActions } from "../../utils/asyncUtil";
import { FETCH_API_VERSION,CREATE_API_VERSION ,DELETE_API_VERSION} from "../actions/actionTypes";
import { AgentConstant } from "../../constants/constants";
import { connect } from "react-redux";


export const AllApiVersion = () => (dispatch) => {
  dispatch(asyncActions(FETCH_API_VERSION).loading(true));
  const token = JSON.parse(localStorage.getItem("data"))

  axios
    .get(`${AgentConstant.API_VERSION_URL}`, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const response = res.data;
      if (response.responseCode === "00") {
        dispatch(asyncActions(FETCH_API_VERSION).success(response.data));
      }
    })
    .catch((error) => {
      dispatch(asyncActions(FETCH_API_VERSION).failure(true, error));
    });
};


export const CreateApiVersion  = (version) => dispatch => {
  console.log(version)
  // const {version}= props
  // console.log(version)
  dispatch(asyncActions(CREATE_API_VERSION).loading(true));
  const token = JSON.parse(localStorage.getItem("data"))
  axios
    .post(`${AgentConstant.API_VERSION_URL}`, {
      version,
    }, {
      headers: {
          'Authorization': `bearer ${token.access_token}`,
          'Content-Type': 'application/json'
      },
  })
    .then(res => {
      console.log(res)
      const response = res.data
      console.log(response)
      if (response.responseCode === "00") {
        dispatch(asyncActions(CREATE_API_VERSION).success(response.data));
      }
      else if (response.responseCode === "XX") {
        dispatch(asyncActions(CREATE_API_VERSION).failure(true, response.responseMessage));
      }
    })
    .catch(error => dispatch(asyncActions(CREATE_API_VERSION).failure(true, error)));
};

export const DeleteApiVersions  = (version) => dispatch => {
  console.log(version)
  let versions = version.version 
  console.log(versions) 
  dispatch(asyncActions(DELETE_API_VERSION).loading(true));
  const token = JSON.parse(localStorage.getItem("data"))
  console.log(token.access_token)
  axios.delete(`${AgentConstant.API_VERSION_URL}`, {
    headers: {
      'Authorization': `bearer ${token.access_token}`,
      'Content-Type': 'application/json'
    },
    data: {
      versions
    }
  })
    .then(res => {
      console.log(res)
      const response = res.data
      console.log(response)
      if (response.responseCode === "00") {
        dispatch(asyncActions(DELETE_API_VERSION).success(response.data));
      }
      else if (response.responseCode === "XX") {
        dispatch(asyncActions(DELETE_API_VERSION).failure(true, response.responseMessage));
      }
    })
    .catch(error => dispatch(asyncActions(DELETE_API_VERSION).failure(true, error)));
};

// export const DeleteApiVersion  = (version) => dispatch => {
//   let versions = version.version
//   console.log(versions,version)
//    dispatch(asyncActions(DELETE_API_VERSION).loading(true));
//   const token = JSON.parse(localStorage.getItem("data"));
//   axios
//     .delete(
//       `${AgentConstant.API_VERSION_URL}`,
//       {
//         versions,
//       },
//       {
//         headers: {
//           Authorization: `bearer ${token.access_token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     )
//     .then(res => {
//       const response = res.data
//       console.log(res)
//       if (response.responseCode === "00") {
//         dispatch(asyncActions(DELETE_API_VERSION).success(response.data));
//       }
//       else if (response.responseCode === "XX") {
//         dispatch(asyncActions(DELETE_API_VERSION).failure(true, response.responseMessage));
//       }
//     })
//     .catch(error => dispatch(asyncActions(DELETE_API_VERSION).failure(true, error)));
// };