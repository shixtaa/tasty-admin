import { useState, useEffect } from 'react'
import {getStorage} from '../Common/utils'

export default function useDisable(){
  const user =getStorage('user')
  const [isDisable,setIsDisable]=useState(user!=='admin')
  useEffect(()=>{
    setIsDisable(user!=='admin')
  },[user])
  return isDisable
}