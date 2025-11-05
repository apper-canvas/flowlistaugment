import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-md"
      >
        {/* 404 Illustration */}
        <div className="space-y-6">
          {/* Large 404 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-8xl font-black gradient-text"
          >
            404
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <ApperIcon name="SearchX" size={40} className="text-white" />
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 leading-relaxed">
            Looks like this task got completed and archived! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            className="w-full"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Tasks
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 right-20 w-5 h-5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "3s" }} />
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;