import Post from "../module/Post.js";
import User from "../module/User.js";
import { error, success } from "../Utiles/responseWapper.js";
import cloudinaryPackage from "cloudinary";
import mapPostOutput from "../Utiles/Utlites.js";
const cloudinary = cloudinaryPackage.v2;

const userFollowAndUnfollowController = async (req, res) => {
  try {
    const { userIdtoFollow } = req.body;
    const curUserId = req._id;

    const userTofollow = await User.findById(userIdtoFollow);
    const curUser = await User.findById(curUserId);

    if (curUserId === userIdtoFollow) {
      return res.send(error(409, "User cannot follow themself"));
    }

    if (!userTofollow) {
      return res.send(error(404, "User not found"));
    }

    if (userTofollow.followers.includes(curUserId)) {
      const followerIndex = userTofollow.followers.indexOf(curUserId);
      userTofollow.followers.splice(followerIndex, 1);

      const followingIndex = curUser.followings.indexOf(userIdtoFollow);
      curUser.followings.splice(followingIndex, 1);
    } else {
      userTofollow.followers.push(curUserId);
      curUser.followings.push(userIdtoFollow);
    }
    await userTofollow.save();
    await curUser.save();

    return res.send(success(201, { user: userTofollow }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getFeedDashboardController = async (req, res) => {
  try {
    const curUserId = req._id;
    const curUser = await User.findById(curUserId).populate("followings");

    const fullposts = await Post.find({
      owner: {
        $in: curUser.followings,
      },
    }).populate("owner");
    const posts = fullposts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();
    const followingsId = curUser.followings.map((item) => item._id);
    followingsId.push(req._id);
    const suggestions = await User.find({
      _id: {
        $nin: followingsId,
      },
    });

    return res.send(success(201, { ...curUser._doc, suggestions, posts }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getMyPostController = async (req, res) => {
  try {
    const userId = req._id;

    const posts = await Post.find({
      owner: userId,
    }).populate("likes");

    return res.send(success(201, { posts }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getUserPostController = async (req, res) => {
  try {
    const { userIdToVisit } = req.body;

    const UserToVisit = await User.findById(userIdToVisit);

    if (!UserToVisit) {
      return res.send(error(404, "User not exist"));
    }

    const userPost = await Post.find({
      owner: UserToVisit,
    }).populate("likes");

    res.send(success(201, { userPost }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const deleteMyAccountController = async (req, res) => {
  try {
    const MyAccountId = req._id;
    const MyAccount = await User.findById(MyAccountId);

    // deleting my post
    await Post.deleteMany({
      owner: MyAccountId,
    });

    // deleting my followers and myself form another followings
    MyAccount.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);
      const index = follower.followings.indexOf(MyAccountId);
      follower.followings.splice(index, 1);
      await follower.save();
    });
    // deleting my followings and myself form another follower
    MyAccount.followings.forEach(async (followingId) => {
      const following = await User.findById(followingId);
      const index = following.followers.indexOf(MyAccountId);
      following.followers.splice(index, 1);
      await following.save();

      // deleting my likes from other accounts posts
      const allPost = await Post.find();
      allPost.forEach(async (post) => {
        const index = post.likes.indexOf(MyAccountId);
        post.likes.splice(index, 1);
        await post.save();
      });

      // delete user
      await MyAccount.deleteOne();

      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
      });

      return res.send(success(201, "Accounted deleted successfully"));
    });
  } catch (e) {
    res.send(error(500, e.message));
  }
};
const getMyInfoController = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    return res.send(success(201, { user }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const updateMyProfileController = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;
    const user = await User.findById(req._id);

    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      const cloudinaryImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      user.avatar = {
        url: cloudinaryImg.secure_url,
        publicId: cloudinaryImg.public_id,
      };
    }
    await user.save();
    res.send(success(201, { user }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });
    const fullPost = user.posts;
    const posts = fullPost
      .map((items) => mapPostOutput(items, req._id))
      .reverse();

    res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

export default {
  userFollowAndUnfollowController,
  getFeedDashboardController,
  getMyPostController,
  getUserPostController,
  deleteMyAccountController,
  getMyInfoController,
  updateMyProfileController,
  getUserProfileController,
};
