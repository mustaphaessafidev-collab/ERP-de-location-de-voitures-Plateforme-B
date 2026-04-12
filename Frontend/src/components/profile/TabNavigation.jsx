import React from 'react';
import { User, FileText, Settings } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'license', label: 'Driving License', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex gap-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors duration-200 ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              style={{
                fontWeight: activeTab === tab.id ? '600' : '500',
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
