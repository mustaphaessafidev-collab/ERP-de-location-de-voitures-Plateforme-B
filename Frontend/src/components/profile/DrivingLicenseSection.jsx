import React from 'react';
import { Upload } from 'lucide-react';
import './DrivingLicenseSection.css';

import licensePlaceholder from '../../assets/OIP.webp';

export default function DrivingLicenseSection({ formData, setFormData }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-lg font-semibold text-gray-800">Driving License</h5>
        <small className="text-sm text-gray-500">Last updated: 2 days ago</small>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="E.g. DL-2039401"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Document Preview</label>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <label
                htmlFor="license-front-upload"
                className="block cursor-pointer"
              >
                <input
                  id="license-front-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setFormData({ ...formData, licenseFrontPreview: url });
                  }}
                />
                <div className="relative w-32 h-20">
                  <img
                    src={formData.licenseFrontPreview || licensePlaceholder}
                    alt="Front of License"
                    className="w-full h-full rounded object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload size={24} className="text-white" />
                    <div className="text-white text-xs ml-2">REPLACE FRONT</div>
                  </div>
                </div>
                <small className="text-xs text-gray-600 mt-1 block">Front of License</small>
              </label>
            </div>
            <div className="relative">
              <label
                htmlFor="license-back-upload"
                className="block cursor-pointer"
              >
                <input
                  id="license-back-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setFormData({ ...formData, licenseBackPreview: url });
                  }}
                />
                <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center">
                  {formData.licenseBackPreview ? (
                    <img
                      src={formData.licenseBackPreview}
                      alt="Back of License"
                      className="w-full h-full rounded object-cover opacity-85"
                    />
                  ) : (
                    <>
                      <Upload size={24} className="text-blue-600" />
                      <small className="text-blue-600 text-xs mt-1">UPLOAD BACK</small>
                      <small className="text-gray-500 text-xs">PDF, JPG up to 5MB</small>
                      <small className="text-gray-500 text-xs">Back of License Required</small>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
