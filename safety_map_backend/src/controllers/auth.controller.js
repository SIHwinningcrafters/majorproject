const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ token, user });
};

/* ── SIGNUP ── */
exports.signup = async (req, res) => {
  try {
    const { username, email, password, bio, avatar } = req.body;

    console.log("SIGNUP ATTEMPT:", {
      username,
      email,
      passwordLength: password?.length,
      hasAvatar: !!avatar,
      avatarSize: avatar ? Math.round(avatar.length / 1024) + "KB" : "none",
      bio,
    });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    const existingEmail    = await User.findOne({ email: email.toLowerCase() });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.create({
      username: username.trim(),
      email:    email.trim().toLowerCase(),
      password,
      bio:    bio    || "",
      avatar: avatar || null,
    });

    sendToken(user, 201, res);
  } catch (error) {
    console.error("SIGNUP ERROR >>>", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: error.message });
  }
};
// exports.signup = async (req, res) => {
//   try {
//     const { username, email, password, bio, avatar } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "Username, email and password are required" });
//     }

//     const existingEmail    = await User.findOne({ email: email.toLowerCase() });
//     const existingUsername = await User.findOne({ username });

//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already in use" });
//     }
//     if (existingUsername) {
//       return res.status(400).json({ message: "Username already taken" });
//     }

//     const user = await User.create({
//       username: username.trim(),
//       email:    email.trim().toLowerCase(),
//       password,
//       bio:    bio    || "",
//       avatar: avatar || null,
//     });

//     sendToken(user, 201, res);
//   } catch (error) {
//     console.error("SIGNUP ERROR >>>", error.message); // 👈 see exact error in terminal
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((e) => e.message);
//       return res.status(400).json({ message: messages[0] });
//     }
//     res.status(500).json({ message: error.message });
//   }
// };

/* ── LOGIN ── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been suspended" });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.error("LOGIN ERROR >>>", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ME ── */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── UPDATE PROFILE ── */
exports.updateProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar },
      { new: true, runValidators: true }
    );
    res.json({ user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// exports.signup = async (req, res) => {
//   try {
//     const { username, email, password, bio, avatar } = req.body;

//     /* check duplicates */
//     const existingEmail    = await User.findOne({ email });
//     const existingUsername = await User.findOne({ username });

//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already in use" });
//     }
//     if (existingUsername) {
//       return res.status(400).json({ message: "Username already taken" });
//     }

//     const user = await User.create({
//       username,
//       email,
//       password,
//       bio:    bio    || "",
//       avatar: avatar || null,
//     });

//     sendToken(user, 201, res);
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((e) => e.message);
//       return res.status(400).json({ message: messages[0] });
//     }
//     res.status(500).json({ message: "Server error during signup" });
//   }
// };

/* ── LOGIN ── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    /* explicitly select password since it's select:false */
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been suspended" });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

/* ── GET ME ── */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ── UPDATE PROFILE ── */
exports.updateProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;

    /* don't allow password or role update here */
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar },
      { new: true, runValidators: true }
    );

    res.json({ user: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error during profile update" });
  }
};