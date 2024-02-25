import express from 'express';
const router = express.Router();

import roleRoute from './role.route';
import userRoute from './user.route';
import groceryRoute from './grocery.route';
import orderRoute from './order.route';

import { login } from '../controller/auth.controller';
import { authenticateToken } from '../middleware/authenticate';
import check_permission from '../middleware/check_permission';

// authentication
router.post('/authentication', login);

router.use('/role', authenticateToken, check_permission, roleRoute);
router.use('/user', authenticateToken, check_permission, userRoute);
router.use('/grocery', authenticateToken, check_permission, groceryRoute);
router.use('/order', authenticateToken, check_permission, orderRoute);


export = router;