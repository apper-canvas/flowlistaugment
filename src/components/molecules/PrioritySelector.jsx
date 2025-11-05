import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const PrioritySelector = ({ 
  className,
  value = "medium",
  onChange,
  options = [
    { value: "low", label: "Low", color: "#3B82F6", icon: "ArrowDown" },
    { value: "medium", label: "Medium", color: "#F59E0B", icon: "Minus" },
    { value: "high", label: "High", color: "#EC4899", icon: "ArrowUp" }
  ],
  ...props 
}) => {
  return (
    <div className={cn("flex space-x-1", className)} {...props}>
      {options.map((option) => {
        const isActive = value === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange?.(option.value)}
            className={cn(
              "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1",
              isActive 
                ? "text-white shadow-md" 
                : "text-gray-600 bg-white border border-gray-200 hover:border-gray-300"
            )}
            style={{
              backgroundColor: isActive ? option.color : undefined,
              focusRingColor: option.color
            }}
          >
            <ApperIcon 
              name={option.icon} 
              size={14} 
              className={cn(
                isActive ? "text-white" : "text-current"
              )}
              style={{ color: isActive ? "white" : option.color }}
            />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PrioritySelector;