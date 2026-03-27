const Incident = require("../models/Incident");

/* ── GET ALL INCIDENTS ── */
exports.getAllIncidents = async (req, res) => {
  try {
    const {
      severity,
      category,
      status = "active",
      sort   = "-createdAt",
      page   = 1,
      limit  = 20,
    } = req.query;

    const filter = { status };
    if (severity) filter.severity = severity;
    if (category) filter.category = category;

    const skip  = (page - 1) * limit;
    const total = await Incident.countDocuments(filter);

    const incidents = await Incident.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "reportedBy",
        select: "username avatar",
      })
      .lean();

    /* hide reporter identity for anonymous reports */
    const sanitized = incidents.map((inc) => ({
      ...inc,
      reportedBy: inc.anonymous
        ? { username: "Anonymous", avatar: null }
        : inc.reportedBy,
    }));

    res.json({
      incidents: sanitized,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching incidents" });
  }
};

/* ── GET SINGLE INCIDENT ── */
exports.getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("reportedBy", "username avatar bio");

    if (!incident || incident.status === "removed") {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({ incident });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ── CREATE INCIDENT ── */
exports.createIncident = async (req, res) => {
  try {
    const {
      category,
      severity,
      description,
      location,
      anonymous,
      images,
    } = req.body;

    const incident = await Incident.create({
      category,
      severity,
      description,
      location,
      anonymous: anonymous || false,
      images:    images    || [],
      reportedBy: req.user._id,
    });

    /* bump user report count */
    await req.user.updateOne({ $inc: { reportCount: 1 } });

    const populated = await incident.populate("reportedBy", "username avatar");

    res.status(201).json({ incident: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Server error creating incident" });
  }
};

/* ── UPDATE INCIDENT ── */
exports.updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    /* only owner or admin can update */
    const isOwner = incident.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this incident" });
    }

    const allowed = ["description", "severity", "category", "status", "location"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) incident[field] = req.body[field];
    });

    await incident.save();
    res.json({ incident });
  } catch (error) {
    res.status(500).json({ message: "Server error updating incident" });
  }
};

/* ── DELETE INCIDENT ── */
exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const isOwner = incident.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this incident" });
    }

    await incident.deleteOne();
    res.json({ message: "Incident deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting incident" });
  }
};

/* ── UPVOTE INCIDENT ── */
exports.upvoteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const userId    = req.user._id.toString();
    const alreadyUp = incident.upvotedBy.map(String).includes(userId);

    if (alreadyUp) {
      /* toggle off */
      incident.upvotedBy = incident.upvotedBy.filter(
        (id) => id.toString() !== userId
      );
      incident.upvotes = Math.max(0, incident.upvotes - 1);
    } else {
      incident.upvotedBy.push(req.user._id);
      incident.upvotes += 1;
    }

    await incident.save();
    res.json({ upvotes: incident.upvotes, upvoted: !alreadyUp });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ── GET STATS ── */
exports.getStats = async (req, res) => {
  try {
    const [total, high, medium, low, byCategory] = await Promise.all([
      Incident.countDocuments({ status: "active" }),
      Incident.countDocuments({ status: "active", severity: "high" }),
      Incident.countDocuments({ status: "active", severity: "medium" }),
      Incident.countDocuments({ status: "active", severity: "low" }),
      Incident.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({ total, high, medium, low, byCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching stats" });
  }
};