import { useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Category {
  id: string;
  name: string;
  parent?: string;
  productCount: number;
  icon: string;
}

const mockCategories: Category[] = [
  { id: 'CAT-001', name: 'Fruits', productCount: 84, icon: '🍎' },
  { id: 'CAT-002', name: 'Vegetables', productCount: 67, icon: '🥕' },
  { id: 'CAT-003', name: 'Dairy', productCount: 52, icon: '🥛' },
  { id: 'CAT-004', name: 'Bakery', productCount: 39, icon: '🍞' },
  { id: 'CAT-005', name: 'Meat & Seafood', productCount: 45, icon: '🥩' },
  { id: 'CAT-006', name: 'Beverages', productCount: 73, icon: '🧃' },
  { id: 'CAT-007', name: 'Snacks', productCount: 91, icon: '🍿' },
  { id: 'CAT-008', name: 'Frozen Foods', productCount: 56, icon: '🧊' },
];

export function CategoriesManagement() {
  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="font-['Manrope'] text-gray-600">Organize your product catalog</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1a3a2e] to-[#2a5f4a] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">All Categories</h2>
          <p className="font-['Manrope'] text-sm text-gray-600">{mockCategories.length} total categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-5 hover:border-[#1a3a2e]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <h3 className="font-['Crimson_Pro'] text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="font-['Manrope'] text-sm text-gray-600 mb-3">{category.id}</p>

              <div className="flex items-center justify-between">
                <span className="font-['Manrope'] text-sm text-gray-700">
                  <span className="font-bold text-[#1a3a2e]">{category.productCount}</span> products
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1a3a2e] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <FolderTree className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-['Crimson_Pro'] text-xl font-bold text-blue-900 mb-1">Hierarchical Categories</h3>
            <p className="font-['Manrope'] text-sm text-blue-700">Create parent-child category relationships for better organization</p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-900 rounded-xl font-['Manrope'] font-semibold hover:bg-blue-50 transition-colors shadow-sm">
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
}
