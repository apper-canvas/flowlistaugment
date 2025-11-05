import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import TaskCard from "@/components/molecules/TaskCard";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  tasks = [],
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  searchQuery = "",
  selectedCategory = "all",
  selectedPriority = "all",
  showCompleted = false,
  className,
  ...props 
}) => {
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(task => 
        (task.title_c || task.title || "").toLowerCase().includes(query) ||
        (task.description_c || task.description || "").toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
filtered = filtered.filter(task => (task.category_c || task.category) === selectedCategory);
    }

    // Filter by priority
    if (selectedPriority !== "all") {
filtered = filtered.filter(task => (task.priority_c || task.priority) === selectedPriority);
    }

    // Filter by completion status
if (!showCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Sort tasks: incomplete first, then by priority, then by creation date
    filtered.sort((a, b) => {
      // Incomplete tasks first
if ((a.completed_c || a.completed) !== (b.completed_c || b.completed)) {
        return (a.completed_c || a.completed) ? 1 : -1;
      }

      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
const aPriority = priorityOrder[a.priority_c || a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // Finally by creation date (newest first)
return new Date(b.CreatedOn || b.createdAt) - new Date(a.CreatedOn || a.createdAt);
    });

    return filtered;
  }, [tasks, searchQuery, selectedCategory, selectedPriority, showCompleted]);

const activeTasks = filteredTasks.filter(task => !(task.completed_c || task.completed));
  const completedTasks = filteredTasks.filter(task => (task.completed_c || task.completed));

  if (filteredTasks.length === 0) {
    const getEmptyStateProps = () => {
      if (searchQuery.trim()) {
        return {
          title: "No tasks found",
          description: `No tasks match "${searchQuery}". Try adjusting your search or filters.`,
          icon: "Search",
          actionLabel: null
        };
      }
      
      if (selectedCategory !== "all" || selectedPriority !== "all") {
        return {
          title: "No tasks in this filter",
          description: "Try adjusting your filters or create a new task in this category.",
          icon: "Filter",
          actionLabel: null
        };
      }

      return {
        title: "No tasks yet",
        description: "Start your productivity journey by adding your first task. Keep it simple and actionable!",
        icon: "CheckSquare",
        actionLabel: null
      };
    };

    return (
      <div className={cn("flex-1 flex items-center justify-center", className)}>
        <Empty {...getEmptyStateProps()} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>Active Tasks</span>
              <span className="px-2 py-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium rounded-full">
                {activeTasks.length}
              </span>
            </h2>
          </div>
          
          <motion.div 
            className="space-y-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {activeTasks.map((task) => (
                <TaskCard
key={task.Id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Completed Tasks */}
      {showCompleted && completedTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>Completed Tasks</span>
              <span className="px-2 py-1 bg-gradient-to-r from-success to-emerald-600 text-white text-xs font-medium rounded-full">
                {completedTasks.length}
              </span>
            </h2>
          </div>
          
          <motion.div 
            className="space-y-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {completedTasks.map((task) => (
                <TaskCard
key={task.Id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskList;