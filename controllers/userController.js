const { Thought, User } = require("../models");

const user = {
  async getAll(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async createOne(req, res) {
    try {
      if (!req.body?.username || !req.body?.email) {
        res
          .status(404)
          .json({ message: "Missing required username or email." });
        return;
      }
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
      });
      return !user
        ? res.status(404).json({ message: "Error creating user" })
        : res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async getOne(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");
      return !user
        ? res.status(404).json({ message: "No user with that ID" })
        : res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateOne(req, res) {
    try {
      if (!req.body?.username && !req.body?.email) {
        res
          .status(404)
          .json({ message: "Must include either username or email." });
        return;
      }

      const user = await findOne({ _id: req.params.userId });

      if (!user) {
        res
          .status(404)
          .json({ message: "No user found with ID: " + req.params.userId });
        return;
      }

      if (req.body?.username) {
        user.username = req.body.username;
      }

      if (req.body?.email) {
        user.email = req.body.email;
      }

      user
        .save()
        .then((newUser) => res.status(200).json(newUser))
        .catch((err) => res.status(400).json({ message: err }));
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async deleteOne(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      if (!user)
        return res.status(404).json({ message: "No user with that ID" });

      //   **BONUS**: Remove a user's associated thoughts when deleted.
      Thought.deleteMany({ _id: { $in: user.thoughts } }).then(
        await User.deleteOne({ _id: req.params.userId })
          .then(() => res.json({ message: "User and thoughts deleted!" }))
          .catch((err) => res.status(500).json({ message: err }))
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    // userId.friends.push(friendId) unless it's already there

    // try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user)
      return res
        .status(404)
        .json({ message: "No user's matched user ID: " + req.params.userId });

    const friend = await User.findOne({ _id: req.params.friendId });
    if (!friend)
      return res.status(404).json({
        message: "No user's matched friend ID: " + req.params.friendId,
      });

    if (!user.friends.includes(req.params.friendId)) {
      user.friends.push(req.params.friendId);
      user
        .save()
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json({ message: err }));
    } else {
      res.status(200).json({ message: "They were already friends!" });
    }
    // } catch (err) {
    //   res.status(500).json({ message: err });
    // }
  },

  async removeFriend(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      if (!user)
        return res
          .status(404)
          .json({ message: "No user matched user ID: " + req.params.userId });

      if (user.friends.includes(req.params.friendId)) {
        let friendList = user.friends.filter(
          (friend) => friend != req.params.friendId
        );

        if (friendList.length == user.friends.length)
          return res
            .status(200)
            .json({ message: "They were not friends to begin with!" });

        user.friends = friendList;
        user
          .save()
          .then((user) => res.status(200).json(user))
          .catch((err) => res.status(500).json({ message: err }));
      } else {
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },
};

module.exports = user;
