import React from 'react';
import { Camera, Save, Trash2, Upload } from 'lucide-react';

export default function ProfilePhotoSection({ formData, setFormData, onSaveProfilePhoto, savingPhoto }) {
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo de profil doit etre inferieure a 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;

      setFormData({
        ...formData,
        profilePhotoPreview: dataUrl,
        profilePhotoData: dataUrl,
        profilePhotoName: file.name,
        profilePhotoMimeType: file.type || 'application/octet-stream',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setFormData({
      ...formData,
      profilePhotoPreview: null,
      profilePhotoData: '',
      profilePhotoName: '',
      profilePhotoMimeType: '',
    });
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Camera size={20} className="text-gray-600" />
          <h5 className="text-base font-bold text-gray-800">Photo de profil</h5>
        </div>
        <button
          onClick={onSaveProfilePhoto}
          disabled={savingPhoto}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {savingPhoto ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="h-32 w-32 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
          {formData.profilePhotoPreview ? (
            <img
              src={formData.profilePhotoPreview}
              alt="Photo de profil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-semibold text-blue-600">
              {(formData.nom_complet || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-3">
            Ajoutez une photo de profil pour personnaliser votre compte.
          </p>
          <div className="flex flex-wrap gap-3">
            <label
              htmlFor="profile-photo-upload"
              className="inline-flex items-center gap-2 cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              Choisir une photo
            </label>
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {formData.profilePhotoPreview ? (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            ) : null}
          </div>
          <p className="text-xs text-gray-500 mt-3">Formats acceptes: JPG, PNG, WEBP. Taille max: 5MB.</p>
        </div>
      </div>
    </div>
  );
}
