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
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      return !thought
        ? res.status(404).json({ message: "No user with that ID" })
        : res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateOne(req, res) {
    // try {
    if (!req.body?.thoughtText && !req.body?.username) {
      res
        .status(404)
        .json({ message: "Must include either username or thoughtText." });
      return;
    }

    const thought = await Thought.findOne({ _id: req.params.thoughtId });

    if (!thought) {
      res.status(404).json({
        message: "No thought found with ID: " + req.params.thoughtId,
      });
      return;
    }

    if (req.body?.username == thought.username) {
      if (!req.body.thoughtText) {
        console.log("no username to update");
        return res
          .status(200)
          .json({ message: "No save required and username was not changed" });
      }
    } else {
      // new username, remove from old user and add to new one.
      let oldUser = await User.findOne({ username: thought.username });

      if (!oldUser)
        return res
          .status(404)
          .json({ message: "Database error: old user does not exist" });

      let newUser = await User.findOne({ username: req.body.username });
      if (!newUser)
        return res
          .status(404)
          .json({ message: "Database error: old user does not exist" });

      // first remove from old username
      const oldThoughtList = oldUser.thoughts.filter(
        (userThought) => userThought._id != req.params.thoughtId
      );
      oldUser.thoughts = oldThoughtList;

      await oldUser.save().catch((err) => {
        throw err;
      });

      // Now add to new username
      newUser.thoughts.push(req.params.thoughtId);

      await newUser.save().catch((err) => {
        throw err;
      });

      thought.username = req.body.username;
    }

    if (req.body?.thoughtText) {
      thought.thoughtText = req.body.thoughtText;
    }

    thought
      .save()
      .then((newThought) => res.status(200).json(newThought))
      .catch((err) => res.status(400).json({ message: err }));
    // } catch (err) {
    //   res.status(500).send(err);
    // }
  },

  async deleteOne(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought)
        return res.status(404).json({ message: "No thought with that ID" });

      const user = await User.findOne({ username: thought.username });

      let thoughtList = user.thoughts.filter(
        (thought) => thought != req.params.thoughtId
      );

      if (thoughtList.length != user.thoughts.length) {
        user.thoughts = thoughtList;
        await user.save();
      }

      Thought.deleteOne({ _id: req.params.thoughtId })
        .then(() => res.json({ message: "User and thoughts deleted!" }))
        .catch((err) => res.status(500).json({ message: err }));
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      if (!req.body?.username || !req.body?.reactionBody)
        return res
          .status(400)
          .json({ message: "Both username and reactionBody are required" });

      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought)
        return res.status(404).json({
          message: "No thoughts matched thoughtId: " + req.params.thoughtId,
        });

      thought.reactions.push({
        username: req.body.username,
        reactionBody: req.body.reactionBody,
      });
      thought
        .save()
        .then((newThought) => res.status(200).json(newThought))
        .catch((err) => res.status(500).json({ message: err }));
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought)
        return res.status(404).json({
          message: "No thoughts matched thoughtId: " + req.params.thoughtId,
        });

      let reactionList = thought.reactions.filter(
        (reaction) => reaction.reactionId != req.params.reactionId
      );

      if (reactionList.length != thought.reactions.length) {
        thought.reactions = reactionList;
        thought.save().then((newThought) => res.status(200).json(newThought));
      } else return res.status(404).json({ message: "No reaction to delete" });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },
};

module.exports = thought;
