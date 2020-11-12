import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { showLoading,hideLoading } from '../../../Redux/Reducer/loading';
import {login } from '../../../Request/login'
// import {setStorage} from '../../../Common/utils'

export const loginSlice = createSlice({
  name: 'order',
  initialState: {
    user:''
  },
  reducers: {
    saveUser:(state,action)=>{
      state.user=action.payload
    },
    removeUser:(state)=>{
      state.user=''
      localStorage.removeItem('user')
    }
  },
});

export const { saveUser,removeUser } = loginSlice.actions;

export const postLogin = (data) =>async(dispatch )=> {
  try {
    dispatch(showLoading());
    let result=await login(data)
    dispatch(saveUser(result))
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export default loginSlice.reducer;
