import request from '../Common/request';
import { host } from '../Common/config';

export async function menu (data){
  let result = await request({
    'url':`${host}/food?restaurantId=${data.id}&page=${data.page}&limit=${data.limit}&keyword=${data.keyword}`,
    'method':'get'
  });
  return result;
}

export async function available (data){
  let result = await request({
    'url':`${host}/food`,
    'method':'post',
    data
  });
  return result;
}
