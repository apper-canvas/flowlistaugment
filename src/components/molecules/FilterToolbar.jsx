import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import CategoryPill from "@/components/molecules/CategoryPill";
import Button from "@/components/atoms/Button";

const FilterToolbar = ({ 
categories = [],
  selectedCategory = "all",
  onCategoryChange,
  selectedPriority = "all",
  onPriorityChange,
  showCompleted = false,
  onToggleCompleted,
  activeTasksCount = 0,
  completedTasksCount = 0,
  className,
  ...props 
}) => {
  const priorities = [
    { value: "all", label: "All", icon: "List" },
    { value: "high", label: "High", icon: "ArrowUp", color: "#EC4899" },
    { value: "medium", label: "Medium", icon: "Minus", color: "#F59E0B" },
    { value: "low", label: "Low", icon: "ArrowDown", color: "#3B82F6" }
  ];

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <CategoryPill
name="All"
            count={activeTasksCount + completedTasksCount}
            active={selectedCategory === "all"}
            onClick={() => onCategoryChange?.("all")}
            color="#6366F1"
          />
          {categories.map((category) => (
<CategoryPill
              key={category.Id}
              name={category.name_c || category.name}
              count={category.task_count_c || category.taskCount}
              color={category.color_c || category.color}
              active={selectedCategory === (category.name_c || category.name)}
              onClick={() => onCategoryChange?.(category.name)}
            />
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              onClick={() => onPriorityChange?.(priority.value)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1",
                selectedPriority === priority.value 
                  ? "text-white shadow-md" 
                  : "text-gray-600 bg-white border border-gray-200 hover:border-gray-300"
              )}
              style={{
                backgroundColor: selectedPriority === priority.value ? (priority.color || "#6366F1") : undefined,
                focusRingColor: priority.color || "#6366F1"
              }}
            >
              <ApperIcon 
                name={priority.icon} 
                size={14} 
                className={cn(
                  selectedPriority === priority.value ? "text-white" : "text-current"
                )}
                style={{ 
                  color: selectedPriority === priority.value ? "white" : (priority.color || "#6B7280") 
                }}
              />
              <span>{priority.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Completed Tasks Toggle */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Completed Tasks</h3>
<p className="text-xs text-gray-500">{completedTasksCount} completed</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleCompleted?.(!showCompleted)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              showCompleted ? "bg-gradient-to-r from-primary to-secondary" : "bg-gray-200"
            )}
          >
            <motion.span
              animate={{ x: showCompleted ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
            />
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Active tasks:</span>
<span className="font-semibold text-gray-900">{activeTasksCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
<span className="text-gray-600">Completed:</span>
          <span className="font-semibold text-success">{completedTasksCount}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;