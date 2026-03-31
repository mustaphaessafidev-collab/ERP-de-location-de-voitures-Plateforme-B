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
        <main className="container-lg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="card border-light">
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement du profil...</span>
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
                  <div id="personal" style={{ marginTop: '2rem' }}>
                    <PersonalDetailsSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <div id="license" style={{ marginTop: '2rem' }}>
                    <DrivingLicenseSection formData={formData} setFormData={setFormData} />
                  </div>

                  <hr className="my-4" />

                  <div id="preferences" style={{ marginTop: '2rem' }}>
                    <SecurityPasswordSection formData={formData} setFormData={setFormData} />
                  </div>

                  {/* Action Buttons */}
                  <hr className="my-3" />
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={handleSave}
                      className="btn btn-primary d-flex align-items-center gap-2"
                      style={{ fontSize: '0.9rem', fontWeight: '500' }}
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
