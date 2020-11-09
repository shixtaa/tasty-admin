import { configureStore } from '@reduxjs/toolkit';
import restReducer from '../../Features/Admin/State/reducer';
import languageReducer from '../../Features/Admin/Components/Restaurant/state/reducer';
import loadingReducer from '../Reducer/loading';
import menuReducer from '../../Features/Admin/Components/Menu/state/reducer';

export default configureStore({
  reducer: {
    restaurant:restReducer,
    language:languageReducer,
    loading:loadingReducer,
    menu:menuReducer
  },
});