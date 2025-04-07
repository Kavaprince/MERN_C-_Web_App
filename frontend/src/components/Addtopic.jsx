import { useState } from "react";
import { createTopic } from "@/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Addtopic({ onClose }) {
  const [title, setTitle] = useState("");
  const [learning_objectives, setLearning_objectives] = useState("");
  const [description, setDescription] = useState("");
  const [code_snippet, setCode_snippet] = useState("");
  const [explanation, setExplanation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTopic = {
      title,
      learning_objectives,
      description,
      code_snippet,
      explanation,
    };
    try {
      const response = await createTopic(newTopic);
      //console.log("Topic created successfully:", response);
      setMessage("Topic created successfully!");
      setError("");
      setTitle("");
      setLearning_objectives("");
      setDescription("");
      setCode_snippet("");
      setExplanation("");
    } catch (error) {
      //console.error("Error creating topic:", error);
      setError("Error creating topic");
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm z-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-1/3 my-5 hover:cursor-pointer"
      >
        <Label className="flex left-0 p-2">Topic Title:</Label>
        <Input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="create-topic-input"
        />
        <Label className="flex left-0 p-2">Learning Objectives:</Label>
        <Textarea
          type="text"
          name="learning_objectives"
          value={learning_objectives}
          onChange={(e) => setLearning_objectives(e.target.value)}
          required
          className="create-topic-input"
        ></Textarea>
        <Label className="flex left-0 p-2">Description:</Label>
        <Textarea
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="create-topic-input"
        ></Textarea>
        <Label className="flex left-0 p-2">Code Snippet:</Label>
        <Textarea
          type="text"
          name="code_snippet"
          value={code_snippet}
          onChange={(e) => setCode_snippet(e.target.value)}
          required
          className="create-topic-input"
        ></Textarea>
        <Label className="flex left-0 p-2">Explanation:</Label>
        <Textarea
          type="text"
          name="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          required
          className="create-topic-input"
        ></Textarea>
        <div className="flex justify-between mt-4">
          <Button type="button" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button type="submit">Create Topic</Button>
        </div>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
