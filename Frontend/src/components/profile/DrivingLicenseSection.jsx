import React from 'react';
import { Upload } from 'lucide-react';
import './DrivingLicenseSection.css';

import licensePlaceholder from '../../assets/OIP.webp';

export default function DrivingLicenseSection({ formData, setFormData }) {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="license-section-title">Driving License</h5>
        <small className="license-last-updated">Last updated: 2 days ago</small>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="license-form-label">License Number</label>
            <input
              type="text"
              className="form-control"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="E.g. DL-2039401"
            />
          </div>
          <div>
            <label className="license-form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="license-form-label">License Document Preview</label>
          <div className="d-flex flex-wrap gap-3 license-preview-container">
            <div className="license-preview-item">
              <label
                htmlFor="license-front-upload"
                className="license-preview-front"
              >
                <input
                  id="license-front-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setFormData({ ...formData, licenseFrontPreview: url });
                  }}
                />
                <img
                  src={formData.licenseFrontPreview || licensePlaceholder}
                  alt="Front of License"
                  className="w-100 h-100 rounded"
                  style={{ objectFit: 'cover', opacity: 0.85 }}
                />
                <div className="license-preview-overlay">
                  <Upload size={24} />
                  <div className="license-preview-overlay-text">REPLACE FRONT</div>
                </div>
                <small className="license-preview-bottom-text">Front of License</small>
              </label>
            </div>
            <div className="license-preview-item">
              <label
                htmlFor="license-back-upload"
                className="license-preview-back"
              >
                <input
                  id="license-back-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setFormData({ ...formData, licenseBackPreview: url });
                  }}
                />
                {formData.licenseBackPreview ? (
                  <img
                    src={formData.licenseBackPreview}
                    alt="Back of License"
                    className="w-100 h-100 rounded"
                    style={{ objectFit: 'cover', opacity: 0.85 }}
                  />
                ) : (
                  <>
                    <Upload size={24} className="text-primary upload-icon" />
                    <small className="text-primary upload-text">UPLOAD BACK</small>
                    <small className="text-muted upload-subtext">PDF, JPG up to 5MB</small>
                    <small className="text-muted upload-required">Back of License Required</small>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
