import React, { useState } from "react";
import Avatar from "../Avatar/Avatar.jsx";
import "./CreatePost.scss";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../Utlits/axiosClient.jsx";
import { getUserProfile } from "../Redux/Slices/postsSlice.jsx";

function CreatePost() {
  const [postImg, setPostImg] = useState();
  const [caption, setCaption] = useState();
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfig.myProfile);

  function handleImgChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  }

  const handlePostSubmit = async () => {
    try {
      const result = await axiosClient.post("/post", {
        caption,
        postImg,
      });
      dispatch(
        getUserProfile({
          userId: myProfile?._id,
        })
      );
    } catch (error) {
      console.log("what the error", error);
    } finally {
      setCaption("");
      setPostImg("");
    }
  };

  return (
    <div className="create-post">
      <div className="leftpart">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="rightpart">
        <div className="post-caption">
          <input
            value={caption || ""}
            type="text"
            className="input-caption"
            placeholder="What's on your mind?"
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
        </div>
        {postImg && (
          <div className="img-contanier">
            <img src={postImg} alt="post-img" />
          </div>
        )}
        <div className="bottompart">
          <div className="input-post-img">
            <label htmlFor="inputimg" className="labelimg">
              <MdAddPhotoAlternate />
            </label>
            <input
              type="file"
              accept="image/*"
              id="inputimg"
              className="inputimg"
              onChange={handleImgChange}
            />
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreatePost;
