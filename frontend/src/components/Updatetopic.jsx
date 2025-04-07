import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateTopic } from "@/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function UpdateTopic({ topic, onSave, onCancel }) {
  const [title, setTitle] = useState(topic.title);
  const [description, setDescription] = useState(topic.description);
  const [learningObjectives, setLearningObjectives] = useState(
    topic.learning_objectives
  );
  const [codeSnippet, setCodeSnippet] = useState(topic.code_snippet);
  const [explanation, setExplanation] = useState(topic.explanation);

  const handleSave = () => {
    const updatedTopic = {
      ...topic,
      title,
      description,
      learning_objectives: learningObjectives,
      code_snippet: codeSnippet,
      explanation,
    };
    onSave(updatedTopic);
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
      <div className="mb-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></Textarea>
      </div>
      <div className="mb-4">
        <Label htmlFor="learningObjectives">Learning Objectives</Label>
        <Textarea
          id="learningObjectives"
          value={learningObjectives}
          onChange={(e) => setLearningObjectives(e.target.value)}
        ></Textarea>
      </div>
      <div className="mb-4">
        <Label htmlFor="codeSnippet">Code Snippet</Label>
        <Textarea
          id="codeSnippet"
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
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
