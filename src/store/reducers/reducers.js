import {combineReducers} from 'redux';
import * as ActionTypes from '../actions/actionTypes';

import { createReducer } from '../../utils/createReducer';


export const getCategories = createReducer([], {
    [ActionTypes.GET_CAT]: (state, action) => {
      return action.categories;
    }
  })