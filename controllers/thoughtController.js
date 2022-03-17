const { Thought, User } = require("../models");

const thought = {
  async getAll(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } catch {
      res.status(500).send("getAll failed");
    }
  },

  async createOne(req, res) {
    try {
      if (!req.body?.thoughtText || !req.body?.username) {
        res
          .status(404)
          .json({ message: "Missing required thoughtText or username." });
        return;
      }
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json({
          message: "No user found with name: " + req.body.username,
        });
        return;
      }
      const thought = await Thought.create(req.body);
      const updUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { thoughts: thought } },
        { new: true }
      );
      return !updUser
        ? res.status(404).json({ message: "Error writing thought to user" })
        : res.json(thought);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async getOne(req, res) {
    res.status(500).send("getOne under development");
  },

  async updateOne(req, res) {
    res.status(500).send("updateOne under development");
  },

  async deleteOne(req, res) {
    res.status(500).send("deleteOne under development");
  },

  async createReaction(req, res) {
    res.status(500).send("createReaction under development");
  },

  async removeReaction(req, res) {
    res.status(500).send("removeReaction under development");
  },
};

module.exports = thought;
