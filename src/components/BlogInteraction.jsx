"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Smile,
  Send,
  Reply,
  Edit,
  Trash2,
  ThumbsUp,
} from "lucide-react";

const UserInteractions = ({
  articleId,
  articleSlug,
  initialData = {},
  currentUser = { id: "user123", name: "John Doe", avatar: "/api/placeholder/40/40" },
}) => {
  // Reactions
  const [reactions, setReactions] = useState(
    initialData.interactions?.reactions || { likes: 0, hearts: 0, laughs: 0, dislikes: 0 }
  );
  const [userReaction, setUserReaction] = useState(null);

  // Comments
  const [comments, setComments] = useState(initialData.interactions?.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  // UI
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [commentFilter, setCommentFilter] = useState("all");
  const [commentSort, setCommentSort] = useState("newest");
  const [animationStage, setAnimationStage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const reactionPickerRef = useRef(null);

  // Intro animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 200),
      setTimeout(() => setAnimationStage(2), 400),
      setTimeout(() => setAnimationStage(3), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Load previous reaction from localStorage - removed due to Claude.ai restrictions
  useEffect(() => {
    // Would normally load from localStorage here
    // setUserReaction(savedReaction);
  }, [articleId, currentUser.id]);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(e.target)) {
        setShowReactionPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save to API
  const saveToAPI = async (updatedInteractions) => {
    if (!articleSlug) return false;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/articles/${articleSlug}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interactions: updatedInteractions }),
      });

      if (!response.ok) {
        throw new Error('Failed to save interactions');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error saving interactions:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reactions
  const handleReaction = async (reactionType) => {
    const nextReactions = { ...reactions };

    if (userReaction) {
      nextReactions[userReaction] = Math.max(0, (nextReactions[userReaction] || 0) - 1);
    }

    if (userReaction !== reactionType) {
      nextReactions[reactionType] = (nextReactions[reactionType] || 0) + 1;
      setUserReaction(reactionType);
    } else {
      setUserReaction(null);
    }

    setReactions(nextReactions);
    setShowReactionPicker(false);

    // Save to API
    const updatedInteractions = {
      reactions: nextReactions,
      comments,
      commentCount: comments.reduce((count, c) => count + 1 + (c.replies?.length || 0), 0),
    };

    await saveToAPI(updatedInteractions);
  };

  // Submit comment/reply
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
      parentId: replyingTo,
      edited: false,
    };

    let updatedComments;
    if (replyingTo) {
      updatedComments = comments.map((c) =>
        c.id === replyingTo ? { ...c, replies: [...(c.replies || []), comment] } : c
      );
    } else {
      updatedComments = [comment, ...comments];
    }

    setComments(updatedComments);
    setNewComment("");
    setReplyingTo(null);
    setIsSubmitting(false);

    // Save to API
    const commentCount = updatedComments.reduce((count, c) => count + 1 + (c.replies?.length || 0), 0);
    const updatedInteractions = {
      reactions,
      comments: updatedComments,
      commentCount,
    };

    await saveToAPI(updatedInteractions);
  };

  // Edit comment
  const handleEditComment = async (commentId, newContent) => {
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          content: newContent,
          edited: true,
          editedAt: new Date().toISOString(),
        };
      }
      if (c.replies?.length) {
        return {
          ...c,
          replies: c.replies.map((r) =>
            r.id === commentId
              ? { ...r, content: newContent, edited: true, editedAt: new Date().toISOString() }
              : r
          ),
        };
      }
      return c;
    });

    setComments(updated);
    setEditingComment(null);
    setEditText("");

    // Save to API
    const updatedInteractions = {
      reactions,
      comments: updated,
      commentCount: updated.reduce((count, c) => count + 1 + (c.replies?.length || 0), 0),
    };

    await saveToAPI(updatedInteractions);
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    const updated = comments
      .map((c) =>
        c.id === commentId
          ? null
          : { ...c, replies: c.replies?.filter((r) => r.id !== commentId) || [] }
      )
      .filter(Boolean);

    setComments(updated);

    // Save to API
    const updatedInteractions = {
      reactions,
      comments: updated,
      commentCount: updated.reduce((count, c) => count + 1 + (c.replies?.length || 0), 0),
    };

    await saveToAPI(updatedInteractions);
  };

  // Like comment
  const handleLikeComment = async (commentId) => {
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const isLiked = (c.likedBy || []).includes(currentUser.id);
        return {
          ...c,
          likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          likedBy: isLiked
            ? c.likedBy.filter((id) => id !== currentUser.id)
            : [...(c.likedBy || []), currentUser.id],
        };
      }
      if (c.replies?.length) {
        return {
          ...c,
          replies: c.replies.map((r) => {
            if (r.id === commentId) {
              const isLiked = (r.likedBy || []).includes(currentUser.id);
              return {
                ...r,
                likes: isLiked ? Math.max(0, r.likes - 1) : r.likes + 1,
                likedBy: isLiked
                  ? r.likedBy.filter((id) => id !== currentUser.id)
                  : [...(r.likedBy || []), currentUser.id],
              };
            }
            return r;
          }),
        };
      }
      return c;
    });

    setComments(updated);

    // Save to API
    const updatedInteractions = {
      reactions,
      comments: updated,
      commentCount: updated.reduce((count, c) => count + 1 + (c.replies?.length || 0), 0),
    };

    await saveToAPI(updatedInteractions);
  };

  // Filter and sort comments
  const getSortedComments = () => {
    let filtered = [...comments];

    if (commentFilter === "recent") {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filtered = filtered.filter((c) => new Date(c.timestamp) > dayAgo);
    } else if (commentFilter === "popular") {
      filtered = filtered.filter((c) => (c.likes || 0) > 0);
    }

    filtered.sort((a, b) => {
      if (commentSort === "oldest") {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (commentSort === "popular") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return filtered;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString();
  };

  const reactionEmojis = {
    likes: { emoji: "👍", label: "Like", icon: ThumbsUp },
    hearts: { emoji: "❤️", label: "Love", icon: Heart },
    laughs: { emoji: "😂", label: "Funny", icon: Smile },
    dislikes: { emoji: "👎", label: "Dislike", icon: ThumbsUp },
  };

  const totalReactions = Object.values(reactions).reduce((sum, n) => sum + (n || 0), 0);
  const totalComments = comments.reduce((count, c) => count + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Saving Indicator */}
        {isSaving && (
          <div className="fixed top-4 right-4 bg-[#39FF14]/20 border border-[#39FF14]/30 rounded-lg px-4 py-2 text-sm text-[#39FF14] z-50">
            Saving...
          </div>
        )}

        {/* Compact Action Bar */}
 <div
   className={`mb-8 transition-all relative z-[60] duration-800 ${
      animationStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
  >
          <div className="flex items-center justify-between p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl">
            <div className="flex items-center space-x-6 z-50">
              {/* Quick Reactions */}
              <div className="flex items-center space-x-3">
                {Object.entries(reactions).map(([type, count]) => {
                  const { emoji } = reactionEmojis[type];
                  const isActive = userReaction === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handleReaction(type)}
                      className={`group flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#39FF14]/20 text-[#39FF14] scale-105"
                          : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{emoji}</span>
                      {count > 0 && <span className="text-xs">{count}</span>}
                    </button>
                  );
                })}
              </div>

              {/* More Reactions */}
              <div className="relative" ref={reactionPickerRef}>
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                >
                  <Smile className="w-4 h-4" />
                  <span>More</span>
                </button>

