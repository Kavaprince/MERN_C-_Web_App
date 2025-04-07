import { useState } from "react";
import { createQuiz } from "@/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Addquestion({ onClose, selectedTopic }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = {
      topicId: selectedTopic._id,
      title,
      type,
      description,
      correctAnswer,
      explanation,
      options: type === "Multiple choice" ? [optionA, optionB, optionC] : [],
    };
    try {
      const response = await createQuiz(newQuestion);
      //console.log("Quiz created successfully:", response);
      //  alert("Question created successfully!");
      setMessage("Question created successfully!");
      setError("");
      setTitle("");
      setType("");
      setDescription("");
      setCorrectAnswer("");
      setExplanation("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
    } catch (error) {
      // console.error("Error creating question:", error);
      // alert("Error creating question: " + error.message);
      setError("Error creating question");
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm z-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-1/3 my-5 max-h-96 overflow-y-auto" // Added max height and scroll
      >
        <div className="mb-4">
          <div>
            <h2 className=" text-xl font-semibold">Add Question to</h2>
          </div>
          <div className="">{selectedTopic?.title}</div>
        </div>

        <Label className="flex left-0 p-2 mb-1">Question Title:</Label>
        <Input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="create-question-input mb-2"
        />
        <Label className="flex left-0 p-2 mb-1">Type:</Label>
        <div className="mb-2">
          <Select
            onValueChange={(value) => setType(value)}
            value={type}
            required
          >
            <SelectTrigger className="create-question-input">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Multiple choice">Multiple choice</SelectItem>
              <SelectItem value="Short answer">Short answer</SelectItem>
              <SelectItem value="Coding question">Coding question</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Label className="flex left-0 p-2 mb-1">Description:</Label>
        <Textarea
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="create-question-input mb-2"
        ></Textarea>
        {type === "Multiple choice" && (
          <>
            <Label className="flex left-0 p-2 mb-1">Option A:</Label>
            <Input
              type="text"
              name="optionA"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              required
              className="create-question-input mb-2"
            />
            <Label className="flex left-0 p-2 mb-1">Option B:</Label>
            <Input
              type="text"
              name="optionB"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              required
              className="create-question-input mb-2"
            />
            <Label className="flex left-0 p-2 mb-1">Option C:</Label>
            <Input
              type="text"
              name="optionC"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              required
              className="create-question-input mb-2"
            />
          </>
        )}
        <Label className="flex left-0 p-2 mb-1">Correct Answer:</Label>
        <Textarea
          type="text"
          name="correctAnswer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
          className="create-question-input mb-2"
        ></Textarea>
        <Label className="flex left-0 p-2 mb-1">Explanation:</Label>
        <Textarea
          type="text"
          name="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          required
          className="create-topic-input mb-2"
        ></Textarea>
        <div className="flex justify-between mt-4">
          <Button type="button" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button type="submit">Create Question</Button>
        </div>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
