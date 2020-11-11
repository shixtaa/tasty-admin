import React,{ useState,useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
/* actions */
import { updateRest } from '../state/reducer';
import { hideModal } from '../../Admin/State/reducer';


/* lodash */
import _ from 'lodash';

/* moment */
import moment from 'moment-timezone';

/* antd */
import { Modal,Form, Input, Select ,Tag ,TimePicker ,Button } from 'antd';

moment.locale('zh-cn',{ weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'), });
const { Option } = Select;
const { RangePicker } = TimePicker;

export default function ModalBox () {
  const tags = useSelector(state=>state.restaurant.tags);
  const selectedList = useSelector(state=>state.restaurant.selectedItem);
  const isShow = useSelector(state=>state.restaurant.isShow);

  const [ time,setTime ] = useState(new Date());
  const [ afterUpdatedRestaurant,setAfterUpdatedRestaurant ] = useState('');
  const [language,setLanguage]=useState('zh-CN')

  const dispatch = useDispatch();

  /* 纽约时间 */
  var newYork = moment.tz(time, 'America/New_York').format('YYYY-MM-DD HH:mm:ss dddd');

  /* 注入灵魂 */
  useEffect(()=>{
    setAfterUpdatedRestaurant(selectedList)
  },[selectedList])

  /* 每秒循环时间 */
  useEffect(()=>{
    let timer = setInterval(()=>{
      setTime(new Date());
    },1000);
    return ()=>{
      if (timer){
        clearInterval(timer);
      }
    };
  },[]);
  

  /* 确认更新 */
  async function handleOk (){
    /* 更新信息 */
    let data = {
      id:selectedList._id,
      data:{
        ..._.omit(afterUpdatedRestaurant,'_id')
      }
    };
    await dispatch(updateRest(data));
    /* 隐藏modal */
    handleCancel();
  }

  /* 取消modal */
  function handleCancel () {
    dispatch(hideModal());
  }

  /* 渲染所有的tags列表 */
  function renderTagList (){
    return _.map(tags,(item)=>{
      return (
        <Option value={ item } key={ Math.random() }>{item}</Option>
      );
    });
  }
  /* 增加tags */
  function addTag (value){
    let tagList=_.cloneDeep(_.get(afterUpdatedRestaurant,'tags'))
    if(_.indexOf(tagList,value) === -1){
      tagList.push(value);
      }
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,tags:tagList });
  }

  /*删除tags */
  function removeTag (index){
    let tagList=_.cloneDeep(_.get(afterUpdatedRestaurant,'tags'))

    // console.log(tagList)
    tagList.splice(index,1);
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,tags:tagList });
  }

  /* 渲染餐馆的tags */
  function renderTags (){
    if(afterUpdatedRestaurant.tags){
      return _.map(afterUpdatedRestaurant.tags,(tag,index) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          return (
            <Tag color={ color } key={ Math.random() } closable onClose={ ()=>{removeTag(index);} } style={{ marginRight :'10px' }}>
              {tag.toUpperCase()}
            </Tag>
          );
        });
    }
  }

  /* 修改菜名input */
  function changeInput (e){
    let name = e.target.value;
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,name:{ ...afterUpdatedRestaurant.name,[`${language}`]:name } });

  }

  /* format时间 */
  function formatTime(time){
    return parseInt(moment(time).hours()) * 60 + parseInt(moment(time).minutes());

  }

  /* 修改时间 */
  function changeHour (time,timeString,index){
    let hour=_.cloneDeep(afterUpdatedRestaurant.hours)
    hour[index].start = formatTime(time[0])
    hour[index].end = formatTime(time[1])
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,hours:hour });
  }

  /* 获取一段范围内的所有数值 */
  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  /* 时间选择 */
  function renderTimeList (){
    let array = [ '星期一','星期二','星期三','星期四','星期五','星期六','星期天' ];
    return _.map(array, (item,index)=>{
      if(afterUpdatedRestaurant.hours){
        let hourInfo = afterUpdatedRestaurant.hours[index];
        let result = hourInfo ? [ moment().startOf('day').add(hourInfo.start,'minutes'),moment().startOf('day').add(hourInfo.end,'minutes')] : [ '00:00:00','00:00:00' ];
        return (
          <div key={ afterUpdatedRestaurant._id + index }>
            <Button type="primary" disabled>
              {item}
            </Button>
            <RangePicker disabledSeconds={()=> range(0, 60)} defaultValue={result} onChange={(time,timeString)=>{changeHour(time,timeString,index)}}></RangePicker>
          </div>
        );
      }
    });
  }

  return (
    <div>
      <Modal
        title={ _.get(selectedList,`name[${language}]`) }
        visible={ isShow }
        onOk={ handleOk }
        onCancel={ handleCancel }
      >
        <Form >
          <Form.Item label="餐馆名称：">
            <Input.Group compact>
              <Form.Item
                noStyle
              >
                <Select style={{ width :'80px' }} defaultValue={language} onChange={ (value)=>{setLanguage(value) } }>
                  <Option value="zh-CN" >中文</Option>
                  <Option value="en-US" >英文</Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
              >
                <Input style={{ width : '50%' }} placeholder="Input value"   value={ _.get(afterUpdatedRestaurant,`name[${language}]`)} onChange={ (e)=>{changeInput(e);} }/>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="餐馆标签：">
            <Form.Item>
              <Select style={{ width :'120px',margin :'0 10px 6px 0' }} defaultValue={ tags[0] } onChange={ (value)=>{addTag(value);} }>
                {renderTagList()}
              </Select>
              {renderTags()}
            </Form.Item>
          </Form.Item>
          <Form.Item label="开门时间：">
            <Form.Item>
              <h3>纽约当地时间</h3>
              <h1 >{newYork}</h1>
              {renderTimeList()}
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
