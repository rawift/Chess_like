const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login Instead" });
  }


  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login Instead" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(201).json({ user: user });
};











const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup Please" });
  }
  const email=existingUser.email

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup Please" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Inavlid Email / Password" });
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  /*if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }*/

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 3600), 
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Successfully Logged In", user: existingUser, token });
};



function getStringAfterLastEqual(str) {
  const lastEqualIndex = str.lastIndexOf('=');
  if (lastEqualIndex !== -1) {
      return str.substring(lastEqualIndex + 1);
  } else {
      return null; // Return null if '=' is not found
  }
}



/*const verifyToken = (req, res, next) => {
  console.log("verify token",req.headers.cookie)
  if(!req.headers.cookie) return res.status(404).json({ message: "No token found" });
  const cookies = req.headers.cookie;
  let token = cookies.split("=")[1];
  console.log("token",token)
  token=getStringAfterLastEqual(cookies);
  console.log("token",token)
  if (!token) {
    res.status(404).json({ message: "No token found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid TOken" });
    }
    console.log(user.id);
    req.id = user.id;
  });
  next();
};
*/
/*
const verifyToken = async (req, res, next) => {
  try {
    console.log("verify token",req.headers.cookie)
  if(!req.headers.cookie) return res.status(404).json({ message: "No token found" });
  const cookies = req.headers.cookie;
  let token = cookies.split("=")[1];
  console.log("token",token)
  token=getStringAfterLastEqual(cookies);
  console.log("token",token)
  if (!token) {
    res.status(404).json({ message: "No token found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid TOken" });
    }
    console.log(user.id);
    req.id = user.id;
  });
  next();
  } catch (error) {
    console.log(error)
  }
};
*/




const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      return res.status(404).json({ message: "No token found" });
    }

    const cookies = req.headers.cookie;
    const token = getStringAfterLastEqual(cookies);

    if (!token) {
      return res.status(404).json({ message: "No token found" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      }

      req.id = user.id;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};






const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ messsage: "User Not FOund" });
  }
  return res.status(200).json({ user });
};















const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken = cookies.split("=")[1];
  prevToken=getStringAfterLastEqual(cookies);
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "35s",
    });
    console.log("Regenerated Token\n", token);

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 30 seconds
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};







const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  let prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }


    res.clearCookie(`${user.id}`);
 
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};













exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
