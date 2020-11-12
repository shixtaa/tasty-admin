import React, { useState } from 'react'
import './login.scss'
/* antd */

import { Form, Input, Button } from 'antd';

/* actions */
import {postLogin} from './state/reducer'
import { useDispatch } from 'react-redux';

/* utils */
import {setStorage} from '../../Common/utils'
import { useHistory } from 'react-router-dom';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function Login() {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const history=useHistory()

const dispatch=useDispatch()

async  function loginClick(){
    let data={
      username:username,
      password:password
    }
    let result=await dispatch(postLogin(data))
    console.log(result)
    if(result){
      setStorage('user',result.role)
      history.push('/admin/restaurant')
    }
  }
  return(
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      style={{margin:'300px auto',width:'500px',}}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={loginClick}>
          登录
        </Button>
      </Form.Item>
    </Form>
    );
}
