import React, { useEffect } from 'react'


import { Outlet } from 'react-router-dom'
import NavBar from '../../Component/NavBar/NavBar.jsx'
import { useDispatch } from 'react-redux'
import { getmyinfo } from '../../Component/Redux/Slices/appConfigSlice.jsx'


function Home() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getmyinfo())
  }, [])

  return (
    <>
    <NavBar/>
    <div className="outlet" style={{marginTop:'60px'}}>
         <Outlet/>
    </div>
   
    </>
  )
}

export default Home