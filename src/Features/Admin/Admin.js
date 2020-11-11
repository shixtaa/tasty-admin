import React, { useState } from 'react';
/* style */
import logo from '../../Assets/logo.png';
import './admin.scss';
/* antd */
import { Layout, Menu, Breadcrumb ,Button} from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
/* router */
import { /* BrowserRouter as Router ,*/Switch ,useLocation/* ,Link */, useHistory } from 'react-router-dom';

import PrivateRoute from '../../Common/PrivateRoute'

/* components */
import Loading from '../../Components/Loading/Loading';

/* utils */
import {getStorage} from '../../Common/utils'

/* actions */
import {removeUser} from '../Login/state/reducer'
import { useDispatch } from 'react-redux';

import _ from 'lodash'
import PropTypes from 'prop-types';

const { Header, Content, Footer, Sider } = Layout;
export default function Admin ({routes}) {

  let location = useLocation();
  const [ collapsed,setCollapsed ] = useState(false);
  const user=getStorage('user')
  
  const dispatch=useDispatch()
  const history= useHistory()

  /* eslint-disable */

  function onCollapse (){
    setCollapsed(!collapsed );
  }
/* 登出 */
  function logout(){
    dispatch(removeUser())
    history.push('/login')
  }

/* 渲染admin下的子组件 */
  function renderSubRoutes (){
    return _.map(routes,(item)=>{
      return <PrivateRoute { ...item } path={item.path} key={Math.random()} ></PrivateRoute>;
    });
  }

  function renderBreadcrumb(){

    return _.map(location.pathname.split('/'),(item)=>{
      if(!item){
        return null
      }else{
        return (
          <Breadcrumb.Item key={Math.random()}>{item}</Breadcrumb.Item>
        )
      }
    })
  }
  
  
  
  return (
    // <Router>
      <div>
        <Layout style={{ minHeight : '100vh' }} >
          <Sider collapsible collapsed={ collapsed } onCollapse={ onCollapse } >
            <div className="logo">
              <img src={ logo } className='logo-img' alt='logo'></img>
            </div>
            {/* 左侧菜单栏 */}
            <Menu theme="dark" defaultSelectedKeys={ _.last(location.pathname.split('/'))} mode="inline">
              <Menu.Item key="restaurant"  icon={ <PieChartOutlined /> } onClick={()=>{history.push('/admin/restaurant')}} >
                餐馆
              </Menu.Item>
              <Menu.Item key="menu"  icon={ <DesktopOutlined /> } onClick={()=>{history.push('/admin/menu')}} >
                菜单
              </Menu.Item>
              {user&&(user!=='visitor')?
              <Menu.Item key="order"  icon={ <LineChartOutlined /> } onClick={()=>{history.push('/admin/order')}} >
                订单
              </Menu.Item>:null}
            </Menu>
            {/* 登出 */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>

              <Button type="primary" onClick={logout} style={{position:'fixed',bottom:'100px',}}>登出</Button>
            </div>
          </Sider>
          {/* 右侧主体 */}
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding : 0 }} />
            <Content style={{ margin : '0 16px' }}>
              {/* 面包屑 */}
              <Breadcrumb style={{ margin : '16px 0' }}>
                {renderBreadcrumb()}
              </Breadcrumb>
              {/* 嵌套路由 */}
              <div className="site-layout-background" style={{ padding : 24, minHeight : 360 }}>
                <Switch>
                  {renderSubRoutes()}
                </Switch>
                <Loading></Loading>
              </div>
            </Content>
            <Footer style={{ textAlign : 'center' }}>Ant Design ©2018 Created by shixt</Footer>
          </Layout>
        </Layout>
      </div>
    // </Router>
  );
}
Admin.prototype={
  routes:PropTypes.array
}
