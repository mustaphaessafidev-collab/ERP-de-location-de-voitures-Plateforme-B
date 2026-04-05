import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Sidebar from './Sidebar';
import TabNavigation from './TabNavigation';
import PersonalDetailsSection from './PersonalDetailsSection';
import DrivingLicenseSection from './DrivingLicenseSection';
import SecurityPasswordSection from './SecurityPasswordSection';
import { authService } from '../../services/auth';

export default function DriveEaseProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    expiryDate: '',
    currentPassword: '',
    newPassword: '',
    licenseFrontPreview: null,
    licenseBackPreview: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await authService.getProfile();
        
        // Split nom_complet into firstName and lastName
        const nameParts = userProfile.nom_complet.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email: userProfile.email,
          phone: userProfile.telephone,
          address: userProfile.adresse || '',
        }));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Fallback to default values or show error message
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = () => {
    console.log('Saving profile changes:', formData);
    console.log('Saved profile data (JSON):', JSON.stringify(formData, null, 2));
    alert('Profile changes saved successfully! (Check browser console for saved values)');
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex' }}>
      <Sidebar />

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
                  {/* Tabs design, but all sections visible with scroll */}
                  <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={(tabId) => {
                      setActiveTab(tabId);
                      const section = document.getElementById(tabId);
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  />

                  {/* All sections rendered one under another */}
                  <div id="personal" className="mt-8">
                    <PersonalDetailsSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <div id="license" className="mt-8">
                    <DrivingLicenseSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <div id="preferences" className="mt-8">
                    <SecurityPasswordSection formData={formData} setFormData={setFormData} />
                  </div>

                  {/* Action Buttons */}
                  <hr className="my-3" />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                    >
                      <Save size={16} />
                      Save All Changes
                    </button>
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
