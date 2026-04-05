import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export default function SecurityPasswordSection({ formData, setFormData }) {
  const [showPasswordTips, setShowPasswordTips] = useState(false);

  const passwordStrength = formData.newPassword.length;
  const strengthPercentage = Math.min((passwordStrength / 12) * 100, 100);

  const securityTips = [
    { text: 'Use uppercase & lowercase letters', met: /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) },
    { text: 'Include at least one number', met: /\d/.test(formData.newPassword) },
    { text: 'Add a special character (!@#)', met: /[!@#$%^&*]/.test(formData.newPassword) },
  ];

  return (
    <div className="mb-4">
      <h5 className="text-base font-bold text-gray-800 mb-4">Security & Password</h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Min. 8 characters"
          />
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${strengthPercentage}%`,
                background: 'linear-gradient(to right, #dc3545, #ffc107, #28a745)',
              }}
            ></div>
          </div>
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => setShowPasswordTips(!showPasswordTips)}
          >
            <AlertCircle size={16} />
            Security Tips
          </button>
          {showPasswordTips && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-blue-50 border border-blue-200 rounded-lg p-3 z-10">
              {securityTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tip.met ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    {tip.met && <Check size={14} className="text-green-600" />}
                  </div>
                  <small className={`text-xs ${
                    tip.met ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {tip.text}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
