const Gig = require('../models/Gig.model');

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Protected
const createGig = async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
            status: 'open'
        });

        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all open gigs
// @route   GET /api/gigs
// @access  Public
const getAllGigs = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: 'open' };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createGig,
    getAllGigs
};
