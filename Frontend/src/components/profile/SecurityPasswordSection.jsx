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
      <h5 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>Security & Password</h5>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Current Password</label>
          <input
            type="password"
            className="form-control"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500' }}>New Password</label>
          <input
            type="password"
            className="form-control"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Min. 8 characters"
          />
          <div className="mt-2" style={{ height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${strengthPercentage}%`,
                background: 'linear-gradient(to right, #dc3545, #ffc107, #28a745)',
                transition: 'all 0.3s',
              }}
            ></div>
          </div>
        </div>

        <div className="col-md-6" style={{ position: 'relative' }}>
          <button
            className="btn btn-link p-0 text-primary d-flex align-items-center gap-1 mt-2"
            onClick={() => setShowPasswordTips(!showPasswordTips)}
            style={{ fontSize: '0.9rem', textDecoration: 'none' }}
          >
            <AlertCircle size={16} />
            Security Tips
          </button>
          {showPasswordTips && (
            <div
              className="border bg-light rounded p-3 position-absolute"
              style={{
                top: '100%',
                right: 0,
                width: '250px',
                zIndex: 1000,
                marginTop: '0.5rem',
                backgroundColor: '#e7f3ff',
                borderColor: '#b3d9ff',
              }}
            >
              {securityTips.map((tip, idx) => (
                <div key={idx} className="d-flex align-items-start gap-2 mb-2">
                  <div
                    style={{
                      minWidth: '20px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: tip.met ? '#d4edda' : '#e0e0e0',
                      flexShrink: 0,
                    }}
                  >
                    {tip.met && <Check size={14} className="text-success" />}
                  </div>
                  <small style={{ color: tip.met ? '#155724' : '#666', fontSize: '0.8rem' }}>
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
