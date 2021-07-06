import React from 'react';


import { InputText } from "primereact/inputtext";
import { Messages } from 'primereact/messages';

import FirebaseAuth from './FirebaseAuth';
import logo from '../../assets/logo.png';
import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';
import {appTheme} from  '../../utils/Constants';
import { emailValidation, isNotEmpty } from '../../utils/Utils';

import './Auth.css'


class ForgotPassword extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            formInvalid: false,
            emailId: '',
            isError: {
                emailId: ''
            }
        }
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
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value,
            formInvalid:false
        })
    }

    onSubmit = () => {
        const { emailId,isError } = this.state;
        if(!isNotEmpty(emailId)){
            isError.emailId = 'Please enter an email address';
            this.setState({isError})
            return
        }
        let actionCodeSettings = {
            url:  window.location.origin + '/login',

        }
        FirebaseAuth.auth().sendPasswordResetEmail(emailId,actionCodeSettings).then((result)=>{
            this.setState({loading:false},()=>{
                this.messageRef.current.show({ severity: 'success', summary: 'Check your email', sticky: true, content:
                (<h5>We've sent an email to the address provided. Click the link in the email to reset your password.</h5>)})
            })
        }).catch((e)=> {
            console.log(e)
        }) 
    }

  


    render() {
        const {loading, emailId, formInvalid, isError } = this.state;
        
        return (
            <div className="login-body">
                {loading && <AppSpinner /> }
                <div className="login-main">
                     <img src={logo} alt={'logo'} style={{justifySelf: 'center'}} height="48px"  />
                    <h2 style={{ textAlign: 'center',fontWeight:'400' }}>Reset Password</h2>
                    <Messages ref={this.messageRef} style={{width:300}} />
                    <div className="p-field">
                        <label htmlFor="email" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Email address</label>
                        <InputText id="email" value={emailId} name="emailId" required
                            className={(isError.emailId.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                            onChange={this.handleChange} style={{ width: 300 }} />
                        {isError.emailId.length > 0 && (
                            <small id="email-help" className="p-error p-d-block">{isError.emailId}</small>
                        )}
                    </div>
                    <OneButton 
                        onClick={this.onSubmit} 
                        buttonLabel={"Submit"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{fontSize:16,marginTop:8}}
                        /> 
                    <OneButton 
                        onClick={()=>this.props.history.push('/login')} 
                        buttonLabel={"Back to login"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{fontSize:16,backgroundColor:'#fff',color:appTheme.primaryColor,marginTop:10}}
                        /> 
                </div>

            </div>
        )
    }

}


export default ForgotPassword