import React from 'react';

/* pages */
import Admin from '../Features/Admin/Admin';
export const routerConfig = [
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