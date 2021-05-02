import React from 'react';

import { BrowserRouter as Router, Route, Switch , withRouter} from "react-router-dom";
// import { connect } from "react-redux";
// import userProfile from '../utils/UserProfile';





// Components
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

// Pages
import Login from './Auth/Login';
import Register  from './Auth/Register';

import  Home from './Home/HomePage'; 
import Brands from './Brands/BrandsPage';
import Products from './Products/ProductsList';
import ProductDetails from './Products/ProductDetailsPage';
import Cart from './Cart/CartPage';
import SaveLater from './Cart/SaveLater';
import CheckOut from './CheckOut/CheckOutPage';






const MainRoute = withRouter(({location}) =>{
        if(location.pathname !== "/login" && location.pathname !== "/signup"){
            document.body.style.backgroundColor = '#fff'
        }else{
            document.body.style.backgroundColor = '#F0F0F0'
        }
    return(
        <div>   
                {location.pathname !== "/login" && location.pathname !== "/signup" &&
                    <Navbar/>
                }
                <Switch>
                    <Route  exact path="/"  component={Home}/>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Register} />

                    <Route path="/brands" component={Brands} />
                    <Route path="/products/category:category" component={Products} />
                    <Route path="/productdetails/osku:osku"  component={ProductDetails}/>
                    <Route path="/cart" component={Cart} />
                    <Route path="/saveforlater" component={SaveLater}/>
                    <Route path="/checkout" component={CheckOut} />
                </Switch>
                {location.pathname !== "/login" && location.pathname !== "/signup" &&
                    <Footer/>
                }
        </div>
    )
})


const Launch =() => {

        return (
            <React.Fragment>
                <Router basename={'/'}>
                    <MainRoute/>
                </Router>
            </React.Fragment>

        )
}

export default Launch