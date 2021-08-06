import {combineReducers} from 'redux'

import pengadaan from './pengadaan'
import auth from './auth'
import depo from './depo'
import user from './user'
import asset from './asset'
import approve from './approve'
import email from './email'
import setuju from './setuju'
import dokumen from './dokumen'
import disposal from './disposal'
import stock from './stock'

export default combineReducers({
  pengadaan,
  auth,
  depo,
  user,
  asset,
  email,
  dokumen,
  disposal,
  approve,
  setuju,
  stock
})