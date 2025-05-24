"use client";

import React, { useState } from 'react';

// Data Structures
interface MCQBack {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface FlipCardQuestion {
  type: 'mcq' | 'frq';
  front: string;
  back: string | MCQBack;
  sampleAnswer?: string;
}

interface VideoUnit {
  id: string;
  videoUrl: string;
  title: string;
  questions: FlipCardQuestion[];
}

// FlipCard Component Props
// interface FlipCardComponentProps extends FlipCardQuestion {} // Remove this interface

const FlipCard: React.FC<FlipCardQuestion> = ({ front, back, type, sampleAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frqAnswer, setFrqAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFrqAnswer, setShowFrqAnswer] = useState(false);

  const handleOptionClick = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    // Prevent card from flipping back
    if (isFlipped) {
      setIsFlipped(true);
    }
  };

  return (
    <div
      className="w-full max-w-xl min-h-[26rem] flex-shrink-0 cursor-pointer perspective flex flex-col"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`w-full flex-grow relative preserve-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute w-full h-full backface-hidden p-6 flex items-center justify-center text-center bg-white rounded-lg shadow-lg">
          <p className="text-gray-700 text-lg">{front}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 p-6 flex flex-col justify-center items-center overflow-y-auto bg-white rounded-lg shadow-lg">
          {type === 'mcq' && typeof back === 'object' && (
            <>
              <p className="text-gray-700 mb-3 text-sm font-semibold text-center">{(back as MCQBack).question}</p>
              <div className="w-full space-y-2">
                {(back as MCQBack).options
                  .filter((_, index) => {
                    if (!showExplanation) return true; // Show all options if explanation is not visible
                    // Show selected answer or correct answer
                    return index === selectedAnswer || index === (back as MCQBack).correctAnswerIndex;
                  })
                  .map((option) => {
                    const mcqData = back as MCQBack; // Type assertion for clarity
                    const originalIndex = mcqData.options.indexOf(option);

                    let currentBorderClasses = 'border-gray-200';
                    if (showExplanation) {
                      const isCorrectOption = originalIndex === mcqData.correctAnswerIndex;
                      const isSelectedOption = originalIndex === selectedAnswer;

                      if (isSelectedOption) {
                        currentBorderClasses = isCorrectOption 
                          ? 'border-green-500 ring-2 ring-green-200' 
                          : 'border-red-500 ring-2 ring-red-200';
                      } else if (isCorrectOption) { 
                        currentBorderClasses = 'border-green-500 ring-2 ring-green-200';
                      }
                    }

                    return (
                      <div
                        key={originalIndex}
                        className={`w-full p-2.5 bg-white rounded-md border 
                                    ${currentBorderClasses} 
                                    ${!showExplanation ? 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer' : 'cursor-default'} 
                                    ${showExplanation && !(originalIndex === selectedAnswer || originalIndex === mcqData.correctAnswerIndex) ? 'hidden' : ''}
                                    transition-all duration-300 text-left text-sm text-gray-700`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!showExplanation) { // only allow selection if explanation not shown
                            handleOptionClick(originalIndex);
                          }
                        }}
                      >
                        {option}
                      </div>
                    );
                  })}
              </div>
              {showExplanation && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 w-full">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{(back as MCQBack).explanation}</p>
                </div>
              )}
            </>
          )}
          {type === 'frq' && typeof back === 'string' && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-gray-700 whitespace-pre-line text-sm text-center mb-4">{back}</p>
              {!showFrqAnswer ? (
                <>
                  <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm text-gray-700 resize-none"
                    placeholder="Type your answer here..."
                    value={frqAnswer}
                    onChange={(e) => {
                      e.stopPropagation();
                      setFrqAnswer(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-150 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFrqAnswer(true);
                    }}
                  >
                    Check Answer
                  </button>
                </>
              ) : (
                <div className="w-full text-left">
                  {frqAnswer && (
                     <div className="mt-2 mb-4 p-3 bg-blue-50 rounded-md border border-blue-200 w-full">
                        <p className="text-sm text-gray-700 whitespace-pre-line"><strong>Your Answer:</strong> {frqAnswer}</p>
                     </div>
                  )}
                  <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 w-full">
                    <p className="text-sm text-gray-700 whitespace-pre-line"><strong>Sample Answer:</strong> { sampleAnswer ? sampleAnswer : 'Sample answer not available.' }</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const videoUnitsData: VideoUnit[] = [
  {
    id: "marginal-cost-average-cost-1",
    videoUrl: "https://apdojovideos.s3.ap-southeast-2.amazonaws.com/marginal+and+average.mp4",
    title: "Marginal Cost and Average Total Cost",
    questions: [
      {
        type: 'mcq',
        front: 'The MC curve has to cross ATC at ATC\'s lowest point.',
        back: {
          question: 'Which of the following best explains why marginal cost intersects average total cost at its minimum point?',
          options: [
            'A) Because ATC must equal MC at all levels of output',
            'B) Because increasing marginal costs always reduce ATC',
            'C) Because when MC is below ATC, it pulls ATC down, and when it\'s above, it pulls ATC up',
            'D) Because average fixed costs are constant across output levels'
          ],
          correctAnswerIndex: 2,
          explanation: 'Average total cost (ATC) is minimized when it equals marginal cost (MC). If MC is below ATC, ATC is falling. If MC is above ATC, ATC is rising. Therefore, MC must intersect ATC at its lowest point.'
        }
      },
      {
        type: 'frq',
        front:
          'If our marginal cost is less than our ATC, what\'s going to happen if we produce one more? Our average total cost is going to get pulled down.',
        back: 'Suppose a firm is currently producing 10 units with an ATC of $8 and a marginal cost of $6 for the 11th unit.\na. Will the average total cost increase or decrease if the firm produces the 11th unit? Explain.',
        sampleAnswer: 'a. The average total cost will decrease. This is because the marginal cost of producing the 11th unit ($6) is less than the average total cost of producing the first 10 units ($8). When the cost of an additional unit is less than the current average, it pulls the average down.'
      },
      {
        type: 'frq',
        front:
          'Let\'s say that Steph Curry is averaging right now 30 points per game. Then he scores 15. What happens to his average?',
        back: 'Use the analogy to explain what happens to average total cost when a firm\'s marginal cost is below its current average.\nInclude a specific numerical example similar to the Steph Curry case.',
        sampleAnswer: 'When a firm\'s marginal cost is below its current average total cost, producing an additional unit will pull the average total cost down. This is analogous to Steph Curry\'s scoring average. If his average is 30 points per game and he scores 15 points in the next game (his marginal score), his overall average will decrease.\n\nNumerical Example: Suppose a firm produces 5 units with an ATC of $20. The marginal cost of the 6th unit is $14. Since $14 (MC) < $20 (ATC), the ATC will fall when the 6th unit is produced.'
      },
      {
        type: 'mcq',
        front:
          'The marginal score was higher than the average. So, Steph Curry—same thing applies to production costs.',
        back: {
          question: 'When a firm\'s marginal cost is greater than its average total cost, what happens to the average total cost?',
          options: [
            'A) It remains constant',
            'B) It decreases',
            'C) It increases',
            'D) It equals marginal cost'
          ],
          correctAnswerIndex: 2,
          explanation: "If the cost of producing one more unit (marginal cost) is higher than the current average cost of all units produced so far (average total cost), then producing that additional unit will pull the average total cost upwards. For a non-economics example, if a student's average test score is 85, and their score on the next (marginal) test is 95, their overall average will increase."
        }
      }
    ]
  }
];

const FlipStudyPage: React.FC = () => {
  // For now, always use the first video unit.
  // Later, this could be dynamic (e.g., selected by the user or via routing).
  const currentVideoUnit = videoUnitsData[0];

  if (!currentVideoUnit) {
    return <div className="p-8 text-center text-red-500">No video unit data found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      {/* Video Player */}
      <div className="w-full max-w-3xl mb-8">
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video 
            key={currentVideoUnit.videoUrl}
            className="w-full h-full"
            src={currentVideoUnit.videoUrl} 
            controls 
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center my-10 w-full max-w-3xl px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 sm:text-5xl">
          FlipStudy
        </h2>
        <p className="mt-3 text-lg text-gray-600 sm:mt-4 sm:text-xl">
          See key points from the video and answer related AP-style questions.
        </p>
      </div>

      {/* Flipcards Column */}
      <div className="w-full flex flex-col items-center space-y-6 px-4">
        {currentVideoUnit.questions.map((question, index) => (
          <FlipCard 
            key={`${currentVideoUnit.id}-q-${index}`}
            type={question.type} 
            front={question.front} 
            back={question.back} 
            sampleAnswer={question.sampleAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default FlipStudyPage;

// CSS utility classes (ensure these are in your global CSS file)
/*
.perspective {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
*/ 