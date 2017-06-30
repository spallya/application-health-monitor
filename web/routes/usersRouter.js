const router = require(`express`).Router();
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);
import {
  security as securityObject
} from '../../config';
const UserIndex = require(`../models/user`);

// Register
router.post(`/register`, (req, res, next) => {
    let newUser = new UserIndex.UserSchema({
        name:  req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    UserIndex.helpers.addUser(newUser).then((response)=>{
      res.json(response);
    });
});

// Authenticate
router.post(`/authenticate`, (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    UserIndex.helpers.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: `User not found`});
        } else {
            UserIndex.helpers.comparePassword(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    const token = jwt.sign(user, securityObject.keys.jwt, {
                        expiresIn: 604880 // 1 week secs
                    });
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                } else {
                    res.json({success: false, msg: `Password incorrect`});
                }
            });
        }
    });
});

// Profile
router.get(`/profile`, passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;
