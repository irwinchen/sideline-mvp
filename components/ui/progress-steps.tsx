"use client";

import { CheckCircle2 } from "lucide-react";

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
    <div className="w-full py-4 sm:py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol
            role="list"
            className="flex items-center justify-between gap-4 sm:gap-8"
          >
            {steps.map((step, index) => {
              const isCompleted = step.completed || currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <li
                  key={step.id}
                  className={`relative flex-1 ${
                    index !== steps.length - 1 ? "pr-8 sm:pr-12" : ""
                  }`}
                >
                  <div className="flex items-center justify-start">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-primary text-white"
                          : isCurrent
                          ? "border-2 border-primary bg-white"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            isCurrent ? "text-primary" : "text-gray-500"
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        isCompleted || isCurrent
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`absolute right-0 top-4 h-0.5 w-full max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-3rem)] ${
                        isCompleted ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ProgressSteps;
