import React, { useState, useEffect } from 'react';
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
import { BrowserRouter as Router,Switch,Route, Link ,useLocation,Redirect, useHistory } from 'react-router-dom';

/* components */
import Restaurant from '../Restaurant/Restaurant';
import MyMenu from '../Menu/Menu';
import Loading from '../../Components/Loading/Loading';
import Order from '../Order/Order';

/* utils */
import {getStorage} from '../../Common/utils'

/* actions */
import {removeUser} from '../Login/state/reducer'
import { useDispatch } from 'react-redux';

const { Header, Content, Footer, Sider } = Layout;
export default function Admin () {
  const [ collapsed,setCollapsed ] = useState(false);
  const [ tab,setTab ] = useState('restaurant');

  const user=getStorage('user')
  const location = useLocation();
  
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
  // console.log(location.pathname);
/* eslint-disable */
/* url改变，切换tab */
  useEffect(()=>{
    // console.log(arr)
    // console.log('in')
    // if(location.pathname.split('/').length===3){
    //   setTab(location.pathname.split('/')[2])
    // }
    if(location.pathname === '/admin/restaurant' || location.pathname === '/admin'||location.pathname === '/admin/order'&&user=='visitor'){
      setTab('Restaurant');

    }else if(location.pathname === '/admin/menu'){
      setTab('Menu');

    }else if(location.pathname === '/admin/order'){
      setTab('Order');
    }
  },[location.pathname])
  return (
    <Router>
      <div>
        <Layout style={{ minHeight : '100vh' }} >
          <Sider collapsible collapsed={ collapsed } onCollapse={ onCollapse } >
            <div className="logo">
              <img src={ logo } className='logo-img' alt='logo'></img>
            </div>
            <Menu theme="dark" defaultSelectedKeys={ tab } mode="inline">
              <Menu.Item key="restaurant"  icon={ <PieChartOutlined /> } onClick={ ()=>{changeTab('restaurant');} } >
                <Link to='/admin/restaurant'>
              餐馆
                </Link>
              </Menu.Item>
              <Menu.Item key="menu"  icon={ <DesktopOutlined /> } onClick={ ()=>{changeTab('menu');} } >
                <Link to='/admin/menu'>
              菜单
                </Link>
              </Menu.Item>
              {user&&(user!=='visitor')?
              <Menu.Item key="order"  icon={ <LineChartOutlined /> } onClick={ ()=>{changeTab('order');} } >
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
