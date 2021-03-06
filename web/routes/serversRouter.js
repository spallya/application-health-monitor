const router = require(`express`).Router();
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);
import {
  security as securityObject
} from '../../config';
import { Server as ServerModel } from '../models';

router.post(`/add`, (req, res, next) => {
    let newServer = new ServerModel({
        name:  req.body.name,
        description:  req.body.description,
        url: req.body.url,
        createdUserId: req.body.currentUserId,
        modifiedUserId: req.body.currentUserId
    });
    ServerModel.addServer(newServer).then((response)=>{
      res.json(response);
    });
});

router.get(`/serverObjects`, passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;
