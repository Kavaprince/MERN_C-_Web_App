import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateQuiz } from "@/api";
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

export function UpdateQuestion({ quiz, onSave, onCancel }) {
  const [title, setTitle] = useState(quiz.title);
  const [type, setType] = useState(quiz.type);
  const [description, setDescription] = useState(quiz.description);
  const [correctAnswer, setCorrectAnswer] = useState(quiz.correctAnswer);
  const [explanation, setExplanation] = useState(quiz.explanation);
  const [optionA, setOptionA] = useState(quiz.options ? quiz.options[0] : "");
  const [optionB, setOptionB] = useState(quiz.options ? quiz.options[1] : "");
  const [optionC, setOptionC] = useState(quiz.options ? quiz.options[2] : "");

  const handleSave = async () => {
    const updatedQuiz = {
      ...quiz,
      title,
      type,
      description,
      correctAnswer,
      explanation,
      options: type === "Multiple choice" ? [optionA, optionB, optionC] : [],
    };
    try {
      await updateQuiz(quiz._id, updatedQuiz); // Pass the quiz ID and updated data
      onSave(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <div className="edit-topic-form text-left">
      <div className="mb-4">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Label htmlFor="type" className="flex left-0 p-2 mb-1">
        Type:
      </Label>
      <div className="mb-2">
        <Select
          id="type"
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

      <div className="mb-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></Textarea>
      </div>

      {type === "Multiple choice" && (
        <>
          <Label htmlFor="optionA" className="flex left-0 p-2 mb-1">
            Option A:
          </Label>
          <Input
            id="optionA"
            type="text"
            name="optionA"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
            className="create-question-input mb-2"
          />
          <Label htmlFor="optionB" className="flex left-0 p-2 mb-1">
            Option B:
          </Label>
          <Input
            id="optionB"
            type="text"
            name="optionB"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
            className="create-question-input mb-2"
          />
          <Label htmlFor="optionC" className="flex left-0 p-2 mb-1">
            Option C:
          </Label>
          <Input
            id="optionC"
            type="text"
            name="optionC"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
            className="create-question-input mb-2"
          />
        </>
      )}

      <div className="mb-4">
        <Label htmlFor="correctAnswer" className="flex left-0 p-2 mb-1">
          Correct Answer:
        </Label>
        <Textarea
          id="correctAnswer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        ></Textarea>
      </div>

      <div className="mb-8">
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        ></Textarea>
      </div>

      <div className="flex justify-between mb-8">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
