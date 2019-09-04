const express = require('express');
const router = express.Router();
const validateUserId = require('../validation/validateUserId');
const validateUser = require('../validation/validateUser');
const db = require('../users/userDb');

router.route('/')
  .post(validateUser, (req, res) => {
    // our validateUser middleware checks it for us already
    db.insert(req.body)
      .then(r => {
        console.log(r);
        res.status(201).json({ message: 'User successfully created' });
      })
      .catch(e => {
        console.error(e, e.response);
        res.status(500).json({ errorMessage: 'There was a problem creating the user' });
      });
  });

router.use('/:id', validateUserId);

router.route('/:id')
  .get((req, res) => {
    // our middleware should have set our found user to req.user
    if(req.user) res.status(200).json(req.user);
    else res.status(500).json({ errorMessage: 'There was an error retrieving the user' });
  })
  .put((req, res) => {
    // same here
    console.log(req.user);
    let user = req.body;
    if(!user) res.status(400).json({ error: 'You must provide user information to update with' });
    else if(!user.name) res.status(400).json({ error: 'You must provide a user name to update' });
    else if(!req.user) res.status(500).json({ errorMessage: 'There was an error finding the user' });
    else db.update(req.params.id, user)
      .then(r => {
        console.log(r);
        res.status(200).json({ message: 'User updated successfully' });
      })
      .catch(e => {
        console.log(e);
        res.status(500).json({ errorMessage: 'Failed to update user' });
      });
  })
  .delete((req, res) => {
    // already verified user
    db.remove(req.params.id)
      .then(r => {
        console.log(r);
        res.status(200).json({ message: 'User successfully deleted' });
      })
      .catch(e => {
        console.error(e, e.response);
        res.status(500).json({ message: 'Could not delete user' });
      });
  });


module.exports = router;