import React, { useEffect, useState } from "react";
import Post from "../Post/Post.jsx";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../CreatePost/CreatePost.jsx";
import { getUserProfile } from "../Redux/Slices/postsSlice.jsx";
import { followUnfollowUser } from "../Redux/Slices/feedSlice.jsx";
import DummyuserImg from "../../Assets/user.png";

function Profile() {
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.posts.userProfile);
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const myFeed = useSelector((state) => state.feed.myFeed);
  const dispatch = useDispatch();
  const params = useParams();
  const [isMyProfile, setisMYProfile] = useState(false);
  const [isFollowings, setisFollowing] = useState(false);

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    setisMYProfile(myProfile?._id === params.userId);
    setisFollowing(
      myFeed?.followings?.find((items) => items._id == params.userId)
    );
  }, [myProfile, params.userId, myFeed]);

  const userImg = userProfile?.avatar?.url;
  function handleFollow() {
    dispatch(
      followUnfollowUser({
        userIdtoFollow: params.userId,
      })
    );
  }

  return (
    <div className="Profile">
      <div className="contanier">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((post) => (
            <Post key={post?._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="user-img"
              src={userImg ? userImg : DummyuserImg}
              alt="user-img"
            />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p className="bio">{userProfile?.bio}</p>
            <div className="follow-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Followings`}</h4>
            </div>
            {!isMyProfile && (
              <h5
                style={{ marginTop: "10px" }}
                className={isFollowings ? "btn-secondry" : "follow btn-primary"}
                onClick={handleFollow}
              >
                {isFollowings ? "Unfollow" : "Follow"}
              </h5>
            )}
            {isMyProfile && (
              <button
                className="update-profile btn-secondry "
                onClick={() => {
                  navigate("/updateprofile");
                }}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
