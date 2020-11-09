import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/* antd */
import { Select,Table,Switch ,Input,Space,Button } from 'antd';
const { Option } = Select;
import { SearchOutlined } from '@ant-design/icons';

/* 库 */
import _  from 'lodash';
import pinyinMatch from 'pinyin-match';

/* actions */
import { getMenu ,getRestaurantName,clearData ,updateAvailable } from './state/reducer';

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
  const [ filterDropdownVisible,setFilterDropdownVisible ] = useState(false); // 筛选项下拉
  // const searchInput = useRef();
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
          record.available ?
            <Switch onChange={ ()=>{changeAvailable(record);} } defaultChecked/> :
            <Switch onChange={ ()=>{changeAvailable(record);} } checked={ record.available } />
        );
      },
      width: '30%',
    },
  ];
  /* 渲染餐馆名称 */
  useEffect(async ()=>{
    setselectedRest('');
    await dispatch(clearData());
    await dispatch(getRestaurantName());
  },[]);

  useEffect(()=>{
    setPagination({ ...pagination,total:count ,current:1,page:1 });
    renderData();
  },[ selectedRest,count ]);

  /* 搜索菜名 */
  async function handleSearch () {
    console.log('search');
    await dispatch(getMenu(selectedRest,1,pagination.pageSize,searchInput));
    setFilterDropdownVisible(false);
    setsearchInput('');
  }

  /* 渲染餐馆名字 */
  function renderNameOptions (){
    return _.map(restNameList,(item)=>{
      return (
        <Option value={ JSON.stringify(item) } key={ item.id }>{item.name}</Option>
      );
    });
  }
  /* 选定餐馆 */
  async function onChange (value) {
    setsearchInput('');
    let info = JSON.parse(value);
    await dispatch(getMenu(info.id,1,pagination.pageSize,''));
    setPagination({ ...pagination,current:1, page:1,total:count });
    setselectedRest(info.id);
  }

  /* 切换页面 */
  async function changePage (value){
    console.log(value);
    await dispatch(getMenu(selectedRest,value.current,value.pageSize,searchInput));
    setPagination({
      ...pagination,
      current:value.current,
      page: value.current,
      pageSize: value.pageSize
    });
    renderData();
  }

  /* 渲染表格数据 */
  function renderData (){
    let data = [];
    _.map(foodList,(item)=>{
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
  async function changeAvailable (record){
    console.log(record);
    let data = {
      id: record.key,
      data:{
        ..._.omit({ available:!record.available },'_id')
      }
    };
    await dispatch(updateAvailable(data));
    renderData();
  }
  useEffect(()=>{
    renderData();
  },[ pagination.page,pagination.pageSize ]);

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
        }
        }
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

