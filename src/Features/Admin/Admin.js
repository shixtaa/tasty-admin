import React, { useState } from 'react';
/* style */
import logo from '../../Assets/logo.png';
import './admin.scss';
/* antd */
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
/* router */
import { BrowserRouter as Router,Switch,Route, Link ,useLocation,Redirect } from 'react-router-dom';

/* components */
import Restaurant from './Components/Restaurant/Restaurant';
import MyMenu from './Components/Menu/Menu';
import Loading from '../../Components/Loading/Loading';
import Order from './Components/Order/Order';

export default function Admin () {
  const [ collapsed,setCollapsed ] = useState(false);
  const [ tab,setTab ] = useState('restaurant');
  const location = useLocation();
  function onCollapse (){
    setCollapsed(!collapsed );
  }
  function changeTab (tabName){
    setTab(tabName);
  }
  console.log(location.pathname);
  return (
    <Router>
      <div>
        <Layout style={{ minHeight : '100vh' }} >
          <Sider collapsible collapsed={ collapsed } onCollapse={ onCollapse }>
            <div className="logo">
              <img src={ logo } className='logo-img'></img>
            </div>
            <Menu theme="dark" defaultSelectedKeys={ location.pathname } mode="inline">
              <Menu.Item key="/admin/restaurant"  icon={ <PieChartOutlined /> } onClick={ ()=>{changeTab('restaurant');} } >
                <Link to='/admin/restaurant'>
              餐馆
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/menu"  icon={ <DesktopOutlined /> } onClick={ ()=>{changeTab('menu');} } >
                <Link to='/admin/menu'>
              菜单
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/order"  icon={ <LineChartOutlined /> } onClick={ ()=>{changeTab('order');} } >
                <Link to='/admin/order'>
              订单
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding : 0 }} />
            <Content style={{ margin : '0 16px' }}>
              <Breadcrumb style={{ margin : '16px 0' }}>
                <Breadcrumb.Item>admin</Breadcrumb.Item>
                <Breadcrumb.Item>{tab}</Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding : 24, minHeight : 360 }}>
                <Switch>
                  <Route path='/admin/restaurant'>
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
                  </Route>
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
