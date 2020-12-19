const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../Model/User");
const Task = require("../../Model/Task");
const { check, validationResult } = require("express-validator");

//@route   POST api/task
//@desc    add a task route
//@access  Public

router.post(
  "/add",
  [
    check("taskName", "taskName is required!").not().isEmpty(),
    check("userId", "Valid userId is required!").isLength({ min: 24, max: 24 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { taskName, userId } = req.body;
      const user = await User.findById(userId);
      if (user) {
        const task = new Task({
          name: taskName,
          created: new Date(),
          owner: mongoose.mongo.ObjectID(userId),
        });
        await task.save();
        return res.status(200).json(task);
      }
      return res.status(400).json({ errors: [{ err: "User not found!" }] });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

//@route PUT api/task/:id
//@desc route to edit task
//@access Public

router.put(
  "/:id",
  [check("taskName", "taskName is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // Validating req body and sending errors back if any
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { taskName } = req.body;

      //Check for valid task id (mongoose ObjectId)
      if (id.length !== 24)
        return res.status(400).json({ errors: [{ msg: "Invalid task id." }] });
      //fetching task
      const task = await Task.findById(id);
      if (task) {
        task.name = taskName;
        task.updated = new Date();
        await task.save();
        return res.status(200).json(task);
      }
      //task not found
      return res.status(400).send("Task not found!");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

//@route PUT api/task/transfer/:id
//@desc route to edit task owner
//@access Public

router.put(
  "/transfer/:id",
  [
    check("newOwner", "Valid (newOwner)userId is required").isLength({
      min: 24,
      max: 24,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // Validating req body and sending errors back if any
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { newOwner } = req.body;

      //Check for valid task id (mongoose ObjectId)
      if (id.length !== 24)
        return res.status(400).json({ errors: [{ msg: "Invalid task id." }] });
      //fetching task
      const task = await Task.findById(id);
      //fetching new user
      const user = await User.findById(newOwner);
      if (!user) {
        return res.status(400).send("User not found!");
      }
      if (task) {
        task.owner = mongoose.mongo.ObjectID(newOwner);
        task.updated = new Date();
        await task.save();
        return res.status(200).json(task);
      }
      //task not found
      return res.status(400).send("Task not found!");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

//@route PUT api/task/delete/:id
//@desc route to delete a task
//@access Public

router.put("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Check for valid task id (mongoose ObjectId)
    if (id.length !== 24)
      return res.status(400).json({ errors: [{ msg: "Invalid task id." }] });
    //finding and deleting task by id
    const deletedTask = await Task.findByIdAndRemove(id);
    if (deletedTask) {
      return res.status(200).send("Task deleted successfully!");
    }
    //task not found
    return res.status(400).send("Task not found!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;