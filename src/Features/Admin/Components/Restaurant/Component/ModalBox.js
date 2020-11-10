import React,{ useState,useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/* actions */
import { setEn,setZh ,updateRest } from '../state/reducer';
import { hideModal } from '../../../State/reducer';

/* lodash */
import _ from 'lodash';

/* moment */
import moment from 'moment-timezone';

/* antd */
import { Modal,Form, Input, Select ,Tag ,TimePicker ,Button } from 'antd';

moment.locale('zh-cn',{ weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'), });
const { Option } = Select;
const { RangePicker } = TimePicker;
// import { renderOption } from '../../../../../Common/utils';

export default function ModalBox () {
  const language = useSelector(state=>state.language.lang);
  const tags = useSelector(state=>state.restaurant.tags);
  const selectedList = useSelector(state=>state.restaurant.selectedItem);
  const isShow = useSelector(state=>state.restaurant.isShow);

  const [ inputValue,setInputValue ] = useState('');
  const [ time,setTime ] = useState(new Date());
  const [ tagList,setTagList ] = useState([]);
  const [ hour,setHour ] = useState([]);
  const [ afterUpdatedRestaurant,setAfterUpdatedRestaurant ] = useState({});

  const dispatch = useDispatch();

  const inputRef = useRef();

  /* 纽约时间 */
  var newYork = moment.tz(time, 'America/New_York').format('YYYY-MM-DD HH:mm:ss dddd');

  /* 确认 */
  function handleOk (){
    /* 更新信息 */
    let data = {
      id:selectedList._id,
      data:{
        ..._.omit(afterUpdatedRestaurant,'_id')
      }
    };
    dispatch(updateRest(data));
    /* 隐藏modal */
    handleCancel();

  }
  /* 取消modal */
  function handleCancel () {
    dispatch(hideModal());
  }

  /* 改变语言 */
  async function changeLang (value){
    if(value === 'zh-CN'){
      await dispatch(setZh());
    }else{
      await dispatch(setEn());
    }
  }

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
/* eslint-disable */
  useEffect(  ()=>{
    setInputValue(selectedList.name[`${language}`]);
    setTagList(selectedList.tags);
    setAfterUpdatedRestaurant(selectedList);
    setHour(selectedList.hours);
    inputRef.current.state.value = inputValue;
  },[ language,inputValue ]);

  /* 渲染所有的tags列表 */
  function renderTagList (){
    return _.map(tags,(item)=>{
      return (
        <Option value={ item } key={ Math.random() }>{item}</Option>
      );
    });
  }
  /* 增加tags */
  function changeTag (value){
    let cloneList = _.cloneDeep(tagList);
    if(_.indexOf(cloneList,value) === -1){
      cloneList.push(value);
    }
    setTagList(cloneList);
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,tags:cloneList });
  }

  /*删除tags */
  function close (index){
    let cloneList = _.cloneDeep(tagList);
    cloneList.splice(index,1);
    setTagList(cloneList);
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,tags:cloneList });

  }

  /* 渲染餐馆的tags */
  function renderTags (){
    return tagList.map((tag,index) => {
      let color = tag.length > 5 ? 'geekblue' : 'green';
      if (tag === 'loser') {
        color = 'volcano';
      }
      return (
        <Tag color={ color } key={ Math.random() } closable onClose={ ()=>{close(index);} } style={{ marginRight :'10px' }}>
          {tag.toUpperCase()}
        </Tag>
      );
    });}

  /* format开关时间 */
  function formatTime (value){
    return `${value / 60}:${value % 60}:00`;
  }

  /* picker的默认时间 */
  function gethour (info){
    let hourList = [
      moment( formatTime(info[0]),'HH:mm:ss'),
      moment( formatTime(info[1]),'HH:mm:ss')
    ];
    return hourList;
  }
  /* 修改菜名input */
  function changeInput (e){
    let name = e.target.value;
    if(inputValue !== name){
      setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,name:{ ...selectedList.name,[`${language}`]:name } });
    }
  }
  /* 修改时间 */
  function changeHour (time,timeString,index){
    let startarr = timeString[0].split(':');
    let endarr = timeString[1].split(':');
    let start = parseInt(startarr[0]) * 60 + parseInt(startarr[1]);
    let end = parseInt(endarr[0]) * 60 + parseInt(endarr[1]);
    let cloneHours = _.cloneDeep(selectedList.hours[index]);
    cloneHours.start = start;
    cloneHours.end = end;
    let newHour = _.cloneDeep(hour);
    newHour[index] = cloneHours;
    setHour(newHour);
    setAfterUpdatedRestaurant({ ...afterUpdatedRestaurant,hours:newHour });
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
      let hourInfo = selectedList.hours[index];
      let result = hourInfo ? [ hourInfo.start,hourInfo.end ] : [ '00:00:00','00:00:00' ];
      return (
        <div key={ selectedList._id + index }>
          <Button type="primary" disabled>
            {item}
          </Button>
          <RangePicker disabledSeconds={()=> range(0, 60)} defaultValue={ gethour(result) } onChange={ (time,timeString)=>{changeHour(time,timeString,index);} } ></RangePicker>
        </div>
      );
    });
  }

  return (
    <div>
      <Modal
        title={ selectedList.name[`${language}`] }
        visible={ isShow }
        onOk={ handleOk }
        onCancel={ handleCancel }
      >
        <Form >
          <Form.Item label="餐馆名称：">
            <Input.Group compact>
              <Form.Item
                name={ [ 'name', 'province' ] }
                noStyle
                rules={ [ { required: true, message: 'Province is required' } ] }
                initialValue={ language }
              >
                <Select style={{ width :'80px' }}  onChange={ (value)=>{changeLang(value); } }>
                  <Option value="zh-CN" >中文</Option>
                  <Option value="en-US" >英文</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name={ [ 'address', 'street' ] }
                noStyle
                rules={ [ { required: true, message: 'Street is required' } ] }
              >
                <Input style={{ width : '50%' }} placeholder="Input value" ref={ inputRef }  value={ inputRef }  onBlur={ (e)=>{changeInput(e);} }/>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="餐馆标签：">
            <Form.Item>
              <Select style={{ width :'120px',margin :'0 10px 6px 0' }} defaultValue={ tags[0] } onChange={ (value)=>{changeTag(value);} }>
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
