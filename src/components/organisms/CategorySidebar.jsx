import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import FilterToolbar from "@/components/molecules/FilterToolbar";
import Button from "@/components/atoms/Button";

const CategorySidebar = ({ 
  categories = [],
  selectedCategory = "all",
  onCategoryChange,
  selectedPriority = "all",
  onPriorityChange,
  showCompleted = false,
  onToggleCompleted,
  activeTasksCount = 0,
  completedTasksCount = 0,
  isMobileOpen = false,
  onMobileClose,
  className,
  ...props 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={16} className="text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold gradient-text">FlowList</h1>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
          
          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
        
        {!isCollapsed && (
          <p className="text-sm text-gray-500 mt-2">
            Organize your tasks and stay productive
          </p>
        )}
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {isCollapsed ? (
            /* Collapsed State - Icon Only */
            <div className="space-y-3">
              {/* All Tasks */}
              <button
                onClick={() => onCategoryChange?.("all")}
                className={cn(
                  "w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
                  selectedCategory === "all" 
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <ApperIcon name="List" size={20} />
              </button>
              
              {/* Categories */}
              {categories.map((category) => (
                <button
                  key={category.Id}
                  onClick={() => onCategoryChange?.(category.name)}
                  className={cn(
                    "w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
                    selectedCategory === category.name 
                      ? "text-white shadow-lg" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  style={{
                    backgroundColor: selectedCategory === category.name ? category.color : undefined
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </button>
              ))}
            </div>
          ) : (
            /* Expanded State - Full Filters */
            <FilterToolbar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              selectedPriority={selectedPriority}
              onPriorityChange={onPriorityChange}
              showCompleted={showCompleted}
              onToggleCompleted={onToggleCompleted}
              activeTasksCount={activeTasksCount}
              completedTasksCount={completedTasksCount}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 border-t border-gray-100">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Stay focused, stay productive
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary opacity-40"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: isCollapsed ? 80 : 320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "hidden lg:block bg-white border-r border-gray-100 h-screen flex-shrink-0",
          className
        )}
        {...props}
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategorySidebar;