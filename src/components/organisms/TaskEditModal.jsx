import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import PrioritySelector from "@/components/molecules/PrioritySelector";

const TaskEditModal = ({ 
  isOpen = false,
  task = null,
  categories = [],
  onSave,
  onCancel,
  className,
  ...props 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFormData({
title: (task.title_c || task.title) || "",
        description: (task.description_c || task.description) || "",
        category: (task.category_c || task.category) || "Personal",
        priority: (task.priority_c || task.priority) || "medium"
      });
    }
  }, [task]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      await onSave?.(formData);
    } catch (error) {
      console.error("Failed to save task:", error);
      setErrors({ submit: "Failed to save task. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      onCancel?.();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100",
            "max-h-[90vh] overflow-y-auto",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your task details
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title Input */}
              <Input
                ref={titleInputRef}
                label="Task Title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onKeyDown={handleKeyDown}
                error={errors.title}
                required
              />

              {/* Description */}
              <Textarea
                label="Description (optional)"
                placeholder="Add more details..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
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
                      {category.name}
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

              {/* Error Message */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="AlertCircle" size={16} className="text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{errors.submit}</span>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-gray-500">
                  Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">⌘ + Enter</kbd> to save
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskEditModal;