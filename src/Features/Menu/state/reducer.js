import { createSlice } from '@reduxjs/toolkit';
import { showLoading,hideLoading } from '../../../Redux/Reducer/loading';
import { message } from 'antd';
import _ from 'lodash';

/* request */
import { menu ,available } from '../../../Request/menu';
import { restaurant } from '../../../Request/restaurant';

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
    dispatch(showLoading());
    let result = await restaurant();
    let nameList = _.map(result.list,(item)=>{
      return { id:item._id,name:item.name['zh-CN'] };
    });
    dispatch(loadRestaurantName(nameList));
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export const getMenu = (data) => async ( dispatch)=> {
  try {
    dispatch(showLoading());
    let result = await menu(data);
    dispatch(loadFoods(result.list));
    dispatch(setCount(result.count));
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export const updateAvailable = (data,params) => async ( dispatch)=> {
  try {
    dispatch(showLoading());
    let result = await available(data);
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(getMenu(params))
    dispatch(hideLoading());
  }
};

export default meunSlice.reducer;
