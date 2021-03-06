import React from 'react';

/* pages */
import Admin from '../Features/Admin/Admin';
import Login from '../Features/Login/Login'
import Restaurant from '../Features/Restaurant/Restaurant'
import Menu from '../Features/Menu/Menu'
import Order from '../Features/Order/Order'



export const routerConfig = [
  {
    path:'/login',
    component: Login
  },
  {
    path:'/admin',
    component: Admin,
    routes: [
      {
        path: '/admin/restaurant',
        component: Restaurant
      },
      
      {
        path: '/admin/menu',
        component: Menu
      },
      {
        path: '/admin/order',
        component: Order
      }]
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