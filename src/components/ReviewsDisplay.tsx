"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ThumbsUp,
  Flag,
  X,
  Eye,
  CheckCircle,
  Calendar,
  ChevronDown,
  Filter
} from "lucide-react";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  createdAt: string;
}

interface ReviewsDisplayProps {
  productId: string;
  currentUserId?: string;
  triggerRefresh?: number;
  onWriteReview?: () => void;
}

const ReviewsDisplay = ({ productId, currentUserId, triggerRefresh, onWriteReview }: ReviewsDisplayProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
  });
  const [loading, setLoading] = useState(true);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [actioningReview, setActioningReview] = useState<string | null>(null);

  // Fetch initial 3 reviews for display
  const fetchReviews = async (limit = 3) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        productId,
        page: '1',
        limit: limit.toString(),
        sortBy: 'newest'
      });

      const response = await fetch(`/api/reviews?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setReviews(result.data.reviews);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all reviews for modal
  const fetchAllReviews = async (page = 1, sort = sortBy, rating = filterRating) => {
    try {
      setModalLoading(true);
      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: '10',
        sortBy: sort
      });

      if (rating !== 'all') {
        params.append('rating', rating);
      }

      const response = await fetch(`/api/reviews?${params}`);
      const result = await response.json();
      
      if (result.success) {
        if (page === 1) {
          setAllReviews(result.data.reviews);
        } else {
          setAllReviews(prev => [...prev, ...result.data.reviews]);
        }
        setModalCurrentPage(result.data.pagination.currentPage);
        setModalTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching all reviews:', error);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, triggerRefresh]);

  const handleViewAllReviews = () => {
    setShowAllReviewsModal(true);
    fetchAllReviews(1);
  };

  const handleModalSortChange = (newSort: string) => {
    setSortBy(newSort);
    fetchAllReviews(1, newSort, filterRating);
  };

  const handleModalFilterChange = (newFilter: string) => {
    setFilterRating(newFilter);
    fetchAllReviews(1, sortBy, newFilter);
  };

  const loadMoreModalReviews = () => {
    if (modalCurrentPage < modalTotalPages) {
      fetchAllReviews(modalCurrentPage + 1, sortBy, filterRating);
    }
  };

  const handleReviewAction = async (reviewId: string, action: 'helpful' | 'report') => {
    if (!currentUserId) {
      alert('Please log in to perform this action');
      return;
    }

    setActioningReview(reviewId);
    try {
      const response = await fetch('/api/reviews/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId,
          action,
          userId: currentUserId
        })
      });

      const result = await response.json();
      if (result.success) {
        // Update both reviews arrays
        const updateReview = (review: Review) =>
          review._id === reviewId
            ? {
                ...review,
                helpfulCount: action === 'helpful' ? review.helpfulCount + 1 : review.helpfulCount,
                reportCount: action === 'report' ? review.reportCount + 1 : review.reportCount
              }
            : review;

        setReviews(prev => prev.map(updateReview));
        setAllReviews(prev => prev.map(updateReview));
      } else {
        alert(result.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Action failed');
    } finally {
      setActioningReview(null);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const renderReviewItem = (review: Review, isModal = false) => {
    const isExpanded = expandedReviews.has(review._id);
    const shouldTruncate = review.comment.length > 150;
    const displayComment = shouldTruncate && !isExpanded 
      ? review.comment.substring(0, 150) + '...' 
      : review.comment;

    return (
      <div key={review._id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
        {/* Reviewer Info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {review.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 text-sm">{review.userName}</h4>
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Comment */}
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
          {displayComment}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => toggleReviewExpansion(review._id)}
            className="text-pink-600 hover:text-pink-700 text-xs font-medium mb-2"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {review.images.slice(0, 3).map((image, index) => (
              <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image}
                  alt="Review image"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {review.images.length > 3 && (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                +{review.images.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Review Actions */}
        {currentUserId && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleReviewAction(review._id, 'helpful')}
              disabled={actioningReview === review._id}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ThumbsUp className="w-3 h-3" />
              Helpful ({review.helpfulCount})
            </button>
            <button
              onClick={() => handleReviewAction(review._id, 'report')}
              disabled={actioningReview === review._id}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Flag className="w-3 h-3" />
              Report
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Compact Rating Summary Skeleton */}
        <div className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Reviews Skeleton */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Compact Reviews Section */}
      <div className="space-y-4">
        {/* Compact Rating Summary */}
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              Reviews
            </h3>
            {onWriteReview && (
              <button
                onClick={onWriteReview}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                ✨ Write Review
              </button>
            )}
          </div>

          {stats.totalReviews > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Reviews List - Show only first 3 */}
        {stats.totalReviews === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {reviews.map((review) => renderReviewItem(review))}
            </div>

            {/* View All Reviews Button */}
            {stats.totalReviews > 3 && (
              <div className="text-center pt-4">
                <button
                  onClick={handleViewAllReviews}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  View All {stats.totalReviews} Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* All Reviews Modal */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  All Reviews ({stats.totalReviews})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.averageRating} average rating
                </p>
              </div>
              <button
                onClick={() => setShowAllReviewsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Controls */}
            <div className="flex flex-wrap items-center gap-4 p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleModalSortChange(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="rating_high">Highest Rating</option>
                  <option value="rating_low">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select
                  value={filterRating}
                  onChange={(e) => handleModalFilterChange(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {allReviews.map((review) => renderReviewItem(review, true))}
              </div>

              {/* Load More Button */}
              {modalCurrentPage < modalTotalPages && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMoreModalReviews}
                    disabled={modalLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {modalLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsDisplay;
