import React, { useState, useEffect, Suspense } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import QuickAddForm from "@/components/molecules/QuickAddForm";
import TaskList from "@/components/organisms/TaskList";
import TaskEditModal from "@/components/organisms/TaskEditModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import taskService from "@/services/api/taskService";

const Dashboard = () => {
  const {
    categories,
    tasks,
    setTasks,
    selectedCategory,
    selectedPriority,
    showCompleted,
    loadTasks,
    updateCategoryTaskCounts
  } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tasks.length === 0) {
      initializeDashboard();
    }
  }, []);

  const initializeDashboard = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loadTasks();
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Dashboard initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      updateCategoryTaskCounts([newTask, ...tasks]);
      toast.success("Task added successfully! 🎉");
      setIsQuickAddExpanded(false);
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task. Please try again.");
      throw error;
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.Id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed
      });
      
      setTasks(prevTasks =>
        prevTasks.map(t => t.Id === taskId ? updatedTask : t)
      );
      
      if (updatedTask.completed) {
        if (task.priority === "high") {
          toast.success("🎉 High-priority task completed! Great work!");
        } else {
          toast.success("✅ Task completed!");
        }
      } else {
        toast.info("Task moved back to active");
      }
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prevTasks =>
        prevTasks.map(t => t.Id === editingTask.Id ? updatedTask : t)
      );
      updateCategoryTaskCounts(tasks.map(t => t.Id === editingTask.Id ? updatedTask : t));
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task. Please try again.");
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.Id !== taskId));
      updateCategoryTaskCounts(tasks.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handleRetry = () => {
    initializeDashboard();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTasks.length} active • {completedTasks.length} completed
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{activeTasks.length}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{completedTasks.length}</div>
              <div className="text-xs text-gray-500">Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 space-y-4">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        {/* Quick Add Form */}
        <QuickAddForm
          onAdd={handleAddTask}
          categories={categories}
          isExpanded={isQuickAddExpanded}
          onToggleExpanded={setIsQuickAddExpanded}
        />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedPriority={selectedPriority}
          showCompleted={showCompleted}
        />
      </div>

      {/* Edit Modal */}
      <TaskEditModal
        isOpen={!!editingTask}
        task={editingTask}
        categories={categories}
        onSave={handleSaveTask}
        onCancel={() => setEditingTask(null)}
      />
    </div>
  );
};

export default Dashboard;