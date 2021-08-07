let express = require('express');
let router = express.Router();
let commonHelper = require('./../tools/common_helpers');
let response = require('../tools/response_helper');

//IMPORTING MODELS
let userModel = require('../models/users.model');

router.post('/create', (req, res) => {
  const { name, email, phone, password } = req.body;
  let type = 'general';
  userModel.findOne({ $or: [{ email: email }, { phone: phone }], type: type }).then((user) => {
    if (user != null) {
      return response.success('User already registered!', 0, res);
    } else {
      commonHelper.encryptPassword(password).then((encpassword) => {
        let newUser = new userModel({
          name: name,
          email: email,
          phone: phone,
          password: encpassword,
          type: type
        });
        newUser.save().then((saved) => {
          return response.success('User saved successfully!', 1, res);
        }).catch((err) => {
          return response.internalError(err, res);
        });
      }).catch((err) => {
        return response.internalError(err, res);
      })
    }
  }).catch((err) => {
    return response.internalError(err, res);
  });
});

router.post('/createHr', (req, res) => {
  const { name, email, phone, password } = req.body;
  let type = 'hr';
  userModel.findOne({ $or: [{ email: email }, { phone: phone }], type: type }).then((user) => {
    if (user != null) {
      return response.success('HR user already registered!', 0, res);
    } else {
      commonHelper.encryptPassword(password).then((encpassword) => {
        let newUser = new userModel({
          name: name,
          email: email,
          phone: phone,
          password: encpassword,
          type: type
        });
        newUser.save().then((saved) => {
          return response.success('HR user saved successfully!', 1, res);
        }).catch((err) => {
          return response.internalError(err, res);
        });
      }).catch((err) => {
        return response.internalError(err, res);
      })
    }
  }).catch((err) => {
    return response.internalError(err, res);
  });
});

router.post('/login', (req, res) => {
  const { username, password, type } = req.body;
  userModel.find({ type: type, $or: [{ email: username }, { phone: username }] }).select('-createdAt -updatedAt').lean().then((users) => {
    if (users.length == 1) {
      if (users[0].status == 'active') {
        commonHelper.decryptPassword(users[0].password).then((plain) => {
          if (plain == password) {
            let accessToken = commonHelper.generateAccessToken({ userId: users[0]._id});
            delete users[0]._id;
            delete users[0].password;
            delete users[0].status;
            users[0].accessToken = accessToken;
            return response.success('Login successfully!', users[0], res);
          } else {
            return response.success('Invalid email|phone or password!', 0, res);
          }
        }).catch((err) => {
          return response.internalError(err, res);
        });
      } else {
        return response.success('Your account is deactived!', 0, res);
      }
    } else {
      return response.success('Invalid email|phone or password!', 0, res);
    }
  }).catch((err) => {
    return response.internalError(err, res);
  });
});

module.exports = router;
