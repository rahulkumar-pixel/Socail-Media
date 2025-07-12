import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../Post/Post.jsx";
import Follower from "../Follower/Follower.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUserFeed } from "../Redux/Slices/feedSlice.jsx";

function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feed.myFeed);

  useEffect(() => {
    dispatch(getUserFeed());
  }, [dispatch]);
  return (
    <div className="feed">
      <div className="contanier">
        <div className="left-part">
          {feedData?.posts?.map((post) => (
            <Post key={post?._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="following">
            <h3 className="title">You are following</h3>
            {feedData?.followings?.map((user) => (
              <Follower key={user?._id} user={user} />
            ))}
          </div>
          <div className="suggestion">
            <h3 className="title">Suggested to you</h3>
            {feedData?.suggestions?.map((user) => (
              <Follower key={user?._id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
