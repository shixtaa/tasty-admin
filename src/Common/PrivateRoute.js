import React from 'react';
import PropTypes from 'prop-types';
import { Route,Redirect, useHistory } from 'react-router-dom';
import { getStorage } from './utils';
// import { useSelector } from 'react-redux';

export default function PrivateRoute ({ component: Component , ...rest }) {
  // const user=useSelector(state=>state.login.user)
  const history=useHistory()
  let auth = true;
  let user = getStorage('user');
  
  /* 当path为/时，已登录进admin，未登录进login */
  if(rest.path === '/'){
    if(user){
      history.push('/admin/restaurant')
    }else{
      auth=false
    }
  }

  if(rest.path === '/admin/order'){
    console.log('in')
    history.push('/admin/restaurant')
  }

  // /** 如果未登录 不可以进入除login以外页面 */
  if(!user){
    if(rest.path !== '/login'){
      auth = false;
    }
  }else{
    auth = true;
  }

  return (

    <Route { ...rest } render={ ()=>{
      return (

        auth ? <Component/> : <Redirect to='/login'></Redirect>
      );

    } } ></Route>

  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func
};
