import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { loginUser } from "../../../Redux/requests/userRequest";
import Loader from "../../../Components/secondLoader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorAlert from "../../../Components/alerts";
import "./style.css";

const Login = ({ history, loginUser: handleLogin, loading, success, error }) => {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    setErrors([]);
    const { name, value } = event.target;

    setUserCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (error) {
      const msg =
        error?.error?.response?.data?.responseMessage ||
        "There was an error sending your request, please try again later.";
      setErrors([msg]);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      history.push("/dashboard");
    }
  }, [success, history]);

  const onSubmit = (event) => {
    event.preventDefault();

    const username = (userCredentials.username || "").trim();
    const password = userCredentials.password || "";

    if (!username || !password) {
      setErrors(["*username/password can't be empty"]);
      return; // ✅ IMPORTANT: stop here
    }

    handleLogin({ username, password });
  };

  const goToChangePassword = () => {
    history.push("/changepassword"); // ✅ matches Routes.js
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
            <Form.Group controlId="loginUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={userCredentials.username}
                onChange={handleInputChange}
                autoComplete="username"
                required
              />
            </Form.Group>
          </Col>

          <Col md={12} sm={12}>
            <Form.Group controlId="loginPassword">
              <Form.Label>Password</Form.Label>

              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userCredentials.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#1E4A86",
                    fontWeight: 600,
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>

              {/* ✅ clickable */}
              <button
                type="button"
                onClick={goToChangePassword}
                className="forgot-text"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Forgot your password?
              </button>
            </div>

            <div className="text-center pt-3">
              <Button
                variant="primary"
                className="text-white button-wrap"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "login"}
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

export default connect(mapStateToProps, { loginUser })(Login);
