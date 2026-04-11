import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, ChevronDown, User, Edit2, Trash2, X } from 'lucide-react';
import { reviewService } from '../services/reviews';
import { useAuth } from '../context/useAuth';

const CAR_OPTIONS = [
  { name: 'Tesla Model 3', category: 'Electric' },
  { name: 'Porsche Taycan Turbo', category: 'Electric' },
  { name: 'Audi Q8 e-tron', category: 'SUV' },
  { name: 'Range Rover Sport', category: 'SUV' },
  { name: 'BMW i7', category: 'Electric' },
];

const SORT_OPTIONS = [
  { id: 'latest', label: 'Plus récents' },
  { id: 'highest', label: 'Mieux notés' },
  { id: 'lowest', label: 'Moins bien notés' },
  { id: 'oldest', label: 'Plus anciens' },
];

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [filter, setFilter] = useState('All Cars');
  const [isEditing, setIsEditing] = useState(null); // Review ID being edited

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    carName: 'Tesla Model 3',
  });

  useEffect(() => {
    loadData();
  }, [sortBy, filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getReviews(sortBy, filter),
        reviewService.getStats()
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (r) => setFormData({ ...formData, rating: r });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) return alert("Veuillez donner une note");
    
    try {
      setSubmitting(true);
      const car = CAR_OPTIONS.find(c => c.name === formData.carName);
      
      const payload = {
        ...formData,
        userId: Number(user?.id || 999), // Cast to Number
        userName: user?.nom_complet || 'Utilisateur',
        userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nom_complet || 'U')}&background=random`,
        carCategory: car?.category || 'Standard'
      };

      if (isEditing) {
        await reviewService.updateReview(isEditing, payload);
        setIsEditing(null);
      } else {
        await reviewService.submitReview(payload);
      }

      setFormData({ rating: 0, title: '', comment: '', carName: 'Tesla Model 3' });
      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handeEdit = (review) => {
    setIsEditing(review.id);
    setFormData({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      carName: review.carName
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet avis ?")) return;
    try {
      await reviewService.deleteReview(id);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && !reviews.length) return <div className="p-10 text-center">Chargement des avis...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <span>Dashboard</span>
        <ChevronDown className="w-4 h-4 -rotate-90" />
        <span className="text-gray-900 font-medium">Notes & Avis Clients</span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* Review Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Résumé des avis</h3>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-6xl font-black text-blue-600">{stats?.averageRating || '0.0'}</span>
              <div className="space-y-1">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-5 h-5 fill-current ${s <= Math.round(stats?.averageRating || 0) ? '' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-500 text-sm">Basé sur {stats?.totalReviews || 0} avis</p>
              </div>
            </div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats?.distribution[star] || 0;
                const percentage = stats?.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-3">{star}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-400 w-10 text-right">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rate Your Rental Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            {isEditing && (
              <button 
                onClick={() => {
                  setIsEditing(null);
                  setFormData({ rating: 0, title: '', comment: '', carName: 'Tesla Model 3' });
                }}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {isEditing ? 'Modifier votre avis' : 'Donnez votre avis'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">Comment était votre expérience ?</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Véhicule loué</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.carName}
                  onChange={(e) => setFormData({ ...formData, carName: e.target.value })}
                >
                  {CAR_OPTIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Note globale</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => handleRatingClick(s)}>
                      <Star className={`w-8 h-8 ${s <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Titre de l'avis</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Expérience exceptionnelle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Votre message</label>
                <textarea 
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Détails de votre expérience..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Envoi...' : (isEditing ? 'Mettre à jour' : 'Publier mon avis')}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Trier par:</span>
              <select 
                className="text-sm text-blue-600 font-semibold bg-white border-none focus:ring-0 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
              </select>
            </div>

            <div className="flex items-center bg-gray-50 p-1 rounded-xl gap-1">
              {['All Cars', 'Electric', 'SUV'].map((cat) => (
                <button 
                  key={cat} onClick={() => setFilter(cat)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                      {review.userAvatar ? <img src={review.userAvatar} alt="" /> : <User className="w-7 h-7 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{review.userName}</h4>
                        {review.isVerified && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                            Verified Renter
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        Loué: <span className="text-blue-500 font-semibold">{review.carName}</span> • {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-5 h-5 fill-current ${s <= review.rating ? '' : 'text-gray-100'}`} />
                      ))}
                    </div>
                    {(review.userId === user?.id || review.userId === 999) && (
                      <div className="flex gap-2">
                        <button onClick={() => handeEdit(review)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(review.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h5 className="text-xl font-bold text-gray-900 mb-3">{review.title}</h5>
                <p className="text-gray-600 leading-relaxed mb-6">{review.comment}</p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm">
                      <ThumbsUp className="w-4 h-4" /> Utile ({review.helpfulCount})
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm">
                      <MessageSquare className="w-4 h-4" /> Répondre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
