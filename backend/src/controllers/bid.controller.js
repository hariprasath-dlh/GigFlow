const Bid = require("../models/Bid.model");
const Gig = require("../models/Gig.model");
const User = require("../models/User.model");
const { sendHireEmail } = require("../utils/sendEmail");

/* ---------------- SUBMIT BID ---------------- */
const submitBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.status !== "open") {
      return res.status(400).json({ message: "Gig is not open for bidding" });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot bid on your own gig" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
      status: "pending",
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit bid" });
  }
};

/* ---------------- GET BIDS BY GIG (OWNER ONLY) ---------------- */
const getBidsByGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId: gig._id });
    res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bids" });
  }
};

/* ---------------- HIRE BID (FINAL SAFE LOGIC) ---------------- */
const hireBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Owner check
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent double hiring
    if (gig.status !== "open") {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // 1️⃣ Assign gig
    gig.status = "assigned";
    await gig.save();

    // 2️⃣ Hire selected bid
    bid.status = "hired";
    await bid.save();

    // 3️⃣ Reject other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    // 4️⃣ EMAIL NOTIFICATION (non-blocking)
    const freelancer = await User.findById(bid.freelancerId);
    if (freelancer) {
      console.log("📧 Attempting to send hire email to:", freelancer.email);
      sendHireEmail({
        to: freelancer.email,
        freelancerName: freelancer.name,
        gigTitle: gig.title,
        budget: gig.budget,
      });
    }

    // 5️⃣ SOCKET.IO NOTIFICATION (non-blocking)
    const io = req.app.get("io");
    if (io) {
      io.to(bid.freelancerId.toString()).emit("hired-notification", {
        gigTitle: gig.title,
        message: `🎉 You have been hired for "${gig.title}"`,
      });
    }

    res.status(200).json({ message: "Bid hired successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hiring failed" });
  }
};

/* ---------------- EXPORTS ---------------- */
module.exports = {
  submitBid,
  getBidsByGig,
  hireBid,
};
