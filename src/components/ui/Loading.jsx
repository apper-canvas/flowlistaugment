import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold gradient-text">FlowList</h2>
        </motion.div>

        {/* Skeleton Content */}
        <div className="space-y-6 max-w-4xl mx-auto px-6">
          {/* Sidebar Skeleton */}
          <div className="flex gap-6">
            <div className="w-80 space-y-4">
              <div className="h-12 bg-white rounded-xl shadow-sm animate-pulse" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-white rounded-lg shadow-sm animate-pulse" />
                ))}
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-16 bg-white rounded-xl shadow-sm animate-pulse" />
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-20 bg-white rounded-xl shadow-sm animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 font-medium"
        >
          Loading your tasks...
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;