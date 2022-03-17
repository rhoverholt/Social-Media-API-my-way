const router = require("express").Router();
const { thought, user } = require("../../controllers");

// /api/users -- GET all users, POST new user
router.route("/").get(user.getAll).post(user.createOne);

// /api/users/:userId  GET/PUT/DELETE users
router
  .route("/:userId")
  .get(user.getOne)
  .put(user.updateOne)
  .delete(user.deleteOne);

// /api/users/:userId/friends/:friendId
// * `POST` to add a new friend to a user's friend list
// * `DELETE` to remove a friend from a user's friend list
router
  .route("/:userId/friends/:friendId")
  .post(user.addFriend)
  .delete(user.removeFriend);

module.exports = router;
