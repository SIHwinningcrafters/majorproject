const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type:      String,
      required:  [true, "Username is required"],
      unique:    true,
      trim:      true,
      minlength: [3,  "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6,  "Password must be at least 6 characters"],
      select:    false,
    },
    avatar: {
      type:    String,
      default: null,
    },
    bio: {
      type:      String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default:   "",
    },
    role: {
      type:    String,
      enum:    ["user", "moderator", "admin"],
      default: "user",
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    reportCount: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ── hash password before saving ── */
userSchema.pre("save", async function () {   // 👈 NO next parameter at all
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/* ── compare password ── */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ── strip password from JSON ── */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;