const router = require("express").Router();

const { thought } = require("../../controllers");

// /api/thoughts - GET all thoughts, POST new thought
router.route("/").get(thought.getAll).post(thought.createOne);

// /api/thoughts/:thoughtId - GET/PUT/DELETE
router
  .route("/:thoughtId")
  .get(thought.getOne)
  .put(thought.updateOne)
  .delete(thought.deleteOne);

// /api/thoughts/:thoughtId/reactions - POST/DELETE
router
  .route("/:thoughtId/reactions")
  .post(thought.createReaction)
  .delete(thought.removeReaction);

module.exports = router;
