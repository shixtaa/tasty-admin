import request from '../Common/request';
import { host } from '../Common/config';

export async function menu (id,page,limit,keyword){
  let result = await request({
    'url':`${host}/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`,
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
