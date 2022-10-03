const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const reqToken = req.headers["x-auth-key"];
    jwt.verify(reqToken, "Heliverse Backend Assignment", (err, decode) => {
      if (err) {
        return res.status(400).send({ status: false, msg: err.message });
      } else {
        res.token = decode;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({status:false,msg:error.message})
  }
};

module.exports = { authentication };
