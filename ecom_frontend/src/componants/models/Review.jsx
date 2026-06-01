import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export default function Review({ productId, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      setFetching(true);
      const res = await api.get(`/api/review/product/${productId}`);
      setReviews(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setFetching(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [fetchReviews]);

  const submitReview = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      setError("");

      await api.post("/api/review", {
        productId,
        rating,
        comment,
      });

      setComment("");
      setRating(5);

      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId) => {
    if (!editComment.trim()) return;

    try {
      setLoading(true);
      setError("");

      await api.put(`/api/review/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });

      setEditingId(null);
      setEditComment("");
      setEditRating(5);

      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      await api.delete(`/api/review/${reviewId}`);

      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(5);
    setEditComment("");
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-[#C2A878] text-lg">
        {index < count ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="mt-20 border-t border-[#5C4635] pt-12">
      <h2 className="text-3xl font-serif mb-8">Customer Reviews</h2>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700">
          {error}
        </div>
      )}

      {/* Review Form */}
      <div className="bg-[#2C241F] border border-[#5C4635] rounded-3xl p-6 mb-10">
        <h3 className="text-xl mb-4">Write a Review</h3>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={loading}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1C1917] border border-[#5C4635] outline-none"
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} Star
            </option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
          placeholder="Write your review..."
          className="w-full h-32 resize-none px-4 py-3 rounded-xl bg-[#1C1917] border border-[#5C4635] outline-none mb-4"
        />

        <button
          onClick={submitReview}
          disabled={loading}
          className="px-6 py-3 bg-[#8B5E3C] hover:bg-[#734A2E] rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {fetching ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => {
            const isOwner = review.user?._id === user?._id;

            return (
              <div
                key={review._id}
                className="bg-[#2C241F] border border-[#5C4635] rounded-2xl p-6"
              >
                {editingId === review._id ? (
                  <div>
                    <h3 className="text-xl mb-4">Edit Review</h3>

                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1C1917] border border-[#5C4635]"
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                          {num} Star
                        </option>
                      ))}
                    </select>

                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full h-32 resize-none px-4 py-3 rounded-xl bg-[#1C1917] border border-[#5C4635] mb-4"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateReview(review._id)}
                        disabled={loading}
                        className="px-6 py-3 bg-[#8B5E3C] rounded-xl"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="px-6 py-3 bg-[#5C4635] rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-lg">
                          {review.user?.name || "Anonymous"}
                        </p>
                        <div>{renderStars(review.rating)}</div>
                      </div>
                    </div>

                    <p className="text-[#C2A878]/80 leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    {isOwner && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(review)}
                          className="px-4 py-2 text-sm bg-[#8B5E3C] rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteReview(review._id)}
                          className="px-4 py-2 text-sm bg-red-700 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-[#C2A878]/70">
            No reviews yet. Be the first to review.
          </p>
        )}
      </div>
    </div>
  );
}