import Post from "../module/Post.js";
import User from "../module/User.js";
import { success, error } from "../Utiles/responseWapper.js";
import cloudinaryPackage from "cloudinary";
import mapPostOutput from "../Utiles/Utlites.js";
const cloudinary = cloudinaryPackage.v2;

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;
    const owner = req._id;

    if (!caption || !postImg) {
      return res.send(error(404, "Both Caption and Image is required."));
    }

    const cloudinaryImg = await cloudinary.uploader.upload(postImg, {
      folder: "postPhoto",
    });

    const user = await User.findById(req._id);
    const post = await Post.create({
      owner,
      caption,
      image: {
        publicID: cloudinaryImg.public_id,
        url: cloudinaryImg.url,
      },
    });

    user.posts.push(post._id);
    await user.save();
    return res.send(success(201, { post }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const likeAndUnlikeController = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUser = req._id;

    const post = await Post.findById(postId).populate("owner");
    if (!post) {
      return res(error(500, "post is unavailible"));
    }
    if (post.likes.includes(curUser)) {
      const index = post.likes.indexOf(curUser);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(curUser);
    }
    await post.save();
    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);

    if (!post) {
      res.send(success(404, "User post not found"));
    }
    if (post.owner.toString() !== curUserId) {
      return res.send(error(404, "Only User can Change his Caption"));
    }
    if (caption) {
      post.caption = caption;
    }
    await post.save();
    return res.send(success(201, { post }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);
    const curUser = await User.findById(curUserId);

    if (!post) {
      res.send(success(404, "User post not found"));
    }
    if (post.owner.toString() !== curUserId) {
      return res.send(error(404, "Only User can delete his Caption"));
    }

    const index = curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);

    await curUser.save();
    await post.deleteOne();

    return res.send(success(201, "Post delete successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

export default {
  deletePostController,
  createPostController,
  likeAndUnlikeController,
  updatePostController,
};
