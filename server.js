const express = require("express");
const db = require("./database.js");

const server = express();

server.use(express.json());

server.get("/api/users", (req, res) => {
  const users = db.getUsers();

  if (users) {
    res.json(users);
  } else {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  }
});

server.get("/api/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  try {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      errorMessage: "The user information could not be retrieved.",
    });
  }
});

server.post("/api/users", (req, res) => {
  try {
    if (!req.body.name || !req.body.bio) {
      return res.status(400).json({
        message: "Please provide name and bio for the user.",
      });
    }

    const newUser = db.createUser({
      name: req.body.name,
      bio: req.body.bio,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

server.put("/api/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  try {
    if (user) {
      const updatedUser = db.updateUser(user.id, {
        name: req.body.name || user.name,
        bio: req.body.bio || user.bio,
      });

      res.json(updatedUser);
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    }

    if (!req.body.name || !req.body.bio) {
      return res.status(400).json({
        message: "Please provide name and bio for the user.",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      errorMessage: "The user information could not be modified.",
    });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  try {
    if (user) {
      db.deleteUser(user.id);

      res.status(204).end();
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      errorMessage: "The user could not be removed",
    });
  }
});

server.listen(2100, () => {
  console.log("server started on port 2100");
});
