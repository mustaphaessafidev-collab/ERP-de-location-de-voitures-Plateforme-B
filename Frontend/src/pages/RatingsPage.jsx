import React, { useState } from "react";
import { Star, MessageCircle, User, Calendar } from "lucide-react";

export default function RatingsPage() {
  const [ratings] = useState([
    {
      id: 1,
      vehicleName: "Tesla Model 3",
      rating: 5,
      review: "Excellent car! Very smooth ride and great performance.",
      date: "2024-04-10",
      reviewer: "John Doe",
    },
    {
      id: 2,
      vehicleName: "BMW 5 Series",
      rating: 4,
      review: "Good quality car, but a bit pricey.",
      date: "2024-04-08",
      reviewer: "Jane Smith",
    },
    {
      id: 3,
      vehicleName: "Audi A4",
      rating: 5,
      review: "Perfect for business trips. Very comfortable.",
      date: "2024-04-05",
      reviewer: "Mike Johnson",
    },
  ]);

  const averageRating = (
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
  ).toFixed(1);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Ratings</h1>
        <p className="text-slate-600">
          View your rental history and ratings from customers
        </p>
      </div>

      {/* Average Rating Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex flex-col items-center justify-center border border-amber-200">
            <span className="text-3xl font-bold text-amber-600">
              {averageRating}
            </span>
            <p className="text-xs text-amber-700">out of 5</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-slate-600">
              Based on {ratings.length} reviews
            </p>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {rating.vehicleName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    {rating.reviewer}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(rating.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              {renderStars(rating.rating)}
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <MessageCircle size={16} className="mt-1 text-slate-400" />
              <p>{rating.review}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State if no ratings */}
      {ratings.length === 0 && (
        <div className="text-center py-12">
          <Star className="text-slate-300 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No ratings yet
          </h3>
          <p className="text-slate-600">
            Complete a rental to receive your first rating
          </p>
        </div>
      )}
    </div>
  );
}
