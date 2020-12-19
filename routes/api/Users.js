const express = require("express");
const router = express.Router();
const User = require("../../Model/User");
const { check, validationResult } = require("express-validator");
const Task = require("../../Model/Task");

//@route   POST api/user
//@desc    Add user route
//@access  Public

router.post(
  "/add",
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let { name } = req.body;
      const user = new User({ name });
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

//@route   Get api/user
//@desc    fetch users route
//@access  Public

router.get("/", async (req, res) => {
  try {
    //Finding all the users from User's collection
    const users = await User.aggregate().lookup({
      from: Task.collection.name,
      localField: "_id",
      foreignField: "owner",
      as: "taskList",
    });

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

//@route PUT api/user/:id
//@desc route to edit user
//@access Public

router.put(
  "/:id",
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // Validating req body and sending errors back if any
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { name } = req.body;

      //Check for valid user id (mongoose ObjectId)
      if (id.length !== 24)
        return res.status(400).json({ errors: [{ msg: "Invalid user id." }] });
      //fetching user
      const user = await User.findById(id);
      if (user) {
        user.name = name;
        await user.save();
        return res.status(200).json(user);
      }
      //user not found
      return res.status(400).send("User not found!");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

//@route PUT api/user/delete/:id
//@desc route to delete a user
//@access Public

router.put("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Check for valid user id (mongoose ObjectId)
    if (id.length !== 24)
      return res.status(400).json({ errors: [{ msg: "Invalid user id." }] });
    //finding and deleting user by id
    const deletedUser = await User.findByIdAndRemove(id);
    if (deletedUser) {
      return res.status(200).send("User deleted successfully!");
    }
    //user not found
    return res.status(400).send("User not found!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;