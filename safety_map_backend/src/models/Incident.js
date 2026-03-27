const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  lat:   { type: Number, required: true },
  lng:   { type: Number, required: true },
});

const incidentSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Harassment",
        "Theft",
        "Poor Lighting",
        "Unsafe Road",
        "Safe Zone",
        "Suspicious",
        "Accident",
        "Other",
      ],
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: ["high", "medium", "low"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      type: locationSchema,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "resolved", "flagged", "removed"],
      default: "active",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    images: [{ type: String }], // URLs or base64
  },
  { timestamps: true }
);

/* ── index for geo queries later ── */
incidentSchema.index({ "location.lat": 1, "location.lng": 1 });
incidentSchema.index({ severity: 1 });
incidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Incident", incidentSchema);