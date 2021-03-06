import { configureStore } from '@reduxjs/toolkit';
import restReducer from '../../Features/Admin/State/reducer';
import languageReducer from '../../Features/Restaurant/state/reducer';
import loadingReducer from '../Reducer/loading';
import menuReducer from '../../Features/Menu/state/reducer';
import orderReducer from '../../Features/Order/state/reducer'
import loginReducer from '../../Features/Login/state/reducer'

export default configureStore({
  reducer: {
    restaurant:restReducer,
    language:languageReducer,
    loading:loadingReducer,
    menu:menuReducer,
    order:orderReducer,
    login:loginReducer
  },
});