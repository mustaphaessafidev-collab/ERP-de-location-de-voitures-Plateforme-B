import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import PersonalDetailsSection from './PersonalDetailsSection';
import DrivingLicenseSection from './DrivingLicenseSection';
import SecurityPasswordSection from './SecurityPasswordSection';
import { authService } from '../../services/auth';

export default function DriveEaseProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    expiryDate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    licenseFrontPreview: null,
    licenseBackPreview: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Try to get profile from API first
        const userProfile = await authService.getProfile();
        
        if (userProfile) {
          // Split nom_complet into firstName and lastName
          const nameParts = userProfile.nom_complet ? userProfile.nom_complet.split(' ') : ['', ''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: userProfile.email || '',
            phone: userProfile.telephone || '',
            address: userProfile.adresse || '',
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
          const nameParts = localUser.nom_complet ? localUser.nom_complet.split(' ') : ['', ''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: localUser.email || '',
            phone: localUser.telephone || '',
            address: localUser.adresse || '',
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
  }, []);

  const handleSavePersonalInfo = async () => {
    setSaving(true);
    try {
      // Here you can add logic to update personal details and driving license
      const personalData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        expiryDate: formData.expiryDate,
      };
      
      console.log('Personal info saved:', personalData);
      
      // TODO: Add API call to update personal information
      // await authService.updatePersonalInfo(personalData);
      
      alert('Personal information saved successfully!');
    } catch (error) {
      console.error('Failed to save personal information:', error);
      alert(error.message || 'Failed to save personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    setSaving(true);
    try {
      // Validate password fields
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        alert('Please fill in all password fields (current, new, and confirm)');
        setSaving(false);
        return;
      }
      
      if (formData.newPassword.length < 8) {
        alert('New password must be at least 8 characters long');
        setSaving(false);
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New password and confirm password do not match');
        setSaving(false);
        return;
      }
      
      await authService.updatePassword(formData.currentPassword, formData.newPassword, formData.email);
      console.log('Password updated successfully');
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
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
                    <h5 className="text-base font-bold text-gray-800">Personal Details</h5>
                    <button
                      onClick={handleSavePersonalInfo}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Personal Details
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2">
                    <PersonalDetailsSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <div className="mt-8">
                    <DrivingLicenseSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <div className="mt-8">
                    <SecurityPasswordSection 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSavePassword={handleSavePassword}
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
