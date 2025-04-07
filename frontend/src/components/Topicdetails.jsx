import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { UpdateTopic } from "@/components/Updatetopic";
import { Edit, Trash } from "lucide-react";
import { deleteTopic } from "@/api";
import * as jwt_decode from "jwt-decode";
import { SlideView } from "@/components/SlideView"; // Import SlideView component for user view

export function Topicdetails({ topic, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isSlideView, setIsSlideView] = useState(false); // State to toggle slide view
  const [user, setUser] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedTopic) => {
    onSave(updatedTopic);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      onDelete(id);
      setDeleteMessage("Deleted successfully");
      setTimeout(() => setDeleteMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const handleToggleSlideView = () => {
    setIsSlideView(!isSlideView);
  };

  useEffect(() => {
    async function loadUserData() {
      const token = sessionStorage.getItem("User");
      if (token) {
        const decodedUser = jwt_decode.jwtDecode(token);

        // console.log("Decoded User:", decodedUser); // Log the decoded user data
        setUser(decodedUser); // Set the decoded user data into the state
      }
    }
    loadUserData();
  }, []);

  return (
    <div className="">
      {isSlideView ? (
        <SlideView topic={topic} onClose={handleToggleSlideView} />
      ) : (
        <>
          {isEditing ? (
            <UpdateTopic
              topic={topic}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <Collapsible key={topic._id} topic={topic} className="mb-4">
              <CollapsibleTrigger
                className="flex text-lg font-semibold hover:cursor-pointer hover:bg-gray-200 p-4 border-b border-gray-300 w-full"
                onClick={user.role !== "Admin" ? handleToggleSlideView : null} // Toggle to slide view on click for users only
              >
                {topic.title}
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-gray-50 p-4 rounded-b-lg w-full animate-slide-up">
                <div className="flex flex-col p-4 bg-white shadow-md rounded-lg w-full">
                  <div className="mb-5 text-left">
                    <strong>Learning Objectives:</strong>
                    <ul className="list-disc list-inside">
                      {topic.learning_objectives
                        .split("\n")
                        .map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                    </ul>
                  </div>
                  <div className="mb-5 text-left">
                    <strong>Description:</strong>
                    <div>{topic.description}</div>
                  </div>
                  <pre className="mb-5 bg-gray-100 p-3 rounded-md w-full overflow-auto text-left">
                    <code className="font-mono">
                      <strong>Code Snippet:</strong>
                      <div className="mt-5">{topic.code_snippet}</div>
                    </code>
                  </pre>
                  <div className="mb-5 text-left">
                    <strong>Explanation:</strong>
                    <div className="bg-gray-100 p-3 rounded-md border border-gray-300 whitespace-pre-line leading-relaxed font-mono">
                      {topic.explanation}
                    </div>
                  </div>
                  {user.role === "Admin" && (
                    <div className="flex justify-end">
                      <div className="mr-2">
                        <Button
                          onClick={handleEdit}
                          className="flex items-center justify-center"
                        >
                          <Edit />
                        </Button>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleDelete(topic._id)}
                          className="flex items-center justify-center  bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  )}
                  {deleteMessage && (
                    <div className="mt-4 text-green-500">{deleteMessage}</div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      )}
    </div>
  );
}
