import { createSlice } from '@reduxjs/toolkit';
import { setStorage,getStorage } from '../../../Common/utils';
import { showLoading,hideLoading } from '../../../Redux/Reducer/loading';
import { updateRestaurant } from '../../../Request/restaurant';
import { message } from 'antd';
import { getRest } from '../../Admin/State/reducer';

export const languageSlice = createSlice({
  name: 'counter',
  initialState: {
    lang:getStorage('language') || 'zh-CN'
  },
  reducers: {
    setZh: (state) => {
      state.lang = 'zh-CN';
      setStorage('language','zh-CN');
    },
    setEn: (state) => {
      state.lang = 'en-US';
      setStorage('language','en-US');
    }
  },
});

export const { setZh ,setEn } = languageSlice.actions;

export const updateRest = (value) => async ( dispatch)=> {
  try {
    dispatch(showLoading());
    let result = await updateRestaurant(value);
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(getRest());
    dispatch(hideLoading());
  }
};

export default languageSlice.reducer;
