import {combineReducers} from 'redux';
import {userLoginData,getCategories,cartList,getDeals,getAllProducts,userData} from "./reducers";

export default combineReducers(Object.assign({
    userLoginData,
    getCategories,
    userData
}
    
));