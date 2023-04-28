import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Form, Button ,Alert} from "react-bootstrap";
import { UserChangePassword } from "../../../Redux/requests/userRequest";
import Loader from "../../../Components/secondLoader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import {history} from '../../../utils/history'
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
        oldPassword: null,
        password: null,
        confirmPassword: null
    });
    const [errors, setErrors] = useState([]);
    const [successMessage, SetSuccessMessage] = useState(['please change Password']);


    function handleInputChange(event) {
        console.log(event);
        setErrors([]);
        setUserPassword({
            ...userPassword,
            [event.target.name]: event.target.value,
        });
        console.log(userPassword);
    }

   useEffect(() => { 
        if(errorMessage){
            SetSuccessMessage([])

          if (error && errorMessage.error!="Old Password is incorrect"){
            return setErrors(['There was an error sending your request, please try again later.']) ;
        }else if(errorMessage){
          return setErrors([errorMessage.error]);
        }
        }
       
      }, [error, errorMessage]);

    useEffect(() => {
        console.log(success)
        if (success) {
            history.push("/");
        }
    }, [success]);

    const { oldPassword, password, confirmPassword } = userPassword;

    const onSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) return setErrors(['Passwords do not match']),SetSuccessMessage();
        console.log(userPassword)
        const result = await handlePassword(userPassword);
        console.log(result)

    };
    return (
        <div className="d-flex justify-content-center align-items-center login-wrapper">
            <Form className="form-wrapper" onSubmit={onSubmit}>
                {loading && (
                    <Loader
                        type="TailSpin"
                        type="Oval"
                        height={60}
                        width={60}
                        color="#1E4A86"
                    />
                )}

                <div className="logo"></div>
                
               { error ||errorMessage ?<ErrorAlert errors={errors} />: <Alert variant="success">{successMessage}</Alert>}
                <Row>
                    <Col md={12} sm={12}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Password </Form.Label>
                            <Form.Control
                                type="password"
                                name="oldPassword"
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} sm={12}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>New Password </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} sm={12}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <div className=" text-center pt-3">
                            <Button
                                variant="primary"
                                className="text-white button-wrap"
                                type="submit"
                            >
                                Submit
                             </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
ChangePasswords.propTypes = {
    // changePasswords: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) =>(
    console.log(state),
    {
    loading: state.users.loading,
    user: state.users.user,
    error: state.users.error,
    errorMessage:state.users.errorMessage,
    success: state.users.success,
});

export default connect(mapStateToProps, {
    UserChangePassword,
})(ChangePasswords);
