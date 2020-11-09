import request from '../Common/request';
import { host } from '../Common/config';

export async function tags (){
  let result = await request({
    'url':`${host}/tags`,
    'method':'get'
  });
  return result;
}