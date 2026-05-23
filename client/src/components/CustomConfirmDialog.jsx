import React from "react";
import { motion } from "framer-motion";

const CustomConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.5,
        }}
      >
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
          {message}
        </h2>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomConfirmDialog;
