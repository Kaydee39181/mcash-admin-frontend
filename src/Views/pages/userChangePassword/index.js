import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { UserChangePassword } from "../../../Redux/requests/userRequest";
import Loader from "../../../Components/secondLoader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorAlert from "../../../Components/alerts";
import { removeToken } from "../../../utils/localStorage";
import "./style.css";

const ChangePasswords = ({
  history,
  UserChangePassword: handlePassword,
  loading,
  success,
  errorMessage,
  error,
}) => {
  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState([]);
  const [infoMessage, setInfoMessage] = useState("Please change your password.");
  const [showPasswords, setShowPasswords] = useState(false);

  const handleInputChange = (event) => {
    setErrors([]);
    setInfoMessage("");
    const { name, value } = event.target;
    setUserPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Handle backend errors
  useEffect(() => {
    if (error || errorMessage) {
      const msg =
        errorMessage?.error ||
        error?.error?.response?.data?.responseMessage ||
        "There was an error sending your request, please try again later.";

      setErrors([msg]);
      setInfoMessage("");
    }
  }, [error, errorMessage]);

  // Handle success
  useEffect(() => {
    if (success) {
      setErrors([]);
      setInfoMessage("Password changed successfully. Please login again.");

      // ✅ VERY IMPORTANT: remove token so app doesn't auto-auth to dashboard
      removeToken();

      // ✅ Replace so back button doesn't go to protected route
      setTimeout(() => {
        history.replace("/");
      }, 800);
    }
  }, [success, history]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const { oldPassword, password, confirmPassword } = userPassword;

    if (!oldPassword || !password || !confirmPassword) {
      setErrors(["All fields are required."]);
      return;
    }

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    await handlePassword({ oldPassword, password, confirmPassword });
  };

  const goToLoginAndLogout = () => {
    removeToken();
    // ✅ replace prevents “back to dashboard” weirdness
    history.replace("/");
  };

  const handleBack = (e) => {
    e.preventDefault();
    goToLoginAndLogout();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    goToLoginAndLogout();
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-wrapper">
      <Form className="form-wrapper" onSubmit={onSubmit}>
        {loading && <Loader type="Oval" height={60} width={60} color="#1E4A86" />}

        <div className="logo"></div>

        <div className="mb-3">
          <Button variant="secondary" type="button" onClick={handleBack}>
            ← Back
          </Button>
        </div>

        {errors.length > 0 ? (
          <ErrorAlert errors={errors} />
        ) : (
          <Alert variant="info">{infoMessage}</Alert>
        )}

        <Row>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type={showPasswords ? "text" : "password"}
                name="oldPassword"
                value={userPassword.oldPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type={showPasswords ? "text" : "password"}
                name="password"
                value={userPassword.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={userPassword.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Show passwords"
              checked={showPasswords}
              onChange={() => setShowPasswords((s) => !s)}
              className="mb-3"
            />

            <div className="text-center">
              <Button
                variant="primary"
                className="text-white button-wrap mr-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>

              <Button
                variant="outline-secondary"
                type="button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

ChangePasswords.propTypes = {
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  UserChangePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.users.loading,
  user: state.users.user,
  error: state.users.error,
  errorMessage: state.users.errorMessage,
  success: state.users.success,
});

export default connect(mapStateToProps, { UserChangePassword })(ChangePasswords);
