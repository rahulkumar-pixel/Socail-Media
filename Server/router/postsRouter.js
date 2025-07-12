import { Router } from 'express';
const router = Router();
import postController from '../controller/postsController.js';
import requireUser from '../middleWare/requireUser.js';



router.post('/',requireUser, postController.createPostController)
router.post('/likes',requireUser, postController.likeAndUnlikeController)
router.put('/',requireUser, postController.updatePostController)
router.delete('/',requireUser, postController.deletePostController)

export default router;