/* eslint-disable */
import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/* antd */
import { Select,Table,Switch ,Input,Space,Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

/* 库 */
import _  from 'lodash';
import pinyinMatch from 'pinyin-match';

/* actions */
import { getMenu ,getRestaurantName,clearData ,updateAvailable } from './state/reducer';
const { Option } = Select;

/* 自定义hook */
import useDisable from '../../Hook/useDisable'

export default function Menu () {
  const restNameList = useSelector(state=>state.menu.restaurantNames);
  const foodList = useSelector(state=>state.menu.list);
  const count = useSelector(state=>state.menu.count);

  const [ data,setData ] = useState([]);
  const [ selectedRest,setselectedRest ] = useState('');
  const [ pagination,setPagination ] = useState({
    current:1,
    page: 1,
    pageSize: 10,
    total:count
  });
  const[ searchInput,setsearchInput ] = useState('');

  const dispatch = useDispatch();

  /* 权限 */
  const isDisable=useDisable()
  const [ filterDropdownVisible,setFilterDropdownVisible ] = useState(false); // 筛选项下拉
  /* table 数据 */
  const columns = [
    {
      title: '菜品',
      dataIndex: 'name',
      render: name => <span>{name}</span>,
      width: '40%',
      filterDropdown:() => (
        <div style={{ padding : 8 }}>
          <Input
            placeholder={ 'Search name' }
            value={ searchInput }
            onChange={ (e)=>{setsearchInput(e.target.value);} }
            style={{ width : 188, marginBottom : 8, display : 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={ () => handleSearch() }
              icon={ <SearchOutlined /> }
              size="small"
              style={{ width : 90 }}
            >
            Search
            </Button>
          </Space>
        </div>
      ),
      filterDropdownVisible:filterDropdownVisible,
      onFilterDropdownVisibleChange:(visible) => { //是否显示筛选框
        if(visible){
          setFilterDropdownVisible(true);
        }else{
          setFilterDropdownVisible(false);
        }
      }
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: price => <span> {price}</span>,
      width: '30%',
    },
    {
      title: '状态',
      key: 'available',
      render:(text,record)=> {
        return (
            <Switch disabled={isDisable} onChange={ ()=>{changeAvailable(record);} } checked={ record.available } />
        );
      },
      width: '30%',
    },
  ];
  /* 渲染餐馆名称 */
  useEffect( ()=>{;
    dispatch(getRestaurantName());
    return ()=>{
      dispatch(clearData());
    }
  },[]);
  

  useEffect(()=>{

    renderData();
    setPagination({ ...pagination,total:count ,current:1,page:1 });
  },[ selectedRest,count ]);

  useEffect(()=>{
    renderData();
  },[ foodList,pagination.page,pagination.pageSize ]);

  /* 搜索菜名 */
  function handleSearch () {
    let data={
      id:selectedRest,
      page:1,
      limit:pagination.pageSize,
      keyword:searchInput
    }
    dispatch(getMenu(data));
    setFilterDropdownVisible(false);
  }

  /* 渲染餐馆名字option */
  function renderNameOptions (){
    return _.map(restNameList,(item)=>{
      return (
        <Option value={ item.id } key={ item.id }>{item.name}</Option>
      );
    });
  }
  /* 选定餐馆 */
  function onChange (value) {
    /* 清空菜名搜索框 */
    setsearchInput('');
    let data={
      id:value,
      page:1,
      limit:pagination.pageSize,
      keyword:''
    }
    dispatch(getMenu(data));
    setselectedRest(value);
  }

  /* 切换页面 */
  function changePage (value){
    console.log('page',value);
    setPagination({
      ...pagination,
      current:value.current,
      page: value.current,
      pageSize: value.pageSize
    });
    let data={
      id:selectedRest,
      page:value.current,
      limit:value.pageSize,
      keyword:searchInput
    }
    dispatch(getMenu(data));
  }

  /* 渲染表格数据 */
  function renderData (){
    let data = [];
    _.forEach(foodList,(item)=>{
      data.push({
        key:item._id,
        name:item.name['zh-CN'],
        price:`$${(item.price / 100).toFixed(2)}`,
        available:item.available
      });
    });
    setData(data);
  }
  /* 修改available状态 */
  function changeAvailable (record){
    let data = {
      id: record.key,
      data:{
        ..._.omit({ available:!record.available },'_id')
      }
    };
    let params={
      id:selectedRest,
      page:pagination.page,
      limit:pagination.pageSize,
      keyword:searchInput
    }
    dispatch(updateAvailable(data,params));
  }


  return (
    <div>
      <Select
        showSearch
        style={{ width : 200 }}
        placeholder="Select a restaurant"
        optionFilterProp="children"
        onChange={ onChange }
        filterOption={ (input, option) =>{
          if(option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0){
            return true;
          }
          else if(pinyinMatch.match(option.children,input )){
            return true;
          }
        }}
      >
        {renderNameOptions()}
      </Select>
      <Table columns={ columns }
        dataSource={ data }
        pagination={ pagination }
        onChange={ changePage }
      />
    </div>
  );

}

