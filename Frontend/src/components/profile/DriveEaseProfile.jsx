import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import PersonalDetailsSection from './PersonalDetailsSection';
import ProfilePhotoSection from './ProfilePhotoSection';
import DrivingLicenseSection from './DrivingLicenseSection';
import SecurityPasswordSection from './SecurityPasswordSection';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/useAuth';

export default function DriveEaseProfile() {
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [savingLicense, setSavingLicense] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom_complet: '',
    cin: '',
    email: '',
    telephone: '',
    adresse: '',
    profilePhotoPreview: null,
    profilePhotoData: '',
    profilePhotoName: '',
    profilePhotoMimeType: '',
    licenseNumber: '',
    expiryDate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    licenseFrontPreview: null,
    licenseFrontData: null,
    licenseFrontName: '',
    licenseFrontMimeType: '',
    licenseBackPreview: null,
    licenseBackData: null,
    licenseBackName: '',
    licenseBackMimeType: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Try to get profile from API first
        const userProfile = await authService.getProfile();
        
        if (userProfile) {
          refreshAuth();
          setFormData(prev => ({
            ...prev,
            nom_complet: userProfile.nom_complet || '',
            cin: userProfile.cin || '',
            email: userProfile.email || '',
            telephone: userProfile.telephone || '',
            adresse: userProfile.adresse || '',
            profilePhotoPreview: userProfile.profilePhotoData || null,
            profilePhotoData: userProfile.profilePhotoData || '',
            profilePhotoName: userProfile.profilePhotoName || '',
            profilePhotoMimeType: userProfile.profilePhotoMimeType || '',
            licenseNumber: userProfile.drivingLicense?.licenseNumber || userProfile.num_permis || '',
            expiryDate: userProfile.drivingLicense?.expiryDate
              ? new Date(userProfile.drivingLicense.expiryDate).toISOString().slice(0, 10)
              : '',
            licenseFrontPreview: userProfile.drivingLicense?.frontDocumentData || null,
            licenseFrontData: userProfile.drivingLicense?.frontDocumentData || null,
            licenseFrontName: userProfile.drivingLicense?.frontDocumentName || '',
            licenseFrontMimeType: userProfile.drivingLicense?.frontDocumentMimeType || '',
            licenseBackPreview: userProfile.drivingLicense?.backDocumentData || null,
            licenseBackData: userProfile.drivingLicense?.backDocumentData || null,
            licenseBackName: userProfile.drivingLicense?.backDocumentName || '',
            licenseBackMimeType: userProfile.drivingLicense?.backDocumentMimeType || '',
            // Never prefill password fields for security
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user profile from API, using localStorage:', error);
        
        // Fallback to localStorage
        const localUser = authService.getCurrentUser();
        if (localUser) {
          setFormData(prev => ({
            ...prev,
            nom_complet: localUser.nom_complet || '',
            cin: localUser.cin || '',
            email: localUser.email || '',
            telephone: localUser.telephone || '',
            adresse: localUser.adresse || '',
            profilePhotoPreview: localUser.profilePhotoData || null,
            profilePhotoData: localUser.profilePhotoData || '',
            profilePhotoName: localUser.profilePhotoName || '',
            profilePhotoMimeType: localUser.profilePhotoMimeType || '',
            licenseNumber: localUser.num_permis || '',
            // Never prefill password fields for security
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [refreshAuth]);

  const handleSavePersonalInfo = async () => {
    setSavingPersonal(true);
    try {
      await authService.updatePersonalInfo({
        nom_complet: formData.nom_complet,
        cin: formData.cin,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse || '',
      });

      alert('Personal information updated successfully!');
      refreshAuth();
    } catch (error) {
      console.error('Failed to update personal information:', error);
      alert(error.message || 'Failed to update personal information');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveProfilePhoto = async () => {
    setSavingPhoto(true);
    try {
      await authService.updateProfilePhoto({
        profilePhotoData: formData.profilePhotoData || '',
        profilePhotoName: formData.profilePhotoName || '',
        profilePhotoMimeType: formData.profilePhotoMimeType || '',
      });

      alert('Profile photo updated successfully!');
      refreshAuth();
    } catch (error) {
      console.error('Failed to update profile photo:', error);
      alert(error.message || 'Failed to update profile photo');
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleSaveDrivingLicense = async () => {
    setSavingLicense(true);
    try {
      await authService.updateDrivingLicense({
        licenseNumber: formData.licenseNumber,
        expiryDate: formData.expiryDate || '',
        frontDocumentData: formData.licenseFrontData || '',
        frontDocumentName: formData.licenseFrontName || '',
        frontDocumentMimeType: formData.licenseFrontMimeType || '',
        backDocumentData: formData.licenseBackData || '',
        backDocumentName: formData.licenseBackName || '',
        backDocumentMimeType: formData.licenseBackMimeType || '',
      });

      alert('Driving license information saved successfully!');
    } catch (error) {
      console.error('Failed to save driving license information:', error);
      alert(error.message || 'Failed to save driving license information');
    } finally {
      setSavingLicense(false);
    }
  };

  const handleSavePassword = async () => {
    setSavingPassword(true);
    try {
      // Validate password fields
      if (!formData.newPassword || !formData.confirmPassword) {
        alert('Please fill in all password fields');
        setSavingPassword(false);
        return;
      }
      
      if (formData.newPassword.length < 8) {
        alert('New password must be at least 8 characters long');
        setSavingPassword(false);
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New password and confirm password do not match');
        setSavingPassword(false);
        return;
      }
      
      await authService.updatePassword(
        formData.newPassword,
        formData.confirmPassword
      );
      console.log('Password updated successfully');
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
      
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert(error.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status">
                    <span className="sr-only">Chargement du profil...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* All sections rendered one under another */}
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="text-base font-bold text-gray-800">Informations personnelles</h5>
                    <button
                      onClick={handleSavePersonalInfo}
                      disabled={savingPersonal}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {savingPersonal ? (
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

                  <div className="mt-2">
                    <PersonalDetailsSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <ProfilePhotoSection
                    formData={formData}
                    setFormData={setFormData}
                    onSaveProfilePhoto={handleSaveProfilePhoto}
                    savingPhoto={savingPhoto}
                  />

                  <hr className="my-4" />

                  <div className="mt-8">
                    <DrivingLicenseSection
                      formData={formData}
                      setFormData={setFormData}
                      onSaveDrivingLicense={handleSaveDrivingLicense}
                      savingLicense={savingLicense}
                    />
                  </div>

                  <hr className="my-4" />

                  <div className="mt-8">
                    <SecurityPasswordSection 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSavePassword={handleSavePassword}
                      savingPassword={savingPassword}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
