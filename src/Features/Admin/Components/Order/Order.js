import React, { useEffect, useRef, useState } from 'react';
/* style */
import './order.scss'
/* antd */
import { DatePicker, Space } from 'antd';
import { useSelector } from 'react-redux';

import moment from 'moment'
/* lodash */
import _ from 'lodash'
/* echarts */
 // 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入环形图
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';

// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// import 'echarts/lib/component/visualMap';

/* actions */
import {getOrder,clearOrder} from './state/reducer'
import { useDispatch } from 'react-redux';

/* utils */
import {getStorage} from '../../../../Common/utils'
import { useHistory } from 'react-router-dom';

const { RangePicker } = DatePicker;
export default function Order () {
  const orderList=useSelector(state=>state.order.list)
  const dispatch=useDispatch()
  const history=useHistory()
  const quantityRef=useRef()
  const peopleRef =useRef()
  // const quantityLineRef=useRef()
  // const quantityPieRef=useRef()
  const [allDate,setAllDate]=useState([])
  /* eslint-disable */
  useEffect(()=>{
    let user=getStorage('user')
    if(user&&user==='visitor'){
      history.push('/admin/restaurant')
    }
    dispatch(clearOrder())
    // quantityLine()
    // quantityPie()
    renderQuantity()
    renderPeople()
  },[])
  useEffect(()=>{
    if(orderList.length>0){
      // quantityLine()
      // quantityPie()
      renderQuantity()
      renderPeople()
    }
  },[orderList.length])

/* 去重，计算数量 */
function handleData(array,params){
  let list=[]
  console.log(array)
  _.forIn(_.groupBy(array,params),(value,key)=>{
    let item = {
      name:'',
      count : 0
    };
    item.name = key.toString();
    item.count = value.length;
    list.push(item);
  })
    return list
}

  /* 订单量数据 */
function quantityData(){
  
  let array = []
  /* 获取订单日期 */
  _.map(orderList,(item)=>{
    array.push({date:moment(item.createdAt).format('YYYY-MM-DD')})
  })
  /* 将订单日期分组、去重 */
  let list=handleData(array,'date')
  let test=_.map(list,(item)=>{
    return item.name
  })
  /* 将list和所选日期范围内的所有日期进行比较，list中没有的添加到list中，count为0 */
  _.map(allDate,(item)=>{
    if(_.indexOf(test,item)===-1){
      list.push({name:item,count:0})
    }
  })

  let piedata = _.map(list,(item) => {
    return {
      name: item.name,   
      value: item.count,
    };
  });
  /* 排序 */
  let data=_.orderBy(piedata,'name','asc')
  return data
}
  /* 订单量-折线图 */
// function quantityLine(){
//   let data=quantityData()
//   echarts.init(quantityLineRef.current).setOption({
//     title: {
//       text: '订单量',
//       textStyle: {
//         color: '#fff',
//         fontSize: 20,
//       },
//     },
//     legend:{
//       data:['订单量']
//     },
//     xAxis: {
//       // boundaryGap: false,
//       type: 'category',
//       // axisLabel:{interval:0},
//       // scale: true,
//       data: _.map(data,(item)=>{return item.name})

//     },
//     yAxis: {
//         type: 'value'
//     },
//     series: [
//       {
//         name: '订单量',
//         itemStyle : { normal: {label : {show: true}}},
//         type: 'line',
//         smooth: true,
//         data:_.map(data,(item)=>{return item.value})
//       }
//     ]
//   })
// }
  /* 订单量-饼图 */
// function quantityPie(){
//   let data=quantityData()
//   echarts.init(quantityPieRef.current).setOption({
//   series: [
//     {
//       name: '订单量',
//       type: 'pie',
//       radius: '45%',
//       label: {
//         formatter: '{b}: {c} ({d}%)',
//         textStyle: {
//           color: '#fff',
//           fontSize: 12,
//         },
//       },
//       data: data
//     },
//   ]
//   })
// }
/* 订单量 */
function renderQuantity(){
  let data=quantityData()
  echarts.init(quantityRef.current).setOption({
    title: {
      text: '订单量',
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
    },
    grid:{
      left:'5%',
      right:'50%'
    },
    xAxis: {
      type: 'category',
      data: _.map(data,(item)=>{return item.name})

    },
    yAxis: {
        type: 'value'
    },
    series: [
      {
        name: '订单量',
        itemStyle : { normal: {label : {show: true}}},
        type: 'line',
        barMaxWidth:'600px',
        smooth: true,
        data:_.map(data,(item)=>{return item.value})
      },
      {
        name: '订单量',
        type: 'pie',
        radius: '40%',
        center:['70%', '50%'],
        label: {
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        data: data
      },
    ]
  })
}
  /* 订单人群 */
function renderPeople(){
  let array = []
  _.map(orderList,(item)=>{
    if(item.user){
      array.push(item.user)
    }
    else{
      array.push(' ')
    }
  })
  let list=handleData(array,'username')
  var piedata = _.map(list,(item) => {
    return {
      name: item.name,   
      value: item.count,
    };
  });
  echarts.init(peopleRef.current).setOption({
    title: {
      text: '订单人群',
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
    },
    series: [
      {
        name: '订单人群',
        type: 'pie',
        radius: '55%',
        label: {
          formatter: '{b}: {c} ({d}%)',
          textStyle: {
            fontSize: 12,
          },
        },
        data: piedata
      },]
  })
}
/* 修改时间范围 */
async function changeData(date, dateString){
  let start= moment(date[0]._d).utc().toISOString();
  let end= moment(date[1]._d).utc().toISOString();
  let array=formatTime(start,end)
  setAllDate(array)
  await dispatch(getOrder(start,end))
}
/* 把选择的日期范围 全部罗列出来 */
function formatTime (start,end){
  var startTime = start;
  var endTime = end;
  var bd = new Date(startTime),be = new Date(endTime);
  var bdTime = bd.getTime(), beTime = be.getTime(),timeDiff = beTime - bdTime;
  var dArr = [];
  for(var i = 0; i <= timeDiff; i += 86400000){
    var ds = new Date(bdTime + i);
    let mydate = ds.getDate();
    if(ds.getDate() < 10){
      mydate = '0' + ds.getDate();  //补齐
    }
    dArr.push((ds.getFullYear()) + '-' + (ds.getMonth() + 1) + '-' + mydate);
  }
  return dArr;
}
  return (
    <div>
      <Space direction="vertical" size={ 20 }>
        <RangePicker style={{ width :'800px' }} onChange={changeData} /* disabled={disable()} */ />
      </Space>
      <div className='main'>
        <div className='order-quantity' ref={quantityRef}>
          {/* <div className='quantity-line' ref={quantityLineRef} ></div> */}
          {/* <div className='quantity-pie'  ref={quantityPieRef}  ></div> */}
        </div>
        <div className='order-people' ref={peopleRef}></div>
      </div>
    </div>
  );
}
