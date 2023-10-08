const express = require('express');
const { signupUser, logininUser, logoutUser, followunfollowUser, updateUser, profileUser } = require('../controllers/userControllers');
const protectRoute = require('../middlewares/protectRoutes');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', logininUser);
router.post('/logout', logoutUser);
router.post('/update/:id', protectRoute, updateUser);
router.get('/profile/:username', profileUser)
router.post('/follow/:id', protectRoute, followunfollowUser);

module.exports = router;