import React from 'react';
import { Save, Upload } from 'lucide-react';
import './DrivingLicenseSection.css';

import licensePlaceholder from '../../assets/OIP.webp';

export default function DrivingLicenseSection({ formData, setFormData, onSaveDrivingLicense, savingLicense }) {
  const handleDocumentChange = (side) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Chaque fichier du permis doit faire 5 Mo maximum');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;

      setFormData({
        ...formData,
        ...(side === 'front'
          ? {
              licenseFrontPreview: dataUrl,
              licenseFrontData: dataUrl,
              licenseFrontName: file.name,
              licenseFrontMimeType: file.type || 'application/octet-stream',
            }
          : {
              licenseBackPreview: dataUrl,
              licenseBackData: dataUrl,
              licenseBackName: file.name,
              licenseBackMimeType: file.type || 'application/octet-stream',
            }),
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-lg font-semibold text-gray-800">Permis de conduire</h5>
        <button
          onClick={onSaveDrivingLicense}
          disabled={savingLicense}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {savingLicense ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={16} />
              Enregistrer le permis
            </>
          )}
        </button>
      </div>
      <div className="flex justify-end mb-3">
        <small className="text-sm text-gray-500">Derniere mise a jour : il y a 2 jours</small>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Numero du permis</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="Ex. DL-2039401"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Apercu du document du permis</label>
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
                  onChange={handleDocumentChange('front')}
                />
                <div className="relative w-32 h-20">
                  <img
                    src={formData.licenseFrontPreview || licensePlaceholder}
                    alt="Avant du permis"
                    className="w-full h-full rounded object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload size={24} className="text-white" />
                    <div className="text-white text-xs ml-2">REMPLACER AVANT</div>
                  </div>
                </div>
                <small className="text-xs text-gray-600 mt-1 block">Avant du permis</small>
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
                  onChange={handleDocumentChange('back')}
                />
                <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center">
                  {formData.licenseBackPreview ? (
                    <img
                      src={formData.licenseBackPreview}
                      alt="Arriere du permis"
                      className="w-full h-full rounded object-cover opacity-85"
                    />
                  ) : (
                    <>
                      <Upload size={24} className="text-blue-600" />
                      <small className="text-blue-600 text-xs mt-1">TELECHARGER ARRIERE</small>
                      <small className="text-gray-500 text-xs">PDF, JPG jusqu'a 5 Mo</small>
                      <small className="text-gray-500 text-xs">Arriere du permis requis</small>
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
