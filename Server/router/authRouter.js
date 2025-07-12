import { Router } from 'express';
const router = Router();
import authController from '../controller/authController.js';

router.post('/login', authController.loginController)
router.post('/signUp', authController.SignUpController)
router.post('/refresh', authController.GeneratingRefreshTokenController)
router.get('/logout', authController.logOutController)

export default router;