import express from 'express';
import { 
    register, 
    login, 
    userLogOut, 
    refreshAccessToken, 
    updateAccount, 
    removeUserAccount,
    fetchUsers,
    fetchUser
 } from '../../services/authService/auth.service';
import { authToken } from '../../middleware/auth/auth.middleware';
import schemaValidator from '../../helper/schemaValidator';
const router = express.Router();
router.post(
    '/register',
    schemaValidator("/auth/register"),
    register
);
router.post('/login', 
    authToken,
    schemaValidator("/auth/login"),
    login
);
router.post('/logout', authToken, userLogOut)
router.post('/refresh-access-token', authToken, refreshAccessToken);
router.put('/update-user/:id', authToken, updateAccount);
router.delete('/remove-user/:id',authToken, removeUserAccount);
router.get('/fetch-users', authToken, fetchUsers);
router.get('/fetch-user/:id', authToken, fetchUser);
export default router;
