import React from 'react';

export default function PersonalDetailsSection({ formData, setFormData }) {
  return (
    <div className="mb-4">
      <h5 className="mb-3" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>Personal Details</h5>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500' }}>First Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter first name"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Last Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Phone Number</label>
          <div className="input-group">
            <span className="input-group-text bg-light" style={{ color: '#666' }}>+1</span>
            <input
              type="tel"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="555-0123"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
