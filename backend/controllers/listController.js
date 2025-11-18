const Blocklist = require('../models/Blocklist');
const Whitelist = require('../models/Whitelist');

const getModel = (listType) => listType === 'blocklist' ? Blocklist : Whitelist;

// @desc    Get all domains from a user's list
exports.getList = async (req, res) => {
  try {
    const Model = getModel(req.params.listType);
    const list = await Model.find({ user: req.user.id });
    res.json(list.map(item => item.domain)); // Send back only an array of domains
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a domain to a user's list
exports.addDomain = async (req, res) => {
  try {
    const Model = getModel(req.params.listType);
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ msg: 'Domain is required' });

    let item = await Model.findOne({ user: req.user.id, domain: domain });
    if (item) return res.status(400).json({ msg: 'Domain already in list' });

    item = new Model({ user: req.user.id, domain: domain });
    await item.save();
    res.json(await Model.find({ user: req.user.id }).map(item => item.domain)); // Return new list
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove a domain from a user's list
exports.removeDomain = async (req, res) => {
  try {
    const Model = getModel(req.params.listType);
    const { domain } = req.body; // Use body for DELETE

    const item = await Model.findOne({ user: req.user.id, domain: domain });
    if (!item) return res.status(404).json({ msg: 'Domain not found in list' });

    await item.deleteOne();
    res.json(await Model.find({ user: req.user.id }).map(item => item.domain)); // Return new list
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};