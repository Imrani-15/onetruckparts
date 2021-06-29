import React from "react";


import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { ScrollTop } from 'primereact/scrolltop';
import configureStore from './store/configureStore';
import {Provider} from "react-redux";

import './App.css';
import "antd/dist/antd.css";
import userProfile from "./utils/UserProfile";

import FirebaseAuth from './containers/Auth/FirebaseAuth';
import Launch from "./containers/Launch";

export const appStore = configureStore();


class App extends React.Component{
  constructor(props){
    super(props);
    let userObj = userProfile.getUserObj();
    let cartDetails = userProfile.getcartDetails();
    if(userObj && userObj.emailId && userObj.accessToken){
       appStore.dispatch({type:'SET_LOGIN_DATA', data:userObj})
    }
    
    if(cartDetails && cartDetails.cartcount && cartDetails.cartcount > 0){
      appStore.dispatch({type:'SET_APP_DATA', data:cartDetails})
    }
  }

  componentDidMount(){
    FirebaseAuth.auth().onAuthStateChanged((authenticate)=>{
     if (authenticate) {
        console.log("authenticate", authenticate)
     } else {
        let currentUser  =  FirebaseAuth.auth().currentUser;
        let token = currentUser &&  FirebaseAuth.auth().currentUser.getIdToken(true);  
        let userObj = userProfile.getUserObj();
         userObj.accessToken = token;
         userProfile.setUserObj(userObj);
         appStore.dispatch({type:'SET_LOGIN_DATA', data:userObj})
     }
    })
   }

  

  render(){
    return(
      <Provider store={appStore}>
       
           <Launch />
       
           <ScrollTop />
      </Provider>
    )
  }
    
  

};

export default App;
