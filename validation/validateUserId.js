const userDb = require('../users/userDb');

function validateUserId(req, res, next) {
  let id = req.params.id;
  userDb.getById(id)
    .then(r => {
      if(r) {
        console.log('User: ', r);
        req.user = r;
        next();
      }
      else res.status(400).json({ message: "invalid user id" });
    });
}

module.exports = validateUserId;