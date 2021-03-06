import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

/* 全局reducer */
import { showLoading,hideLoading } from '../../../Redux/Reducer/loading';

/* request */
import { restaurant } from '../../../Request/restaurant';
import { tags } from '../../../Request/tags';

export const restSlice = createSlice({
  name: 'counter',
  initialState: {
    list: [],
    tags:[],
    selectedItem:[],
    isShow:false
  },
  reducers: {
    saveData: (state, action) => {
      state.list = action.payload;
    },
    saveTags: (state, action) => {
      state.tags = action.payload;
    },
    selectedList:(state, action) => {
      state.selectedItem = action.payload;
    },
    showModal:(state)=>{
      state.isShow = true;
    },
    hideModal:(state)=>{
      state.isShow = false;
    }
  },
});

export const { saveData ,saveTags,selectedList ,showModal,hideModal } = restSlice.actions;

export const getRest = () => async (dispatch )=> {
  try {
    dispatch(showLoading());
    /* 获取餐馆信息 */
    let result = await restaurant();
    dispatch(saveData(result.list));
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export const getTags = () => async (dispatch )=> {
  try {
    dispatch(showLoading());
    /* 获取tags */
    let result = await tags();
    dispatch(saveTags(result.list));
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export const saveItem = (value) => (dispatch )=> {
  try {
    dispatch(showLoading());
    let result = dispatch(selectedList(value));
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export default restSlice.reducer;
