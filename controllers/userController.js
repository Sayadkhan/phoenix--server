const userModel = require("../models/userMode;");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// generate token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });

    if (exist) {
      return res.status(400).json("email already exist");
    }

    if (!name || !email || !password) {
      return res.status(400).json("all fields are required");
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid email.");
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("password must be strong");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // creat an user
    const user = await userModel.create({ name, email, password: hash });

    // creat a tokan
    const tokan = createToken(user._id);

    res
      .status(200)
      .json({ _id: user._id, name, email, password: user.password, tokan });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { registerUser };
