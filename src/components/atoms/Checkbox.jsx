import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className,
  label,
  checked = false,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200",
            checked 
              ? "bg-gradient-to-r from-primary to-secondary border-transparent" 
              : "bg-white border-gray-300 hover:border-gray-400",
            disabled && "cursor-not-allowed opacity-50",
            !disabled && "hover:scale-110",
            className
          )}
          onClick={() => !disabled && onChange?.({ target: { checked: !checked } })}
        >
          {checked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="text-white animate-scale-in" 
            />
          )}
        </div>
      </div>
      {label && (
        <label 
          htmlFor={checkboxId}
          className={cn(
            "text-sm font-medium cursor-pointer select-none",
            checked ? "text-gray-900" : "text-gray-700",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && onChange?.({ target: { checked: !checked } })}
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;