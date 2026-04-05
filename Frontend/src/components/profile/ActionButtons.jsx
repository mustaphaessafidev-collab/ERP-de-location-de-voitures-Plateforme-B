import React from 'react';
import { Save } from 'lucide-react';

export default function ActionButtons({ onSave, onCancel }) {
  return (
    <div className="border-t pt-3 flex justify-between items-center">
      <small className="text-gray-500 text-sm">Unsaved changes will be lost</small>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
        >
          <Save size={16} />
          Save All Changes
        </button>
      </div>
    </div>
  );
}
