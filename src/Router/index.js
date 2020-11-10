import React from 'react';

/* pages */
import Admin from '../Features/Admin/Admin';
import Login from '../Features/Login/Login'
export const routerConfig = [
  {
    path:'/login',
    component: Login
  },
  {
    path:'/admin',
    component: Admin
  },
  {
    path:'/',
    component:()=>{
      return(
        <div>111</div>
      );
    }
  },
  {
    path:'*',
    component:()=>{
      return (
        <div>404</div>
      );
    }
  },
];