import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar.jsx";
import "./Follower.scss";
import { useDispatch, useSelector } from "react-redux";
import { followUnfollowUser } from "../Redux/Slices/feedSlice.jsx";
import { useNavigate } from "react-router-dom";

function Follower({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myFeed = useSelector((state) => state.feed.myFeed);
  const [isIfollowing, setisIfollowing] = useState();
  useEffect(() => {
    setisIfollowing(
      myFeed?.followings?.find((followings) => followings._id === user._id)
    );
  }, [myFeed]);

  function handleFollow() {
    dispatch(
      followUnfollowUser({
        userIdtoFollow: user._id,
      })
    );
  }

  return (
    <div className="follower">
      <div
        className="user-info"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        <Avatar src={user?.avatar?.url} />
        <h4 className="name">{user?.name}</h4>
      </div>
      <h5
        onClick={handleFollow}
        className={isIfollowing ? "hover-link follow-link" : "btn-primary"}
      >
        {isIfollowing ? "Unfollow" : "Follow"}
      </h5>
    </div>
  );
}

export default Follower;
