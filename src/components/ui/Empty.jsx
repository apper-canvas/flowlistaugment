import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction = null,
  icon = "Smile"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-6"
    >
      {/* Empty State Illustration */}
      <div className="space-y-6">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-gray-400" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action */}
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            {actionLabel}
          </motion.button>
        )}
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full" />
        <div className="absolute top-20 right-20 w-2 h-2 bg-secondary rounded-full" />
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-accent rounded-full" />
        <div className="absolute bottom-10 right-10 w-5 h-5 bg-primary rounded-full" />
      </div>
    </motion.div>
  );
};

export default Empty;