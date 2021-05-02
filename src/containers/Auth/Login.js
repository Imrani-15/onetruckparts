import React from 'react';

import { Toast } from 'primereact/toast';
import {Button} from 'primereact/button';
import {Password} from 'primereact/password';
import { InputText } from "primereact/inputtext";

import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';
import {formValidation,emailValidation} from '../../utils/Utils';
import userProfile from '../../utils/UserProfile';
import {appTheme, PRODUCT_BASE_URL} from  '../../utils/Constants';
import callSerivce from '../../utils/Services';
import { connect } from "react-redux";

import './Auth.css'

class Login extends React.Component {
  
 
    constructor(props){
        super(props);
        this.state={
            loading:false,
            emailId:'',
            password:'',
            isError:{
                emailId:'',
                password:'',
            }
        }
        this.toastRef = React.createRef();
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
              value.length ===0
                ? 'password is required'
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

    submitLogin = () => {
        const {emailId, password } = this.state;
        this.setState({loading:true})
        if (formValidation(this.state.isError,{emailId,password})) {
            let inpobj = {
                "emailId": emailId,
                "password": password
            }
            let restUrl = `${PRODUCT_BASE_URL}account/login`;
            callSerivce(inpobj, restUrl, 'POST')
                .then((res) => {
                    console.log("login", res)
                    this.setState({loading:false},()=>{
                        if (!res.data.error) {
                            userProfile.setUserObj(res.data);
                            this.props.setUserLoginData(res.data)
                            this.props.history.replace('/');
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
        } else {
            this.setState({loading:false})
            this.showTost('error', 'Error Message', 'Form is invalid, Please check details');
        }
      
    }

    showTost(type, title, detail) {
        this.toastRef.current.show({ severity: type, summary: title, detail: detail, life: 2000 });
    }


    render(){
        const  {loading, emailId, password, isError } = this.state;
        return(
            <div className="login-body">
                <Toast ref={this.toastRef} />
                {loading && <AppSpinner /> }
                <div className="login-main p-shadow-1">
                    <h1 style={{textAlign:'center', fontWeight:'500'}}>Sign in to your account</h1>
                    <div className="p-field">
                        <label htmlFor="email" className="p-d-block">Email</label>
                        <InputText id="email" value={emailId} name="emailId" 
                        className={(isError.emailId.length > 0) ? "p-invalid p-inputtext-sm p-d-block" :"p-inputtext-sm p-d-block"}
                        onChange={this.handleChange} style={{width:300}} />
                        {isError.emailId.length > 0 && (
                          <small id="email-help" className="p-error p-d-block">{isError.emailId}</small>
                        )}
                    </div>
                    <div className="p-field">
                        <label htmlFor="password" className="p-d-block">Password</label>
                        <Password id="password" value={password} name="password" 
                        className={(isError.password.length > 0) ? "p-invalid p-password p-password-sm" :"p-password p-password-sm"}
                        onChange={this.handleChange} style={{width:300}}
                        toggleMask feedback={false}/>
                        {isError.password.length > 0 && (
                          <small id="password-help" className="p-error p-d-block">{isError.password}</small>
                        )}
                    </div>
                    <div className="resetpasswordText" onClick={()=>this.props.history.push('/createnewpassword')} >Forgot Password</div>
                    <OneButton 
                        onClick={this.submitLogin} 
                        buttonLabel={"Login"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{fontSize:16,marginTop:8}}
                        /> 
                    <div style={{marginTop:28,marginBottom:22}}>
                            <div style={{fontSize:14,lineHeight:0,textAlign:'center'}}>Don't have an account?</div>
                    </div>
                    <OneButton 
                        onClick={()=>this.props.history.push('/signup')} 
                        buttonLabel={"Create your account"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{fontSize:16,backgroundColor:'#fff',color:appTheme.primaryColor}}
                        /> 
                    
                </div>
     
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
    
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserLoginData: obj => {
            dispatch({ type: "SET_LOGIN_DATA", data: obj });
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);