import request from '../Common/request';
import { host } from '../Common/config';

export async function order (start,end){
  let result = await request({
    'url':`${host}/order?start=${start}&end=${end}`,
    'method':'get'
  });
  return result;
}
