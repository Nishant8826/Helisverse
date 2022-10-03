const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../model/user");
const validator = require("../utils/validation");

const createUser = async (req, res) => {
  try {
    const data = req.body;
    //------------------Validtions--------------------------------
    //destructuring
    let { firstName, lastName, phone, email, password } = data;

    //firstName
    if (!/^[a-zA-Z]+$/.test(firstName) || !validator.isValid(firstName))
      return res.status(400).send({ status: false, msg: "Invalid firstName" });

    //lastName
    if (!/^[a-zA-Z]+$/.test(lastName) || !validator.isValid(lastName))
      return res.status(400).send({ status: false, msg: "Invalid lastName" });

    //phone
    if (String(phone).length != 10)
      return res
        .status(400)
        .send({ status: false, msg: "phone length must be 10 Numbers" });
    if (!/^[6789][0-9]{9}$/.test(phone))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid indian phone number" });

    //email
    if (!validator.isValid(email) || validator.isValidEmail(email))
      return res.status(400).send({ status: false, msg: "Invalid email" });

    //password
    if (!validator.isValid(password))
      return res.status(400).send({ status: false, msg: "Invalid password" });
    if (password.length <= 8 || password.length >= 15)
      return res
        .status(400)
        .send({ status: false, msg: "Password length must be between 8-15" });
    //DB call for phone duplicacy
    const findPhone = await userModel.findOne({ phone });
    if (findPhone)
      return res
        .status(400)
        .send({ status: false, msg: `${phone} is already registered` });
    //DB call for email duplicacy
    const findEmail = await userModel.findOne({ email });
    if (findEmail)
      return res
        .status(400)
        .send({ status: false, msg: `${email} is already registered` });

    //hasing password for more advanced security (bcrypt library)
    const round = 10;
    const genSalt = await bcrypt.genSalt(round);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    data.password = hashedPassword;

    const saveData = await userModel.create(data);
    return res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    //----------------Validation---------------------
    const { email, password } = data;

    //email
    if (!validator.isValid(email) || validator.isValidEmail(email))
      return res.status(400).send({ status: false, msg: "Invalid email" });

    const findEmail = await userModel.findOne({ email });
    if (!findEmail || findEmail.email != email)
      return res.status(404).send({ status: false, msg: "User not found" });
    //password
    if (!validator.isValid(password))
      return res.status(400).send({ status: false, msg: "Invalid password" });
    //comparing password with bcrypt library
    const comparing = await bcrypt.compare(password, findEmail.password);
    if (!comparing)
      return res.status(400).send({ status: false, msg: "Incorrect password" });

    //generating token with jwt library
    const jwtToken = await jwt.sign(
      {
        userId: findEmail._id.toString(),
      },
      "Heliverse Backend Assignment",
      { expiresIn: "24h" }
    );
    res.setHeader("x-api-key", jwtToken);
    return res.status(200).send({ status: true, msg: "Login Successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createUser, login };
