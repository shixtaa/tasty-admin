import { createSlice } from '@reduxjs/toolkit';
import { showLoading,hideLoading } from '../../../../../Redux/Reducer/loading';
import { message } from 'antd';
import { menu ,available } from '../../../../../Request/menu';
import { restaurant } from '../../../../../Request/restaurant';
import _ from 'lodash';

export const meunSlice = createSlice({
  name: 'counter',
  initialState: {
    isLoading:false,
    list:[],
    count:0,
    restaurantNames:[]
  },
  reducers: {
    loadRestaurantName:(state,action)=>{
      state.restaurantNames = action.payload;
    },
    loadFoods:(state,action)=>{
      state.list = action.payload;
    },
    setCount:(state,action)=>{
      state.count = action.payload;
    },
    clearData:(state)=>{
      state.list = [];
      state.count = 0;
    }
  },
});

export const { loadRestaurantName ,loadFoods,setCount ,clearData } = meunSlice.actions;

export const getRestaurantName = () => async ( dispatch)=> {
  try {
    await dispatch(showLoading());
    let result = await restaurant();
    let nameList = _.map(result.list,(item)=>{
      return { id:item._id,name:item.name['zh-CN'] };
    });
    await dispatch(loadRestaurantName(nameList));
  } catch (error) {
    message.error(error.message);
  }finally{
    await dispatch(hideLoading());
  }
};

export const getMenu = (id,page,limit,keyword) => async ( dispatch)=> {
  try {
    await dispatch(showLoading());
    let result = await menu(id,page,limit,keyword);
    await dispatch(loadFoods(result.list));
    await dispatch(setCount(result.count));
  } catch (error) {
    message.error(error.message);
  }finally{
    await dispatch(hideLoading());
  }
};

export const updateAvailable = (data) => async ( dispatch)=> {
  try {
    await dispatch(showLoading());
    let result = await available(data);
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    await dispatch(hideLoading());
  }
};

export default meunSlice.reducer;
