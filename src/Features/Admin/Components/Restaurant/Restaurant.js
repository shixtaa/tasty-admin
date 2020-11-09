import React, {  useEffect,useState } from 'react';
/* antd */
import { Table,Tag,Switch, Button } from 'antd';

/* actions */
import { getRest,saveItem,getTags ,showModal } from '../../State/reducer';
import { updateRest } from './state/reducer';

/* lodash */
import _ from 'lodash';
import {  useDispatch ,useSelector } from 'react-redux';

/* components */
import ModalBox from './Component/ModalBox';

export default function Restaurant () {
  const [ dataSource,setDataSource ] = useState([]);
  const [ flag,setFlag ] = useState(false);

  /* 点击操作之后赋给modal的信息 */
  const [ perItem,setPerItem ] = useState({});
  /* state中存储的餐馆列表 */
  const list = useSelector(state=>state.restaurant.list);
  const language = useSelector(state=>state.language.lang);

  const dispatch = useDispatch();

  const isShow = useSelector(state=>state.restaurant.isShow);

  useEffect( async ()=>{
    await dispatch(getRest());
    renderList();
    dispatch(getTags());
  },[ list.length ]);

  useEffect( async ()=>{
    renderList();
  },[ list ]);

  useEffect(()=>{
    if(perItem.name){
      setPerItem({ ...perItem,newName:perItem.name[`${language}`] });
    }
  },[ language ]);

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
  async function onChange (checked,value){
    setFlag(!flag);
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
    console.log(value);
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
          <Button type="primary" onClick={ ()=>{openModal(record.modalInfo);} } >
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
          record.closed !== (null || undefined) ?
            <Switch  onChange={ (checked)=>{onChange(checked,record);} } defaultChecked /> :
            <Switch  onChange={ (checked)=>{onChange(checked,record);} }  checked={ !_.isEmpty(record.closed) }/>
        );
      }
    },
  ];
  return (
    <div>
      <Table dataSource={ dataSource } columns={ columns } />
      {isShow ? <ModalBox ></ModalBox> : null}
    </div>
  );
}
