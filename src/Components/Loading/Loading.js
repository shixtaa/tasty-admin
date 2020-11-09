import React from 'react';
import { Spin } from 'antd';
import './loading.scss';
import { useSelector } from 'react-redux';

export default function Loading () {
  const isLoading = useSelector(state=>state.loading.isLoading);
  return (
    isLoading ?
      <div className='loading'>
        <Spin size="large" />
      </div> : null
  );
}
