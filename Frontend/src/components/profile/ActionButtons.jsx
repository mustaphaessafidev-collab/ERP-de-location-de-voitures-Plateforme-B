import React from 'react';
import { Save } from 'lucide-react';

export default function ActionButtons({ onSave, onCancel }) {
  return (
    <div className="border-top pt-3 d-flex justify-content-between align-items-center">
      <small className="text-muted">Unsaved changes will be lost</small>
      <div className="d-flex gap-2">
        <button
          onClick={onCancel}
          className="btn btn-outline-secondary"
          style={{ fontSize: '0.9rem' }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="btn btn-primary d-flex align-items-center gap-2"
          style={{ fontSize: '0.9rem', fontWeight: '500' }}
        >
          <Save size={16} />
          Save All Changes
        </button>
      </div>
    </div>
  );
}
