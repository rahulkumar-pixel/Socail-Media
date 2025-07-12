import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../Redux/Slices/appConfigSlice";
import { axiosClient } from "../../Utlits/axiosClient";
import DummyuserImg from "../../Assets/user.png";
import { KEY_ACCESS_TOKEN, removeItem } from "../../Utlits/localStorageManager";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url);
  }, [myProfile]);

  function handleimgChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    // encding into base64
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    );
  }
  async function handleDelete() {
    await axiosClient.delete("/user");
    removeItem(KEY_ACCESS_TOKEN);
    navigate("/login");
  }
  return (
    <>
      <div className="UpdateProfile">
        <div className="contanier">
          <div className="left-part">
            <div className="user-input-img">
              <label htmlFor="inputimg" className="labelimg">
                <img src={userImg ? userImg : DummyuserImg} alt={name} />
              </label>
              <input
                type="file"
                accept="image/*"
                className="inputimg"
                id="inputimg"
                onChange={handleimgChange}
              />
            </div>
          </div>
          <div className="right-part">
            <form onSubmit={handleSubmit}>
              <input
                value={name}
                type="text"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                value={bio}
                type="text"
                placeholder="Your Bio"
                onChange={(e) => setBio(e.target.value)}
              />
              <input
                type="submit"
                className="btn-primary"
                onChange={handleSubmit}
              />
            </form>
            <button
              className="delete-account btn-primary"
              type="submit"
              onClick={handleDelete}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
