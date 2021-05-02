import React from "react";


import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import configureStore from './store/configureStore';
import {Provider} from "react-redux";


import './App.css';
import "antd/dist/antd.css";

import userProfile from "./utils/UserProfile";
import Launch from "./containers/Launch";

export const appStore = configureStore();


class App extends React.Component{
  constructor(props){
    super(props);
    let userObj = userProfile.getUserObj();
    if(userObj && userObj.emailId && userObj.accessToken){
       appStore.dispatch({type:'SET_LOGIN_DATA', data:userObj})
    }
  }

  render(){
    return(
      <Provider store={appStore}>
        <Launch />
      </Provider>
    )
  }
    
  

};

export default App;
