import { Select } from 'antd';
import React from 'react';
import _ from 'lodash';
const { Option } = Select;

/* 往localstorage里面设置特定的值 */
export function setStorage (key, data) {
  if(!key) return;
  localStorage.setItem(key, JSON.stringify(data));
}

/* 从localstorage里面获取特定的值 */
export function getStorage (key) {
  if(!key) return;
  let res = localStorage.getItem(key);
  try {
    return JSON.parse(res);
  } catch (err) {
    return res;
  }
}

/* 渲染下拉列表 */

export function renderOption (list,content){
  return _.map(list,(item)=>{
    return (
      <Option value={ JSON.stringify(item) } key={ Math.random() }>{content}</Option>
    );
  });
}


/* admin之外的权限不可操作 */
export function disable(){
  let user=getStorage('user')
  if(user!=='admin'){
    return true
  }else{
    return false
  }
}