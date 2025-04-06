import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/authmiddleware.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const topicRoutes = express.Router();

// get a list of all the topics.
topicRoutes.get("/topics/all", verifyToken, async (req, res) => {
  let collection = await db.collection("topics");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

//get a single topics by id
topicRoutes.get("/topic/:id", verifyToken, async (req, res) => {
  let collection = await db.collection("topics");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

//Create topics
// Create topic
topicRoutes.post("/topics/create", verifyToken, async (req, res) => {
  try {
    // Ensure the user creating the topic is an admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can create topics." });
    }

    const newDocument = {
      title: req.body.title,
      learning_objectives: req.body.learning_objectives,
      description: req.body.description,
      code_snippet: req.body.code_snippet,
      explanation: req.body.explanation,
      createdAt: new Date(),
      createdBy: {
        id: req.user._id, // Admin's ID from the token
        username: req.user.username, // Admin's username from the token
      },
    };

    let topicCollection = await db.collection("topics");
    let result = await topicCollection.insertOne(newDocument);
    console.log("Topic created by admin:", req.user.username);
    console.log("Topic created on:", req.body.createdAt);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).send("Error adding record");
  }
});

// update topics by id
topicRoutes.patch("/topic/update/:id", verifyToken, async (req, res) => {
  try {
    // Ensure the user updating the topic is an admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can update topics." });
    }

    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title: req.body.title,
        learning_objectives: req.body.learning_objectives,
        description: req.body.description,
        code_snippet: req.body.code_snippet,
        explanation: req.body.explanation,
        updatedAt: new Date(),
        updatedBy: {
          id: req.user._id, // Admin's ID from the token
          username: req.user.username, // Admin's username from the token
        },
      },
    };

    let collection = await db.collection("topics");
    let result = await collection.updateOne(query, updates);
    console.log("Topic updated by admin:", req.user.username);
    console.log("Topic updated on:", req.body.updatedAt);
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Topic not found or no changes made." });
    }

    res.status(200).json({ message: "Topic updated successfully", result });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ message: "Error updating record" });
  }
});

// Delete topics by id
topicRoutes.delete("/topic/delete/:id", verifyToken, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("topics");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default topicRoutes;
