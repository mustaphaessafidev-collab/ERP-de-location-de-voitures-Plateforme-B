import React from 'react';
import { User, FileText, Settings } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'license', label: 'Driving License', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="border-bottom mb-4" style={{ borderColor: '#e0e0e0' }}>
      <div className="d-flex gap-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-link p-0 pb-3 border-0 d-flex align-items-center gap-2 ${
                activeTab === tab.id ? 'text-primary border-bottom-3' : 'text-secondary'
              }`}
              style={{
                borderBottom: activeTab === tab.id ? '3px solid #007bff' : 'none',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? '600' : '500',
                color: activeTab === tab.id ? '#007bff' : '#666',
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
