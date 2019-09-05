function validateUser(req, res, next) {
  if(req.method !== 'POST') next();
  let user = req.body;
  if(!user) res.status(400).json({ message: "missing user data" });
  else if(!user.name) res.status(400).json({ message: "missing required name field" });
  else next();
}

module.exports = validateUser;