import React, { useEffect } from "react";
import "./Post.scss";
import Avatar from "../Avatar/Avatar.jsx";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  getUserProfile,
  likeORUnlikePost,
} from "../Redux/Slices/postsSlice.jsx";
import { useNavigate } from "react-router-dom";
import { showToast } from "../Redux/Slices/appConfigSlice.jsx";
import { TOAST_SUCCESS } from "../../App.jsx";

function Post({ post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleLikeOrUnlile() {
    dispatch(
      likeORUnlikePost({
        postId: post?._id,
      })
    );
    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: "like or unLike",
      })
    );
  }
  return (
    <div className="post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post?.owner?._id}`)}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{post?.owner?.name}</h4>
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="backGround-img" />
      </div>
      <div className="footer">
        <div className="like" onClick={handleLikeOrUnlile}>
          {post?.isLiked ? (
            <FaHeart className="icon" style={{ color: "red" }} />
          ) : (
            <FaRegHeart className="icon" />
          )}
          <h4>{`${post?.likesCount} likes`}</h4>
        </div>
        <p className="caption">{post?.caption}</p>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>
    </div>
  );
}

export default Post;