{showReactionPicker && (
           <div className="absolute left-0 top-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl p-3 z-[61] min-w-[200px]">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => (
                        <button
                          key={type}
                          onClick={() => handleReaction(type)}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                            userReaction === type
                              ? "bg-[#39FF14]/20 text-[#39FF14]"
                              : "hover:bg-gray-700/50 text-gray-300"
                          }`}
                        >
                          <span className="text-base flex-shrink-0">{emoji}</span>
                          <span className="text-xs">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{totalReactions} reactions</span>
              <span>•</span>
              <span>{totalComments} comments</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
 <div
   className={`transition-all duration-800 delay-200 relative z-[10] ${
      animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
  >
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/40 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-700/40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3 text-[#39FF14]" />
                  Discussion ({totalComments})
                </h3>

                <div className="flex items-center space-x-3">
                  <select
                    value={commentFilter}
                    onChange={(e) => setCommentFilter(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50"
                  >
                    <option value="all">All</option>
                    <option value="recent">Recent</option>
                    <option value="popular">Popular</option>
                  </select>
                  <select
                    value={commentSort}
                    onChange={(e) => setCommentSort(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
              </div>

              {/* Comment Form */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={replyingTo ? "Write a reply..." : "Join the discussion..."}
                      maxLength={500}
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14]/50 resize-none transition-all duration-300 custom-scrollbar"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        {replyingTo && (
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            Cancel Reply
                          </button>
                        )}
                        <span>{newComment.length}/500</span>
                      </div>
                      <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmitting || newComment.length > 500}
                        className="bg-[#39FF14] text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-[#2ecc71] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? "Posting..." : replyingTo ? "Reply" : "Comment"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {getSortedComments().length === 0 ? (
                <div className="p-12 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">Start the conversation</h3>
                  <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/40">
                  {getSortedComments().map((comment) => (
                    <div key={comment.id} className="p-6 hover:bg-gray-700/10 transition-colors duration-200">
                      <div className="flex items-start space-x-3">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-9 h-9 rounded-full border-2 border-gray-600 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-white text-sm">{comment.userName}</span>
                            <span className="text-xs text-gray-400">{formatTimestamp(comment.timestamp)}</span>
                            {comment.edited && <span className="text-xs text-gray-500">(edited)</span>}
                          </div>

                          {editingComment === comment.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 resize-none text-sm custom-scrollbar"
                                rows={2}
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditComment(comment.id, editText)}
                                  className="bg-[#39FF14] text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#2ecc71] transition-colors duration-200"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingComment(null);
                                    setEditText("");
                                  }}
                                  className="text-gray-400 hover:text-gray-300 px-3 py-1.5 text-xs transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-300 text-sm mb-3 leading-relaxed break-words">
                              {comment.content}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center space-x-1 hover:text-red-400 transition-colors duration-200 ${
                                (comment.likedBy || []).includes(currentUser.id) ? "text-red-400" : ""
                              }`}
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>{comment.likes}</span>
                            </button>
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                              className="flex items-center space-x-1 hover:text-[#39FF14] transition-colors duration-200"
                            >
                              <Reply className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                            {comment.userId === currentUser.id && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingComment(comment.id);
                                    setEditText(comment.content);
                                  }}
                                  className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="flex items-center space-x-1 hover:text-red-400 transition-colors duration-200"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                          </div>

                          {/* Replies */}
                          {!!comment.replies?.length && (
                            <div className="mt-4 ml-2 pl-4 border-l-2 border-gray-700/50 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <img
                                    src={reply.userAvatar}
                                    alt={reply.userName}
                                    className="w-7 h-7 rounded-full border-2 border-gray-600 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-semibold text-white text-xs">{reply.userName}</span>
                                      <span className="text-xs text-gray-400">{formatTimestamp(reply.timestamp)}</span>
                                      {reply.edited && <span className="text-xs text-gray-500">(edited)</span>}
                                    </div>
                                    <p className="text-gray-300 text-xs mb-2 leading-relaxed break-words">
                                      {reply.content}
                                    </p>
                                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                                      <button
                                        onClick={() => handleLikeComment(reply.id)}
                                        className={`flex items-center space-x-1 hover:text-red-400 transition-colors duration-200 ${
                                          (reply.likedBy || []).includes(currentUser.id) ? "text-red-400" : ""
                                        }`}
                                      >
                                        <Heart className="w-3 h-3" />
                                        <span>{reply.likes}</span>
                                      </button>
                                      {reply.userId === currentUser.id && (
                                        <>
                                          <button
                                            onClick={() => {
                                              setEditingComment(reply.id);
                                              setEditText(reply.content);
                                            }}
                                            className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200"
                                          >
                                            <Edit className="w-3 h-3" />
                                            <span>Edit</span>
                                          </button>
                                          <button
                                            onClick={() => handleDeleteComment(reply.id)}
                                            className="flex items-center space-x-1 hover:text-red-400 transition-colors duration-200"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>Delete</span>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="flex justify-center mt-8">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserInteractions;