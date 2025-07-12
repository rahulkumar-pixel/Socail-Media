import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./SignUp.scss";
import { axiosClient } from "../../Utlits/axiosClient.jsx";
import { KEY_ACCESS_TOKEN, setItem } from "../../Utlits/localStorageManager.jsx";


function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const nagivate = useNavigate()
     await axiosClient.post(
      "/auth/signUp",
      {
        name,
        email,
        password,
      });
      setItem(KEY_ACCESS_TOKEN, Response.accessToken)
      nagivate('/')
  }

  return (
    <div className="Signup">
      <div className="Signup-Box">
        <h2 className="header">SignUp</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="name"
            onChange={(e) => setName(e.target.value)}
          ></input>

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

          <input type="submit" className="submit"/>
        </form>
        <p className="subheading">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
