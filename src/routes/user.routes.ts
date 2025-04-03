import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import verifyAuth from '../middleware/client-auth.middleware';

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/client',verifyAuth, userController.getClientUsers);

export default router;
