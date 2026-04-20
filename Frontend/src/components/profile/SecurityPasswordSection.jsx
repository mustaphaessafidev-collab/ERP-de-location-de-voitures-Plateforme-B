import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

export default function SecurityPasswordSection({ formData, setFormData, onSavePassword, savingPassword }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: '' });
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    let message = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        message = 'Tres faible';
        color = 'text-red-600';
        break;
      case 2:
        message = 'Faible';
        color = 'text-orange-600';
        break;
      case 3:
        message = 'Moyen';
        color = 'text-yellow-600';
        break;
      case 4:
        message = 'Bon';
        color = 'text-blue-600';
        break;
      case 5:
        message = 'Fort';
        color = 'text-green-600';
        break;
    }

    setPasswordStrength({ score, message: <span className={color}>{message}</span> });
  };

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });
    checkPasswordStrength(newPassword);
  };

  const getPasswordValidationErrors = () => {
    const errors = [];
    const password = formData.newPassword;

    if (password && password.length < 8) {
      errors.push('Au moins 8 caracteres');
    }
    if (password && !/[A-Z]/.test(password)) {
      errors.push('Une lettre majuscule');
    }
    if (password && !/[a-z]/.test(password)) {
      errors.push('Une lettre minuscule');
    }
    if (password && !/\d/.test(password)) {
      errors.push('Un chiffre');
    }
    if (password && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Un caractere special');
    }

    return errors;
  };

  const isPasswordValid = () => {
    return getPasswordValidationErrors().length === 0 && formData.newPassword.length >= 8;
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-gray-600" />
          <h5 className="text-lg font-semibold text-gray-800">Securite et mot de passe</h5>
        </div>
        <small className="text-sm text-gray-500">Derniere mise a jour : jamais</small>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Entrez un nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? (
                <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye size={18} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {formData.newPassword && (
            <div className="mt-1">
              <div className="text-xs text-gray-600">
                Force du mot de passe : {passwordStrength.message}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 1 ? 'bg-red-600' :
                    passwordStrength.score === 2 ? 'bg-orange-600' :
                    passwordStrength.score === 3 ? 'bg-yellow-600' :
                    passwordStrength.score === 4 ? 'bg-blue-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirmez le nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye size={18} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle size={12} className="text-red-500" />
              <small className="text-xs text-red-500">Les mots de passe ne correspondent pas</small>
            </div>
          )}
        </div>
      </div>

      {/* Password Requirements */}
      {formData.newPassword && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h6 className="text-sm font-medium text-gray-700 mb-2">Exigences du mot de passe :</h6>
          <div className="grid grid-cols-2 gap-2">
            {[
              { text: 'Au moins 8 caracteres', valid: formData.newPassword.length >= 8 },
              { text: 'Une lettre majuscule', valid: /[A-Z]/.test(formData.newPassword) },
              { text: 'Une lettre minuscule', valid: /[a-z]/.test(formData.newPassword) },
              { text: 'Un chiffre', valid: /\d/.test(formData.newPassword) },
              { text: 'Un caractere special', valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) },
            ].map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${
                  requirement.valid ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={requirement.valid ? 'text-green-700' : 'text-gray-600'}>
                  {requirement.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSavePassword}
          disabled={
            savingPassword ||
            !formData.newPassword ||
            !formData.confirmPassword ||
            !isPasswordValid() ||
            formData.newPassword !== formData.confirmPassword
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {savingPassword ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Lock size={16} />
              Mettre a jour le mot de passe
            </>
          )}
        </button>
      </div>

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h6 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          <AlertCircle size={16} />
          Conseils de securite
        </h6>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Utilisez un mot de passe unique different de vos autres comptes</li>
          <li>• Evitez les informations personnelles comme nom ou date de naissance</li>
          <li>• Utilisez un gestionnaire pour generer et stocker des mots de passe robustes</li>
          <li>• Activez l'authentification a deux facteurs si disponible</li>
        </ul>
      </div>
    </div>
  );
}
