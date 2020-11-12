import React, {  useEffect,useState } from 'react';
/* antd */
import { Table,Tag,Switch, Button } from 'antd';

/* actions */
import { getRest,saveItem,getTags ,showModal } from '../Admin/State/reducer';
import { updateRest } from './state/reducer';

/* lodash */
import _ from 'lodash';
import {  useDispatch ,useSelector } from 'react-redux';

import {useMount} from 'react-use'

/* components */
import ModalBox from './Component/ModalBox';

/* utils */
// import {disable} from '../../Common/utils'

/* 自定义hook */
import useDisable from '../../Hook/useDisable'

export default function Restaurant () {
  const [ dataSource,setDataSource ] = useState([]);
  /* state中存储的餐馆列表 */
  const list = useSelector(state=>state.restaurant.list);

  const dispatch = useDispatch();
  const isDisable = useDisable()
  /* eslint-disable */
  useMount( async ()=>{
    await dispatch(getRest());
    await dispatch(getTags());
  },[]);

  useEffect(()=>{
    if( list.length >0){
      renderList();
    }
  },[ list ]);

  /* 渲染restarant列表 */
  function renderList (){
    let array = [];
    _.map(list,(item)=>{
      array.push({
        name:item.name['zh-CN'],
        address:item.address.formatted,
        tags:item.tags,
        key:item._id,
        modalInfo:item,
        closed:item.closed
      });
    });
    setDataSource(array);
  }

  /* 人为关闭 */
  async function onChange (value){
    let close = {};
    if(value.closed == (null || undefined)){
      close.closed = true;
    }else{
      close = null;
    }
    let data = {
      id:value.key,
      data:{
        ..._.omit({ closed:close },'_id')
      } };
    await dispatch(updateRest(data));
  }

  /* 打开modal */
  function openModal (value){
    dispatch(saveItem(value));
    dispatch(showModal());
  }


  const columns = [
    {
      title: '餐馆',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <div>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={ color } key={ Math.random() }>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'index',
      render:( text,record)=>{
        return (
          <Button disabled={isDisable}  type="primary" onClick={ ()=>{openModal(record.modalInfo);} } >
          操作
          </Button>
        );
      }
    },
    {
      title: '手动关闭',
      key: 'closed',
      render:(text,record)=> {
        return (
          <Switch disabled={isDisable} onChange={ ()=>{onChange(record);} }  checked={ !_.isEmpty(record.closed) }/>
        );
      }
    },
  ];
  return (
    <div>
      <Table dataSource={ dataSource } columns={ columns } />
      <ModalBox ></ModalBox>

    </div>
  );
}
