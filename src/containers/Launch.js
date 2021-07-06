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
import ForgotPassword from './Auth/ForgotPassword';

import  Home from './Home/HomePage'; 
import Brands from './Brands/BrandsPage';
import Products from './Products/ProductsList';
import ProductDetails from './Products/ProductDetailsPage';
import SerchProducts from './Products/SearchProductsList';
import Cart from './Cart/CartPage';
import SaveLater from './Cart/SaveLater';
import Orders from './Orders/Orders';
import TrackOrder from './Orders/TrackOrder';
import CheckOut from './CheckOut/CheckOutPage';
import OrderSuccess from './CheckOut/OrderSuccess';

import HomeSettings from './Settings/HomeSettings';
import PageNotFound from './Settings/PageNotFound';

import AboutUs from './FooterPages/AboutUs';
import Terms from './FooterPages/Terms';
import Privacy from './FooterPages/Privacy';







const MainRoute = withRouter(({location}) =>{
        if(location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/forgot-password"){
            document.body.style.backgroundColor = '#fff'
        }else{
            document.body.style.backgroundColor = '#F0F0F0'
        }
    return(
        <div>   
                {location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/forgot-password" &&
                    <Navbar/>
                }
                <Switch>
                    <Route  exact path="/"  component={Home}/>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Register} />
                    <Route path="/forgot-password" component={ForgotPassword} />

                    <Route path="/brands" component={Brands} />
                    <Route path="/products/category:type" component={Products} />
                    <Route path="/search/prd:val" component={SerchProducts} />
                    <Route path="/productdetails/osku:osku"  component={ProductDetails}/>
                    <Route path="/cart" component={Cart} />
                    <Route path="/saveforlater" component={SaveLater}/>
                    <Route path="/checkout" component={CheckOut} />
                    <Route path="/my-orders" component={Orders} />
                    <Route path="/track-order" component={TrackOrder} />
                    <Route path="/order-success" component={OrderSuccess} />
                    <Route path="/settings" component={HomeSettings} />

                    <Route path="/about-us" component={AboutUs} />
                    <Route path="/terms_condition" component={Terms}/>
                    <Route path="/privacy_policy" component={Privacy} />

                    <Route component={PageNotFound} />
                </Switch>
                {location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/forgot-password" &&
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