const express = require('express');
const router = express.Router();
const validateUserId = require('../validation/validateUserId');
const validateUser = require('../validation/validateUser');
const db = require('../users/userDb');
const dbPosts = require('../posts/postDb');

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

router.get('/:id/posts', (req, res) => {
  let id = req.params.id;
  db.getUserPosts(id)
    .then(r => {
      console.log(r);
      if(r) res.status(200).json(r);
      else res.status(404).json({ error: 'No posts were found for user' });
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ errorMessage: 'Could not search for posts' });
    });
});

router.post('/:id/posts', (req, res) => {
  let id = req.params.id;
  let post = req.body;
  if(!post) res.status(400).json({ error: 'You must send a post to add' });
  else if(!post.text) res.status(400).json({ error: 'You must add a text property to the request' });
  else {
    post.user_id = id;
    dbPosts.insert(post)
      .then(r => {
        console.log(r);
        res.status(201).json({ message: 'Post was created successfully', id: r.id });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ message: 'Failed to fulfill request' });
      });
  }
});


module.exports = router;