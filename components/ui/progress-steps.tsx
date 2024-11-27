"use client";

import { CheckIcon } from "lucide-react";

interface Step {
  id: number;
  label: string;
  completed?: boolean;
  current?: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="w-full flex justify-center py-8 sm:py-12">
      <div className="w-full max-w-3xl px-4">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = step.completed || currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className={`
                  flex-1 flex flex-col items-center relative
                  ${
                    !isLast
                      ? "after:content-[''] after:absolute after:top-4 after:left-[calc(50%+16px)] after:w-full after:h-[2px] after:-translate-y-1/2 " +
                        (isCompleted ? "after:bg-black" : "after:bg-gray-200")
                      : ""
                  }
                `}
                style={{
                  minWidth: "120px",
                }}
              >
                <div
                  className={`
                    relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2
                    transition-colors duration-300
                    ${
                      isCompleted
                        ? "border-black bg-black text-white"
                        : isCurrent
                        ? "border-black bg-white"
                        : "border-gray-200 bg-gray-100"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-4 w-4 text-white" />
                  ) : (
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "font-bold text-black"
                          : "font-medium text-gray-500"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-sm font-medium text-center px-2
                    ${isCompleted || isCurrent ? "text-black" : "text-gray-500"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
