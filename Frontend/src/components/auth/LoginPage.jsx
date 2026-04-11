import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/useAuth';
import loginBg from '../../assets/auth-imgs/luxury-car-hero1.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsValidation, setNeedsValidation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNeedsValidation(false);
    try {
      await authService.login(formData);
      refreshAuth();
      const fromQuery = new URLSearchParams(location.search).get('from');
      const raw = location.state?.from?.pathname ?? (fromQuery || undefined);
      const from = raw && raw !== '/login' && raw !== '/register' ? raw : '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const errorMsg = err.message || 'La connexion a échoué. Veuillez vérifier vos identifiants.';
      setError(errorMsg);
      if (errorMsg.toLowerCase().includes('email no') || errorMsg.toLowerCase().includes('validate')) {
        setNeedsValidation(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-10 overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Car silhouette gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Logo — pinned top-left */}
        <div className="absolute top-10 left-10 z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">PREMIUM RENTALS</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Vivez la route<br /> comme jamais auparavant.
          </h1>
          <p className="text-gray-400 text-base max-w-xs leading-relaxed" style={{color: "gray"}}>
            Accédez à notre flotte exclusive de véhicules de luxe et gérez vos réservations avec notre portail premium.
          </p>
        </div>

        {/* Bottom social proof */}
        <div className="absolute bottom-10 left-10 z-10 flex items-center gap-4">
          {/* Overlapping avatars */}
          <div className="flex -space-x-3">
            <img src="https://i.pravatar.cc/150?img=21" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover flex-shrink-0" />
            <img src="https://i.pravatar.cc/150?img=12" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover flex-shrink-0" />
            <img src="https://i.pravatar.cc/150?img=48" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover flex-shrink-0" />
          </div>
          <p className="text-white text-sm font-medium">
            Approuvé par <span className="font-bold">2k+</span> propriétaires.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-between bg-white px-8 py-10 sm:px-16">
        <div className="max-w-md mx-auto w-full flex flex-col justify-center min-h-full py-8">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Bon retour</h2>
            <p className="text-gray-500 text-sm">Veuillez entrer vos coordonnées pour accéder à votre compte.</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl border border-gray-200 p-1 mb-8 bg-gray-50">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connexion
            </button>
            <Link
              to="/register"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg text-center transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inscription
            </Link>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
              {needsValidation && (
                <button
                  type="button"
                  onClick={() => navigate('/validate-email', { state: { email: formData.email } })}
                  className="block mt-1 font-semibold text-blue-600 hover:text-blue-500 underline"
                >
                  Cliquez ici pour vérifier votre email
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                Se souvenir de moi pendant 30 jours
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Create account link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-6 text-xs text-gray-400 pt-4">
          <a href="#" className="hover:text-gray-600 transition-colors">Politique de confidentialité</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Conditions d'utilisation</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
}
