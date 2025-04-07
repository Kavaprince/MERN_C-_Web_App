import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SlideView({ topic, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const slides = [
    {
      title: "Learning Objectives",
      content: (
        <ul className="list-disc list-inside animate-fade-in">
          {topic.learning_objectives.split("\n").map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Description",
      content: (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 leading-relaxed space-y-4 animate-fade-in">
          {topic.description.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-2">
              {paragraph}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: "Code Snippet",
      content: (
        <pre className="bg-gray-100 p-3 rounded-md overflow-auto">
          <code className="font-mono animate-fade-in">
            {topic.code_snippet}
          </code>
        </pre>
      ),
    },
    {
      title: "Explanation",
      content: (
        <div className="bg-gray-100 p-3 rounded-md border border-gray-300 whitespace-pre-line leading-relaxed font-mono animate-fade-in">
          {topic.explanation}
        </div>
      ),
    },
    {
      title: "Completed",
      content: (
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">
            Congratulations!
          </h2>
          <p className="mb-4 animate-fade-in">You have completed the topic.</p>
          <div className="">
            <Button
              onClick={() => setCurrentSlide(0)}
              className="mb-2 mr-5 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate(`/questions?topicId=${topic._id}`)}
              className="mb-2 ml-5"
            >
              Attempt a Question
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="slide-view-container px-6 py-8 bg-gray-50 min-h-screen flex flex-col justify-center items-center text-left relative animate-slide-up">
      {/* Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Progress Bar / Steppers */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 ${
                index <= currentSlide ? "bg-primary" : "bg-gray-300"
              } rounded-full`}
            />
          ))}
        </div>
        <div className="flex justify-between text-sm mt-2 ">
          {slides.map((slide, index) => (
            <span
              key={index}
              className={`text-center ${
                index === currentSlide ? "text-primary" : "text-gray-500"
              }`}
            >
              Step {index + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="slide-view-content p-6 bg-white shadow-lg rounded-lg relative max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {slides[currentSlide].title}
        </h2>
        <div className="text-gray-700">{slides[currentSlide].content}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center w-full max-w-2xl mt-6">
        {currentSlide > 0 && (
          <Button
            onClick={handlePrevious}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>
        )}
        {currentSlide < slides.length - 1 && (
          <Button
            onClick={handleNext}
            className="flex items-center bg-primary hover:bg-primary-600 text-white"
          >
            Next
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
