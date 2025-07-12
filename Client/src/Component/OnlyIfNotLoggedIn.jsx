import React from 'react'
import { getItem, KEY_ACCESS_TOKEN } from '../Utlits/localStorageManager'
import { Navigate, Outlet } from 'react-router-dom'

function OnlyIfNotLoggedIn() {
    const user = getItem(KEY_ACCESS_TOKEN)
  return (
    user ? <Navigate to="/"/> : <Outlet/>
  )
}

export default OnlyIfNotLoggedIn