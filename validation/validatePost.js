function validatePost(req, res, next) {
  let post = req.body;
  if(!post) res.status(400).json({ message: "missing post data" });
  else if(!post.text) res.status(400).json({ message: "missing required text field" });
  else next();
}

module.exports = validatePost;