import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const TaskCard = ({ 
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
  ...props 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleToggleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    
    // Add celebration animation for high-priority tasks
    if (!task.completed && task.priority === "high") {
      // Create confetti effect
      createConfetti();
    }
    
    // Call the toggle function
    await onToggleComplete?.(task.Id);
    
    setTimeout(() => {
      setIsCompleting(false);
    }, 400);
  };

  const createConfetti = () => {
    const confettiCount = 20;
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.width = "1px";
    container.style.height = "1px";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "6px";
      confetti.style.height = "6px";
      confetti.style.backgroundColor = ["#EC4899", "#6366F1", "#8B5CF6", "#10B981", "#F59E0B"][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = "50%";
      confetti.style.left = `${Math.random() * 400 - 200}px`;
      confetti.style.top = `${Math.random() * 400 - 200}px`;
      confetti.className = "confetti-burst";
      container.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(container);
    }, 600);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#EC4899";
      case "medium": return "#F59E0B";
      case "low": return "#3B82F6";
      default: return "#6B7280";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Work": "#6366F1",
      "Personal": "#8B5CF6",
      "Health": "#10B981",
      "Shopping": "#F59E0B",
      "Learning": "#EC4899",
    };
    return colors[category] || "#6B7280";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={cn(
        "group bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200",
        "hover:shadow-md hover:border-gray-200",
        task.completed && "opacity-60",
        isCompleting && "task-complete-animation",
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-base font-semibold text-gray-900 mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-2 line-clamp-2",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Created {format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                {task.completedAt && (
                  <>
                    <span>•</span>
                    <span>Completed {format(new Date(task.completedAt), "MMM d, yyyy")}</span>
                  </>
                )}
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex-shrink-0 ml-2">
              <Badge
                variant={task.priority}
                size="sm"
                style={{ 
                  backgroundColor: getPriorityColor(task.priority),
                  color: "white"
                }}
              >
                {task.priority}
              </Badge>
            </div>
          </div>

          {/* Category and Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <div 
                className="px-2 py-1 rounded-md text-xs font-medium text-white"
                style={{ backgroundColor: getCategoryColor(task.category) }}
              >
                {task.category}
              </div>
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center space-x-1"
                >
                  <button
                    onClick={() => onEdit?.(task)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </button>
                  
                  <button
                    onClick={() => onDelete?.(task.Id)}
                    className="p-1.5 text-gray-400 hover:text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;