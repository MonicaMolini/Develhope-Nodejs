import passport from "passport";

const authorize = (res, req, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      res.status(401).json({ msg: "Unathorized" });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

export default authorize;