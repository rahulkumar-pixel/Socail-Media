import React from 'react'
import userImg from '../../Assets/user.png'
import './Avatar.scss'

function Avatar({src}) {
  return (
    <div>
      <div className="avatar hover-link">
        <img src={src ? src : userImg} alt="User img" />
      </div>
    </div>
  )
}

export default Avatar