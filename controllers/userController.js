const userModel = require("../models/userMode;");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");

// generate token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
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

// loginuser
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("Inalid email or password.");
    }
    // comparing password

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      return res.status(400).json("incorrect password");
    }
    // creat token
    const token = createToken(user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      password: user.password,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// find an user
const findUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json("invalide id");
  }
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// get all user
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { registerUser, loginUser, findUser, getAllUsers };
