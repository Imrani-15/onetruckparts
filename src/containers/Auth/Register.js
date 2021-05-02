import React from 'react';

import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Messages } from 'primereact/messages';

import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';

import { formValidation, emailValidation } from '../../utils/Utils';
import {PRODUCT_BASE_URL} from  '../../utils/Constants';
import callSerivce from '../../utils/Services';
import './Auth.css'


class Register extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            emailId: '',
            password: '',
            confirmPassword:'',
            isError: {
                emailId: '',
                password: '',
                confirmPassword:'',
            }
        }
        this.toastRef = React.createRef();
        this.messageRef = React.createRef();
    }




    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case 'emailId':
                isError.emailId =
                    emailValidation.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                isError.password =
                    value.length < 8
                        ? 'password must be minimum  8 characters long!'
                        : '';
                break;
            case 'confirmPassword':
                isError.confirmPassword =
                    value.length ===0
                        ? 'Please enter your confirm password'
                        : '';
                break;
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value
        })
    }

    submitRegister = () => {
        const { emailId, password, confirmPassword } = this.state;
        this.setState({loading:true})
        if (formValidation(this.state.isError, { emailId, password, confirmPassword })) {
            if (password !== confirmPassword) {
                this.setState({loading:false})
                this.messageRef.current.show({ severity: 'error', summary: '', detail: "The password don't match.", sticky: true })
            } else {
                let inpobj = {
                    "emailId": emailId,
                    "password": password
                }
                let restUrl = `${PRODUCT_BASE_URL}account/signup`;
                callSerivce(inpobj, restUrl, 'POST')
                    .then((res) => {
                        this.setState({loading:false},()=>{
                            if (!res.data.error) {
                                this.showTost('success', 'Success Message', res.data.message);
                                  this.props.history.replace('/login');
                            } else {
                                this.showTost('error', 'Error Message', res.data.message);
                            }
                        }) 
                    })
                    .catch((error) => {
                        this.setState({loading:false},()=>{
                            this.showTost('error', 'Error Message', 'Opps, Something went wrong, Try again');
                        })
                    })
            }
           
        } else {
            this.setState({loading:false})
            this.showTost('error', 'Error Message', 'Please enter all the details.');
        }

    }

    showTost(type, title, detail) {
        this.toastRef.current.show({ severity: type, summary: title, detail: detail, life: 2000 });
    }


    render() {
        const {loading, userName, emailId, mobileNumber, password, confirmPassword, isError } = this.state;
        return (
            <div className="login-body">
                <Toast ref={this.toastRef} />
                
                {loading && <AppSpinner /> }
                <div className="login-main">
                    <h1 style={{ textAlign: 'left',fontWeight:'400' }}>Create your account</h1>
                    <Messages ref={this.messageRef} />
                    <div className="p-field">
                        <label htmlFor="email" className="p-d-block">Email</label>
                        <InputText id="email" value={emailId} name="emailId"
                            className={(isError.emailId.length > 0) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                            onChange={this.handleChange} style={{ width: 300 }} />
                        {isError.emailId.length > 0 && (
                            <small id="email-help" className="p-error p-d-block">{isError.emailId}</small>
                        )}
                    </div>
                    <div className="p-field">
                        <label htmlFor="password" className="p-d-block">Password</label>
                        <Password id="password" value={password} name="password"
                            className={(isError.password.length > 0) ? "p-invalid p-password p-password-sm" : "p-password p-password-sm"}
                            onChange={this.handleChange} style={{ width: 300 }}
                            toggleMask />
                        {isError.password.length > 0 && (
                            <small id="password-help" className="p-error p-d-block">{isError.password}</small>
                        )}
                    </div>
                    <div className="p-field">
                        <label htmlFor="confirmPassword" className="p-d-block">Confirm Password</label>
                        <Password id="confirmPassword" value={confirmPassword} name="confirmPassword"
                            className={(isError.confirmPassword.length > 0) ? "p-invalid p-password p-password-sm" : "p-password p-password-sm"}
                            onChange={this.handleChange} style={{ width: 300 }}
                            toggleMask  feedback={false}/>
                        {isError.confirmPassword.length > 0 && (
                            <small id="password-help" className="p-error p-d-block">{isError.confirmPassword}</small>
                        )}
                    </div>
                    <OneButton 
                        onClick={this.submitRegister} 
                        buttonLabel={"Create account"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{fontSize:16,marginTop:8}}
                        /> 
                </div>

            </div>
        )
    }

}


export default Register