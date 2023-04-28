import React from "react";
import { Route, Redirect } from "react-router-dom";
// import { isLoggedIn } from "../utils/isLoggedIn";
import {  } from "./someTokenMenthods";

const data = JSON.parse(localStorage.getItem("data"))
console.log(data)

const isEntrepreneur = () => {
  return (
    (data && data.user.scope.includes("Entrepreneur")) ||
    data.user.scope.includes("entrepreneur")
  );
};

const EntrepreneurRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isEntrepreneur() ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

export default EntrepreneurRoute;