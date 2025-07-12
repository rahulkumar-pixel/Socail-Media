import { Router } from 'express';
const router = Router();
import userController from '../controller/userController.js';
import requireUser from '../middleWare/requireUser.js';

router.post('/follow',requireUser, userController.userFollowAndUnfollowController)
router.get('/getfeeddashboard',requireUser, userController.getFeedDashboardController)
router.get('/mypost',requireUser, userController.getMyPostController)
router.post('/userpost',requireUser, userController.getUserPostController)
router.delete('/',requireUser, userController.deleteMyAccountController)
router.get('/getmyinfo', requireUser, userController.getMyInfoController)
router.put('/', requireUser, userController.updateMyProfileController)
router.post('/getuserprofile', requireUser, userController.getUserProfileController)

export default router;