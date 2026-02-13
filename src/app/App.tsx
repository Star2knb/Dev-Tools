import { useState } from "react";
import { ReadmeGenerator } from "./components/ReadmeGenerator";
import { DependencyChecker } from "./components/DependencyChecker";
import { FileText, Package, Sparkles } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"readme" | "dependencies">("readme");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Developer Tools
            </h1>
            <Sparkles className="w-8 h-8 text-pink-600 dark:text-pink-400" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional tools to generate beautiful READMEs and analyze package dependencies
          </p>
        </motion.div>

        {/* Custom Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 p-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("readme")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "readme"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/30"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>README Generator</span>
            </button>
            <button
              onClick={() => setActiveTab("dependencies")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "dependencies"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/30"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Dependency Checker</span>
            </button>
          </div>
        </motion.div>

        {/* Tab Content - Both always mounted, visibility controlled by CSS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={activeTab === "readme" ? "block" : "hidden"}>
            <ReadmeGenerator />
          </div>
          <div className={activeTab === "dependencies" ? "block" : "hidden"}>
            <DependencyChecker />
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
