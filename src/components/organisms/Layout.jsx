import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import ApperIcon from "@/components/ApperIcon";
import categoryService from "@/services/api/categoryService";
import taskService from "@/services/api/taskService";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadCategories();
    loadTasks();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const tasksData = await taskService.getAll();
      setTasks(tasksData);
      updateCategoryTaskCounts(tasksData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const updateCategoryTaskCounts = (tasksData) => {
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
taskCount: tasksData.filter(task => (task.category_c || task.category) === (category.name_c || category.name)).length
      }))
    );
  };

const activeTasksCount = tasks.filter(task => !(task.completed_c || task.completed)).length;
  const completedTasksCount = tasks.filter(task => (task.completed_c || task.completed)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex">
      {/* Sidebar */}
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        showCompleted={showCompleted}
        onToggleCompleted={setShowCompleted}
        activeTasksCount={activeTasksCount}
        completedTasksCount={completedTasksCount}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg"
          >
            <ApperIcon name="Menu" size={20} />
            <span className="font-semibold">Filters</span>
          </motion.button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">FlowList</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet context={{
            categories,
            setCategories,
            tasks,
            setTasks,
            selectedCategory,
            setSelectedCategory,
            selectedPriority,
            setSelectedPriority,
            showCompleted,
            setShowCompleted,
            loadTasks,
            updateCategoryTaskCounts
          }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;