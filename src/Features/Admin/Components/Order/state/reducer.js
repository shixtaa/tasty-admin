import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { showLoading,hideLoading } from '../../../../../Redux/Reducer/loading';
import { order} from '../../../../../Request/order'

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    list: []
  },
  reducers: {
    loadOrder:(state,action)=>{
      state.list=action.payload
    },
    clearOrder:(state)=>{
      state.list=[]
    }
  },
});

export const { loadOrder,clearOrder } = orderSlice.actions;

export const getOrder = (start,end) =>async(dispatch )=> {
  try {
    dispatch(showLoading());
    let result=await order(start,end)
    dispatch(loadOrder(result.list))
    return result;
  } catch (error) {
    message.error(error.message);
  }finally{
    dispatch(hideLoading());
  }
};

export default orderSlice.reducer;
