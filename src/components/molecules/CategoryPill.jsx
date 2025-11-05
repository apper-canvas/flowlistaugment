import React from "react";
import { cn } from "@/utils/cn";

const CategoryPill = ({ 
  className,
  name,
  color = "#6366F1",
  count,
  active = false,
  onClick,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
        "hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1",
        active 
          ? "text-white shadow-lg" 
          : "text-gray-700 bg-white border border-gray-200 hover:border-gray-300",
        className
      )}
      style={{
        backgroundColor: active ? color : undefined,
        borderColor: active ? color : undefined,
        focusRingColor: color
      }}
      {...props}
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          active ? "bg-white bg-opacity-30" : "bg-current"
        )}
        style={{ 
          backgroundColor: active ? "rgba(255,255,255,0.3)" : color 
        }}
      />
      <span>{name}</span>
      {count !== undefined && (
        <span className={cn(
          "px-1.5 py-0.5 rounded-full text-xs font-semibold",
          active ? "bg-white bg-opacity-20 text-white" : "bg-gray-100 text-gray-600"
        )}>
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryPill;