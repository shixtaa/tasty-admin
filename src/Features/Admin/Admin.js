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
import { BrowserRouter as Router,Switch, Link ,useLocation, useHistory } from 'react-router-dom';

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

  const location = useLocation();
  const [ collapsed,setCollapsed ] = useState(false);
  const [ tab,setTab ] = useState(location.pathname);
  const user=getStorage('user')
  
  const dispatch=useDispatch()
  const history= useHistory()

  function onCollapse (){
    setCollapsed(!collapsed );
  }
  function changeTab (tabName){
    setTab(tabName);
  }

  function logout(){
    dispatch(removeUser())
    history.push('/login')
  }

/* 渲染admin下的子组件 */
  function renderRouter (){
    // console.log('routes',routes)
    return _.map(routes,(item)=>{
      return <PrivateRoute { ...item } path={`/admin${item.path}`} key={ Math.random() }></PrivateRoute>;
    });
  }
/* eslint-disable */
/* url改变，切换tab */
  // useEffect(()=>{
    // if(location.pathname === '/admin/restaurant' || location.pathname === '/admin'||location.pathname === '/admin/order'&&user=='visitor'){
    //   setTab('Restaurant');

    // }else if(location.pathname === '/admin/menu'){
    //   setTab('Menu');

    // }else if(location.pathname === '/admin/order'){
    //   setTab('Order');
    // }
    // console.log(location.pathname)
  // },[tab,location.pathname])

  function renderBreadcrumb(){
    
    return _.map(tab.split('/').slice(1),(item)=>{
      return (
        <Breadcrumb.Item key={Math.random()}>{item}</Breadcrumb.Item>
      )
    })
  }
  return (
    <Router>
      <div>
        <Layout style={{ minHeight : '100vh' }} >
          <Sider collapsible collapsed={ collapsed } onCollapse={ onCollapse } >
            <div className="logo">
              <img src={ logo } className='logo-img' alt='logo'></img>
            </div>
            <Menu theme="dark" defaultSelectedKeys={ tab} mode="inline">
              <Menu.Item key="/admin/restaurant"  icon={ <PieChartOutlined /> } onClick={ ()=>{changeTab('/admin/restaurant');} } >
                <Link to='/admin/restaurant'>
              餐馆
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/menu"  icon={ <DesktopOutlined /> } onClick={ ()=>{changeTab('/admin/menu');} } >
                <Link to='/admin/menu'>
              菜单
                </Link>
              </Menu.Item>
              {user&&(user!=='visitor')?
              <Menu.Item key="/admin/order"  icon={ <LineChartOutlined /> } onClick={ ()=>{changeTab('/admin/order');} } >
                <Link to='/admin/order'>
              订单
                </Link>
              </Menu.Item>:null}
            </Menu>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>

              <Button type="primary" onClick={logout} style={{position:'fixed',bottom:'100px',}}>登出</Button>
            </div>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding : 0 }} />
            <Content style={{ margin : '0 16px' }}>
              <Breadcrumb style={{ margin : '16px 0' }}>
                {renderBreadcrumb()}
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding : 24, minHeight : 360 }}>
                <Switch>
                  {/* <Route path='/admin/restaurant'>
                    <Restaurant></Restaurant>
                  </Route>
                  <Route path='/admin/menu'>
                    <MyMenu></MyMenu>
                  </Route>
                  <Route path='/admin/order'>
                    <Order></Order>
                  </Route>
                  <Route path='/admin'>
                    <Redirect to='/admin/restaurant'></Redirect>
                  </Route> */}
                  {renderRouter()}
                </Switch>
                <Loading></Loading>
              </div>
            </Content>
            <Footer style={{ textAlign : 'center' }}>Ant Design ©2018 Created by shixt</Footer>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
}
Admin.prototype={
  routes:PropTypes.array
}
