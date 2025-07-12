import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";

import { axiosClient } from "../../Utlits/axiosClient.jsx";
import {
  KEY_ACCESS_TOKEN,
  setItem,
} from "../../Utlits/localStorageManager.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosClient.post(
        "/auth/login",
        {
          email,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Login">
      <div className="Login-Box">
        <h2 className="header">LogIn</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>

          <input type="submit" className="submit" />
        </form>
        <p className="subheading">
          Do not have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
