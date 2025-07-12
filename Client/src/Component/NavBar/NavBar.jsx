import React, { useRef, useState } from "react";
import "./NavBar.scss";
import Avatar from "../Avatar/Avatar.jsx";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useSelector } from "react-redux";

import {
  removeItem,
  KEY_ACCESS_TOKEN,
} from "../../Utlits/localStorageManager.jsx";
import { axiosClient } from "../../Utlits/axiosClient.jsx";

function NavBar() {
  const navigate = useNavigate();

  const myProfile = useSelector((state) => state.appConfig.myProfile);

  async function handleLogout() {
    await axiosClient.get("/auth/logout");
    removeItem(KEY_ACCESS_TOKEN);
    navigate("/login");
  }

  return (
    <div className="navBar">
      <div className="contanier">
        <h2 className="banner hover-link" onClick={() => navigate("/")}>
          turnOn
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => navigate(`/profile/${myProfile?._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="log-out hover-link" onClick={handleLogout}>
            <AiOutlineLogout />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
