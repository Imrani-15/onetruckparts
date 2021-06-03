import React from 'react';

import axios from 'axios';
import { Toast } from 'primereact/toast';
import {Password} from 'primereact/password';
import { Messages } from 'primereact/messages';
import { InputText } from "primereact/inputtext";

import FirebaseAuth from './FirebaseAuth';
import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';
import {formValidation,emailValidation} from '../../utils/Utils';
import logo from '../../assets/logo.png';
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
            formInvalid: false,
            emailId:'',
            password:'',
            isError:{
                emailId:'',
                password:'',
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
              value.length ===0
                ? 'password is required'
                : '';
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

    componentDidMount(){
    }

  

    submitLogin = () => {
        const {emailId, password } = this.state;
        this.setState({loading:true})
        if (formValidation(this.state.isError,{emailId,password})) {
            this.setState({ formInvalid: false })
            FirebaseAuth.auth().signInWithEmailAndPassword(emailId, password).then(async(user)=>{
                    if(user){
                        let currentUser  = await FirebaseAuth.auth().currentUser;
                        let token = currentUser &&  await FirebaseAuth.auth().currentUser.getIdToken(true);
                        // axios.post(`${PRODUCT_BASE_URL}account/validateRole`,{},
                        //     { headers: { Authorization: `Bearer ${token}` } }
                        //   ).then((response)=> {
                        //     if (!response.data.error) {    
                                let userData = {
                                    userId: currentUser.uid,
                                    emailId : currentUser.email,
                                    accessToken : token,
                                    userRole : false  //response.data.role
                                }
                                userProfile.setUserObj(userData);
                                this.props.setUserLoginData(userData)
                                this.setState({loading:false})
                                this.props.history.replace('/');
                        //     }else{

                        //     }
                        //   })
                        //   .catch((e) => {
                        //     console.log(e);
                        //   });
                    }else{
                        this.setState({loading:false});
                    }
            
            
            
                }
            )
            .catch(err => {
                switch (err.code){
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        this.setState({loading:false},()=>{
                            this.messageRef.current.show({ severity: 'error', summary: '', content:
                            (<h5>{err.message}</h5>), 
                             closable:false,
                             sticky: false })
                        })
                    break;
                    case "auth/wrong-password":
                        this.setState({loading:false},()=>{
                            this.messageRef.current.show({ severity: 'error', summary: '', content:
                            (<h5>{err.message}</h5>), 
                            closable:false,
                            sticky: false })
                        })
                    break;
                }
            })
        } else {
            this.setState({loading:false, formInvalid:true})
            this.showTost('error', 'Login', 'Please enter all required fields.');
        }
      
    }

    updateState(){
        alert("updateState")
    }



    showTost(type, title, detail) {
        this.toastRef.current.show({ severity: type, summary: title, detail: detail, life: 2000 });
    }


    render(){
        const  {loading, emailId, password, isError , formInvalid} = this.state;
        return(
            <div className="login-body">
                <Toast ref={this.toastRef} />
                {loading && <AppSpinner /> }
                <div className="login-main p-shadow-1">
                     <img src={logo} alt={'logo'} style={{justifySelf: 'center'}} height="48px"  />
                    <h1 style={{textAlign:'center', fontWeight:'500', color:appTheme.secondaryColor}}>Sign in to continue</h1>
                    <Messages ref={this.messageRef} style={{width:300}} />
                    <div className="p-field">
                        <label htmlFor="email" className="p-d-block">Email address</label>
                        <InputText id="email" value={emailId} name="emailId" 
                        className={(isError.emailId.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" :"p-inputtext-sm p-d-block"}
                        onChange={this.handleChange} style={{width:300}} />
                        {isError.emailId.length > 0 && (
                          <small id="email-help" className="p-error p-d-block">{isError.emailId}</small>
                        )}
                    </div>
                    <div className="p-field">
                        <label htmlFor="password" className="p-d-block">Password</label>
                        <Password id="password" value={password} name="password" 
                        className={(isError.password.length > 0 || formInvalid) ? "p-invalid p-password p-password-sm" :"p-password p-password-sm"}
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