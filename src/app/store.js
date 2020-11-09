import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../Features/Counter/counterSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
