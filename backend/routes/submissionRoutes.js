import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const submissionRoutes = express.Router();

// Route for submitting quiz answers and comparing with correct answers
// Submit a quiz
submissionRoutes.post("/quiz/submit", verifyToken, async (req, res) => {
  try {
    const { quizId, answers, correctAnswer } = req.body;
    const userId = req.user._id;

    if (!userId) {
      console.error("User ID is missing in the request");
      return res
        .status(400)
        .json({ message: "User ID is missing in the request" });
    }
    if (!quizId || !answers || !correctAnswer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("User ID in request:", userId);

    const submissionCollection = await db.collection("quiz_submissions");

    // Check the user's attempt count
    const existingAttempts = await submissionCollection.countDocuments({
      quizId: new ObjectId(quizId),
      userId: new ObjectId(userId),
    });

    if (existingAttempts >= 3) {
      return res.status(400).json({
        message:
          "You have reached the maximum number of attempts for this quiz.",
      });
    }

    // Normalize answers for comparison
    const normalize = (str) => str.trim().toLowerCase().replace(/\r\n/g, "\n");

    let correctCount = 0;
    if (Array.isArray(correctAnswer) && Array.isArray(answers)) {
      correctCount = correctAnswer.reduce((count, ans, idx) => {
        return normalize(ans) === normalize(answers[idx]) ? count + 1 : count;
      }, 0);
    } else {
      correctCount = normalize(correctAnswer) === normalize(answers) ? 1 : 0;
    }

    const attempt = existingAttempts + 1; // Calculate the current attempt

    const submission = {
      quizId: new ObjectId(quizId),
      userId: new ObjectId(userId),
      answers,
      correct:
        correctCount ===
        (Array.isArray(correctAnswer) ? correctAnswer.length : 1),
      attempt, // Track the current attempt
      submittedAt: new Date(),
    };

    console.log("Inserting submission:", submission);

    const result = await submissionCollection.insertOne(submission);

    console.log("Submission inserted, updating user score...");

    const userCollection = await db.collection("users");
    const scoreIncrement = correctCount;
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { score: scoreIncrement } }
    );

    if (updateResult.matchedCount === 0) {
      console.error(`No user found with ID: ${userId}`);
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    }

    const updatedUser = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!updatedUser) {
      console.error("Failed to retrieve updated user document.");
      return res
        .status(500)
        .json({ message: "Failed to retrieve updated user document." });
    }

    console.log("Updated user's score:", updatedUser.score);

    res.status(200).json({
      message: "Quiz submitted successfully",
      correctAnswers: correctCount,
      totalQuestions: Array.isArray(correctAnswer) ? correctAnswer.length : 1,
      score: updatedUser.score,
      result,
      correct: submission.correct,
      attempt, // Include the current attempt in the response
    });
  } catch (error) {
    console.error("Error submitting quiz:", error.message, error.stack);
    res.status(500).json({
      message: "Error submitting quiz",
      error: error.message,
    });
  }
});

// Get all user submissions (with pagination)
submissionRoutes.get("/quiz/submissions", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const collection = await db.collection("quiz_submissions");

    const { page = 1, limit = 10 } = req.query;
    const submissions = await collection
      .find({ userId: new ObjectId(userId) })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    const totalSubmissions = await collection.countDocuments({
      userId: new ObjectId(userId),
    });

    res.status(200).json({
      submissions,
      total: totalSubmissions,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving submissions" });
  }
});

// Get a specific submission
submissionRoutes.get("/quiz/submission/:id", verifyToken, async (req, res) => {
  try {
    const submissionId = req.params.id;

    if (!ObjectId.isValid(submissionId)) {
      return res
        .status(400)
        .json({ message: `Invalid submission ID: ${submissionId}` });
    }

    const collection = await db.collection("quiz_submissions");
    const submission = await collection.findOne({
      _id: new ObjectId(submissionId),
    });

    if (!submission) {
      return res
        .status(404)
        .json({ message: `Submission with ID ${submissionId} not found` });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving submission" });
  }
});

// Route for providing feedback on a quiz submission
submissionRoutes.post("/quiz/feedback", verifyToken, async (req, res) => {
  try {
    const { submissionId, feedback } = req.body;

    const collection = await db.collection("quiz_submissions");

    // Update submission with feedback
    const result = await collection.updateOne(
      { _id: new ObjectId(submissionId) },
      { $set: { feedback } }
    );

    res.status(200).json({ message: "Feedback provided successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error providing feedback" });
  }
});

export default submissionRoutes;
