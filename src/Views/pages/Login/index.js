import React, { useState, useEffect } from "react";
import {  Row, Col, Form, Button } from "react-bootstrap";
import {
  loginUser,
  // UserChangePassword,
} from "../../../Redux/requests/userRequest";
import Loader from "../../../Components/secondLoader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import {history} from '../../../utils/history'
import ErrorAlert from "../../../Components/alerts";
// import { removeToken } from "../../../utils/localStorage";
import "./style.css";

const Login = ({
  history,
  loginUser: handleLogin,
  loading,
  success,
  error,
}) => {
  const [userCredentials, setUserCredentials] = useState({
    username: null,
    password: null,
  });
  console.log(history);

  const [errors, setErrors] = useState([]);
  function handleInputChange(event) {
    setErrors([]);
    console.log(event);
    setUserCredentials({
      ...userCredentials,
      [event.target.name]: event.target.value,
    });
    console.log(userCredentials);
  }

  useEffect(() => {
    if (error) {
      return setErrors([
        error.error && error.error.response
          ? error.error.response.data.responseMessage
          : "There was an error sending your request, please try again later.",
      ]);
    }
    // removeToken();
  }, [error]);

  useEffect(() => {
    console.log(success);
    if (success) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  }, [success]);

  const onSubmit = (event) => {
    event.preventDefault();

    const { username, password } = userCredentials;
    console.log(username, password);
    if (
      username === null ||
      username === "" ||
      password === null ||
      password === ""
    ) {
      setErrors(["*username/password can't be empty"]);
    }

    handleLogin(userCredentials);
  };
  return (
    <div className="d-flex justify-content-center align-items-center login-wrapper">
      <Form className="form-wrapper" onSubmit={onSubmit}>
        {loading && (
          <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
        )}

        <div className="logo"></div>
        <ErrorAlert errors={errors} />
        <Row>
          <Col md={12} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={12} sm={12}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <div className="forgot-text">Forgot your password?</div>
            </div>
            <div className=" text-center pt-3">
              <Button
                variant="primary"
                className="text-white button-wrap"
                type="submit"
              >
                login
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  login: state.users.user,
  loading: state.users.loading,
  user: state.users.user,
  error: state.users.error,
  success: state.users.success,
});

export default connect(mapStateToProps, {
  loginUser,
})(Login);
