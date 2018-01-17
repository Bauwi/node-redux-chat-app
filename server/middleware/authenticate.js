const { User } = require("./../models/user");

const authenticate = (req, res, next) => {
  const token = req.header("x-auth");
  console.log("token: ", token);

  User.findByToken(token)
    .then(user => {
      if (!user) {
        console.log("User not found.", user);
        return Promise.reject();
      }
      console.log("user", user);
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      console.log("Something went wrong in authenticate middleware");
      res.status(401).send();
    });
};

module.exports = { authenticate };
