//external imports
//external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

//get login page
function getLogin(req, res, next) {
  res.send("This is login page");
}

//do login
async function login(req, res, next) {
  try {
    //find a user who has this email/username
    const user = await User.findOne({
      $or: [
        {
          email: req.body.username,
        },
        {
          mobile: req.body.username,
        },
      ],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        //prepare the user object to generate token
        const userObject = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: "user",
        };

        //generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        //set cookie
        // res.cookie(process.env.COOKIE_NAME, token, {
        //   maxAge: process.env.JWT_EXPIRY,
        //   httpOnly: true,
        //   signed: true,
        // });

        //set logged in user local identifier
        // res.locals.loggedInUser = userObject;
        // console.log(res.local.loggedInUser);

        res.status(200).json({
          message: "User Logged In successfully!",
        });
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (err) {
    res.status(500).json({
      //   errors: {
      //     common: {
      //       msg: "Unknown error occured!",
      //     },
      //   },
      message: err.message,
    });
  }
}

// do logout
// function logout(req, res) {
//   res.clearCookie(process.env.COOKIE_NAME);
//   res.send("logged out");
// }

module.exports = {
  getLogin,
  login,
};
