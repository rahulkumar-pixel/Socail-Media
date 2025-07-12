import React from "react";
import { getItem, KEY_ACCESS_TOKEN } from "../Utlits/localStorageManager";
import { Navigate, Outlet } from "react-router-dom";

function RequireUser() {
  const user = getItem(KEY_ACCESS_TOKEN);
  return (user ? <Outlet /> : <Navigate to="/login" />);
}

export default RequireUser;
