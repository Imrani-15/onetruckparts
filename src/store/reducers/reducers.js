import {combineReducers} from 'redux';
import * as ActionTypes from '../actions/actionTypes';

import { createReducer } from '../../utils/createReducer';


export const getCategories = createReducer([], {
    [ActionTypes.GET_CAT]: (state, action) => {
      return action.categories;
    }
  })

export const userLoginData = createReducer({},{
    [ActionTypes.SET_LOGIN_DATA](state, action) {
      return action.data;
    },
    [ActionTypes.REMOVE_LOGIN_DATA](state, action) {
      return {}
    }
})


export const userData = createReducer({}, {
 
    [ActionTypes.USER_SELECTED_LOCATION]: (state, action) => {
      return Object.assign({}, state, { location: action.location })
    },
    [ActionTypes.SET_CART_COUNT](state, action) {
      return Object.assign({}, state, { cartcount: action.cartcount })
    },
    [ActionTypes.SET_APP_DATA](state, action) {
      let obj = {}
      for (let [key, value] of Object.entries(action.data)) {
        obj[key] = value
      }
      return Object.assign({}, state, obj)
    },
   
  })