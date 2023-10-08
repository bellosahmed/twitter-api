const express = require('express');
const { signupUser, logininUser, logoutUser, followunfollowUser, updateUser } = require('../controllers/userControllers');
const protectRoute = require('../middlewares/protectRoutes');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', logininUser);
router.post('/logout', logoutUser);
router.post('/update', protectRoute, updateUser);
router.post('/follow/:id', protectRoute, followunfollowUser);

module.exports = router;