import {getStorage} from '../Common/utils'
import { useState } from 'react'

export default function useDisable(){
  let user=getStorage('user')
  const [isDisable]=useState(user!=='admin')
  return isDisable
}