import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import PrioritySelector from "@/components/molecules/PrioritySelector";

const QuickAddForm = ({ 
  onAdd,
  categories = [],
  className,
  isExpanded = false,
  onToggleExpanded,
  ...props 
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onAdd?.(formData);
      setFormData({
title: "",
        description: "",
        category: "Personal",
        priority: "medium"
      });
      onToggleExpanded?.(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      onToggleExpanded?.(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isExpanded) {
    return (
      <motion.button
        onClick={() => onToggleExpanded?.(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200",
          className
        )}
        {...props}
      >
        <ApperIcon name="Plus" size={20} />
        <span className="font-semibold">Add new task...</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      className={cn(
        "bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4",
        className
      )}
      {...props}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <Input
          ref={titleInputRef}
          label="Task Title"
          placeholder="What needs to be done?"
value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />

        {/* Description */}
        <Textarea
          label="Description (optional)"
          placeholder="Add more details..."
value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
{categories.map((category) => (
              <option key={category.Id} value={category.name_c || category.name}>
                {category.name_c || category.name}
              </option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <PrioritySelector
value={formData.priority}
              onChange={(priority) => handleChange("priority", priority)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">⌘ + Enter</kbd> to save
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onToggleExpanded?.(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
disabled={!formData.title.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Task
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default QuickAddForm;