import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MonacoEditor from "@monaco-editor/react";
import { submitQuiz } from "@/api";

export function AnswerQuestion({ quiz, onCancel }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [codingAnswer, setCodingAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0); // Track the user's current score
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const [isCompleted, setIsCompleted] = useState(false); // Disable inputs when quiz is done

  const handleSubmit = async () => {
    const normalize = (str) => str?.trim().toLowerCase();
    let answer;

    if (quiz.type === "Multiple choice") {
      answer = normalize(selectedOption);
    } else if (quiz.type === "Short answer") {
      answer = normalize(shortAnswer);
    } else if (quiz.type === "Coding question") {
      answer = normalize(codingAnswer);
    }

    // Prevent empty submissions
    if (!answer) {
      setMessage("Please provide an answer before submitting.");
      return;
    }

    try {
      setIsSubmitting(true); // Disable multiple submissions
      const result = await submitQuiz(quiz._id, answer, quiz.correctAnswer);

      // Disable inputs if the user finds the correct answer or reaches max attempts
      if (result.correct || result.attempt >= 3) {
        setIsCompleted(true); // Disable further input
      }

      // Display feedback based on attempt count and correctness
      if (result.attempt >= 3 && !result.correct) {
        setMessage("You have reached the maximum number of attempts.");
      } else {
        setMessage(
          result.correct
            ? `Correct! You completed the quiz in ${result.attempt} attempts.`
            : `Incorrect. Try again! (Attempt ${result.attempt} of 3)`
        );
      }

      // Update the user's score
      if (result.score !== undefined) {
        setScore(result.score);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // Display the back-end message for 400 Bad Request
        setMessage(error.response.data.message || "Bad Request.");
        setIsCompleted(true); // Ensure the user cannot input more
      } else {
        // Handle other errors
        setMessage("Error submitting quiz. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable submission state
    }

    // Clear the message after 5 seconds
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="answer-question-form p-6 bg-white shadow-md rounded-lg text-left mb-4 animate-slide-up">
      {/* Quiz Title and Description */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
        <p className="text-gray-600">{quiz.description}</p>
      </div>

      {/* Multiple Choice Question */}
      {quiz.type === "Multiple choice" && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Options:</h3>
          <RadioGroup
            className="list-disc list-inside ml-5 space-y-2"
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value)}
            disabled={isCompleted} // Disable input when quiz is completed
          >
            {quiz.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={isCompleted} // Disable input
                />
                <Label htmlFor={`option-${index}`} className="text-gray-700">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Short Answer Question */}
      {quiz.type === "Short answer" && (
        <div className="mb-4">
          <Label htmlFor="shortAnswer" className="font-semibold text-gray-700">
            Your Answer:
          </Label>
          <Textarea
            id="shortAnswer"
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            className="w-full mt-2 p-2 border rounded-md"
            disabled={isCompleted} // Disable input
          />
        </div>
      )}

      {/* Coding Question */}
      {quiz.type === "Coding question" && (
        <div className="mb-4">
          <Label htmlFor="codingAnswer" className="font-semibold text-gray-700">
            Your Code:
          </Label>
          <MonacoEditor
            height="200px"
            language="javascript"
            theme="vs-dark"
            value={codingAnswer}
            onChange={(value) => setCodingAnswer(value)}
            className="w-full mt-2 border rounded-md"
            options={{ readOnly: isCompleted }} // Set read-only when completed
          />
        </div>
      )}

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-between mt-4">
        <Button onClick={handleSubmit} disabled={isSubmitting || isCompleted}>
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>

      {/* Feedback Message */}
      {message && <p className="text-green-500 mt-4">{message}</p>}

      {/* Display Current Score */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Your Current Score: {score}
        </h3>
      </div>
    </div>
  );
}
