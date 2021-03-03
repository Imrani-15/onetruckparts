import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import configureStore from './store/configureStore';
import {Provider} from "react-redux";
import Navbar from './components/Navbar/Navbar';

import  HomePage from './containers/HomePage';
import ProductDetailsPage from './containers/ProductDetailsPage';
import './primeflex.css'
import './App.css';
import Footer from "./components/Footer/Footer";
import CartPage from "./containers/CartPage";

export const appStore = configureStore();

class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Provider store={appStore}>
    
        <Router basename={'/'}>
        <Navbar/>
        <Switch>
          
          <Route  exact path="/" handler={App} component={HomePage}/>
          <Route   path="/productdetails"  component={ProductDetailsPage}/>
          <Route path="/cart" component={CartPage} />
        </Switch>
        <Footer/>
      </Router>
      </Provider>
    )
  }

};

export default App;
