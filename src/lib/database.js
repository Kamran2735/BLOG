// ===============================================
// Complete Supabase Article Functions
// This file contains all public, admin, and
// interaction-related functions in one place.
// ===============================================

import { supabase, supabaseAdmin } from './supabase'

// =====================================
// Public Functions (Client-Side Access)
// =====================================

/**
 * Fetches a list of all published articles with basic info.
 * This function is intended for the public-facing blog list.
 * @returns {Array} An array of articles or an empty array on error.
 */
export async function getPublishedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      title,
      author,
      category,
      published_date,
      reading_time,
      featured_image,
      excerpt,
      article_interactions (
        likes,
        hearts,
        laughs,
        dislikes,
        comment_count
      )
    `)
    .eq('status', 'published') // Only fetch published articles
    .order('published_date', { ascending: false })

  if (error) {
    console.error('Error fetching published articles:', error)
    return []
  }

  // Transform data to match client-side component expectations
  return data.map(article => ({
    ...article,
    publishedDate: article.published_date,
    readingTime: article.reading_time,
    featuredImage: article.featured_image,
    article_interactions: article.article_interactions
  }))
}

/**
 * Fetches a single published article by its slug.
 * This includes full content and nested interactions/comments.
 * @param {string} slug The unique slug of the article.
 * @returns {Object|null} The article object or null if not found/error.
 */
export async function getPublishedArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_interactions (
        likes,
        hearts,
        laughs,
        dislikes,
        comment_count,
        last_updated
      ),
      comments (
        id,
        user_id,
        user_name,
        user_avatar,
        content,
        timestamp,
        likes,
        liked_by,
        parent_id,
        edited
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching published article:', error)
    return null
  }

  return transformArticleData(data)
}

/**
 * Fetches all article slugs for static site generation.
 * @returns {Array} An array of slugs or an empty array on error.
 */
export async function getArticleSlugs() {
  const { data, error } = await supabase
    .from('articles')
    .select('slug')
    .eq('status', 'published')

  if (error) {
    console.error('Error fetching slugs:', error)
    return []
  }

  return data.map(article => article.slug)
}

// =====================================
// Admin Functions (Server-Side Access)
// =====================================

/**
 * Fetches all articles, including drafts, for admin view.
 * This uses the admin client to bypass RLS policies.
 * @returns {Array} An array of articles or an empty array on error.
 */
export async function getAllArticles() {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select(`
      id,
      slug,
      title,
      author,
      category,
      published_date,
      reading_time,
      featured_image,
      excerpt,
      status,
      created_at,
      updated_at,
      article_interactions (
        likes,
        hearts,
        laughs,
        dislikes,
        comment_count
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all articles:', error)
    return []
  }

  return data.map(article => ({
    ...article,
    publishedDate: article.published_date,
    readingTime: article.reading_time,
    featuredImage: article.featured_image,
    article_interactions: article.article_interactions
  }))
}

/**
 * Fetches a single article by slug for admin view.
 * @param {string} slug The unique slug of the article.
 * @returns {Object|null} The article object or null on error.
 */
export async function getArticleBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select(`
      *,
      article_interactions (
        likes,
        hearts,
        laughs,
        dislikes,
        comment_count,
        last_updated
      ),
      comments (
        id,
        user_id,
        user_name,
        user_avatar,
        content,
        timestamp,
        likes,
        liked_by,
        parent_id,
        edited
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return transformArticleData(data)
}

/**
 * Creates a new article in the database.
 * @param {Object} articleData The data for the new article.
 * @returns {Object} An object with success status and article data.
 */
export async function createArticle(articleData) {
  try {
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .insert([{
        slug: articleData.slug,
        title: articleData.title,
        author: articleData.author,
        category: articleData.category || 'General',
        published_date: articleData.publishedDate || new Date().toISOString().split('T')[0],
        reading_time: articleData.readingTime || '5 min read',
        featured_image: articleData.featuredImage || null,
        excerpt: articleData.excerpt || '',
        content: articleData.content,
        status: articleData.status || 'draft'
      }])
      .select()
      .single()

    if (articleError) {
      throw articleError
    }

    // Create initial interactions record
    await supabaseAdmin
      .from('article_interactions')
      .insert([{
        article_id: article.id,
        likes: 0,
        hearts: 0,
        laughs: 0,
        dislikes: 0,
        comment_count: 0,
        last_updated: new Date().toISOString()
      }])

    return { success: true, data: article }
  } catch (error) {
    console.error('Create article error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Updates an existing article in the database.
 * @param {string} slug The slug of the article to update.
 * @param {Object} articleData The updated data for the article.
 * @returns {Object} An object with success status and article data.
 */
export async function updateArticle(slug, articleData) {
  try {
    const { data: article, error } = await supabaseAdmin
      .from('articles')
      .update({
        slug: articleData.slug,
        title: articleData.title,
        author: articleData.author,
        category: articleData.category || 'General',
        published_date: articleData.publishedDate,
        reading_time: articleData.readingTime || '5 min read',
        featured_image: articleData.featuredImage || null,
        excerpt: articleData.excerpt || '',
        content: articleData.content,
        status: articleData.status || 'published',
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, data: article }
  } catch (error) {
    console.error('Update article error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Soft deletes an article by moving it to the deleted_articles table.
 * @param {string} slug The slug of the article to delete.
 * @param {string} [deletedBy='admin'] The user who deleted the article.
 * @param {string} [reason=''] The reason for deletion.
 * @returns {Object} An object with success status.
 */
export async function softDeleteArticle(slug, deletedBy = 'admin', reason = '') {
  try {
    const { data: article, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select(`*, article_interactions (*), comments (*)`)
      .eq('slug', slug)
      .single()

    if (fetchError) {
      throw new Error('Article not found')
    }

    const { error: moveError } = await supabaseAdmin
      .from('deleted_articles')
      .insert([{
        original_article_id: article.id,
        article_data: article,
        deleted_by: deletedBy,
        reason: reason
      }])

    if (moveError) {
      throw moveError
    }

    const { error: deleteError } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('slug', slug)

    if (deleteError) {
      throw deleteError
    }

    return { success: true }
  } catch (error) {
    console.error('Soft delete article error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Fetches all soft-deleted articles for admin view.
 * @returns {Array} An array of deleted article records.
 */
export async function getDeletedArticles() {
  try {
    const { data, error } = await supabaseAdmin
      .from('deleted_articles')
      .select('*')
      .order('deleted_at', { ascending: false })

    if (error) {
      throw error
    }

    return data.map(item => ({
      deleteId: item.id,
      deletedAt: item.deleted_at,
      deletedBy: item.deleted_by,
      reason: item.reason,
      permanentDeleteAt: item.permanent_delete_at,
      ...item.article_data
    }))
  } catch (error) {
    console.error('Error fetching deleted articles:', error)
    return []
  }
}

// =====================================
// Article Interaction Functions
// =====================================

/**
 * Adds a new comment to an article.
 * @param {string} articleSlug The slug of the article.
 * @param {Object} commentData The data for the new comment.
 * @returns {Object} The newly created comment object.
 */
export async function addComment(articleSlug, commentData) {
  try {
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single()

    if (articleError || !article) {
      console.error('Article fetch error:', articleError)
      throw new Error('Article not found')
    }

    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .insert([{
        id: commentData.id,
        article_id: article.id,
        user_id: commentData.user_id,
        user_name: commentData.user_name,
        user_avatar: commentData.user_avatar,
        content: commentData.content,
        timestamp: commentData.timestamp,
        likes: commentData.likes || 0,
        liked_by: commentData.liked_by || [],
        parent_id: commentData.parent_id,
        edited: commentData.edited || false
      }])
      .select()
      .single()

    if (commentError) {
      console.error('Comment insert error:', commentError)
      throw new Error('Error adding comment: ' + commentError.message)
    }

    await incrementCommentCount(articleSlug)
    return comment
  } catch (error) {
    console.error('Add comment error:', error)
    throw error
  }
}

/**
 * Updates all reactions for an article.
 * @param {string} articleSlug The slug of the article.
 * @param {Object} reactions The new reaction counts.
 * @returns {Object} The updated interaction record.
 */
export async function updateReactions(articleSlug, reactions) {
  try {
    console.log('Updating reactions for:', articleSlug, 'with:', reactions);
    
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single();

    if (fetchError || !article) {
      console.error('Article fetch error:', fetchError)
      throw new Error('Article not found: ' + (fetchError?.message || 'No article found'));
    }

    console.log('Found article ID:', article.id);

    const { data, error } = await supabaseAdmin
      .from('article_interactions')
      .upsert({
        article_id: article.id,
        likes: reactions.likes || 0,
        hearts: reactions.hearts || 0,
        laughs: reactions.laughs || 0,
        dislikes: reactions.dislikes || 0,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'article_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Reactions update error:', error)
      throw new Error('Error updating reactions: ' + error.message);
    }

    console.log('Reactions updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Update reactions error:', error)
    throw error;
  }
}

/**
 * Increments a specific reaction type for an article.
 * @param {string} articleSlug The slug of the article.
 * @param {string} reactionType The type of reaction to increment.
 * @returns {Object} The updated interaction record.
 */
export async function incrementReaction(articleSlug, reactionType) {
  try {
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select(`
        id,
        article_interactions (
          likes,
          hearts,
          laughs,
          dislikes
        )
      `)
      .eq('slug', articleSlug)
      .single();

    if (fetchError || !article) {
      console.error('Article fetch error:', fetchError)
      throw new Error('Article not found: ' + (fetchError?.message || 'No article found'));
    }

    const currentReactions = article.article_interactions?.[0] || {
      likes: 0,
      hearts: 0,
      laughs: 0,
      dislikes: 0
    };

    const updatedReactions = {
      ...currentReactions,
      [reactionType]: (currentReactions[reactionType] || 0) + 1
    };

    return await updateReactions(articleSlug, updatedReactions);
  } catch (error) {
    console.error('Increment reaction error:', error)
    throw error;
  }
}

/**
 * Updates the likes and likedBy list for a specific comment.
 * @param {string} commentId The ID of the comment.
 * @param {number} likes The new count of likes.
 * @param {Array<string>} likedBy The list of user IDs who liked the comment.
 * @returns {Object} The updated comment object.
 */
export async function updateCommentLikes(commentId, likes, likedBy) {
  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({
        likes: likes,
        liked_by: likedBy
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Comment likes update error:', error)
      throw new Error('Error updating comment likes: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Update comment likes error:', error)
    throw error;
  }
}

/**
 * Updates the content of a specific comment.
 * @param {string} commentId The ID of the comment.
 * @param {string} content The new comment content.
 * @returns {Object} The updated comment object.
 */
export async function updateComment(commentId, content) {
  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({
        content: content,
        edited: true,
        edited_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Comment update error:', error)
      throw new Error('Error updating comment: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Update comment error:', error)
    throw error;
  }
}

/**
 * Deletes a comment and its replies.
 * @param {string} commentId The ID of the comment to delete.
 * @returns {Object} An object with success status.
 */
export async function deleteComment(commentId) {
  try {
    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('comments')
      .select('article_id, parent_id')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      console.error('Comment fetch error:', fetchError)
      throw new Error('Comment not found: ' + fetchError.message);
    }

    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Comment delete error:', error)
      throw new Error('Error deleting comment: ' + error.message);
    }

    const { data: article } = await supabaseAdmin
      .from('articles')
      .select('slug')
      .eq('id', comment.article_id)
      .single();

    if (article) {
      await updateCommentCount(article.slug);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete comment error:', error)
    throw error;
  }
}

/**
 * Increments the comment count for an article.
 * @param {string} articleSlug The slug of the article.
 * @returns {Object} An object with success status.
 */
export async function incrementCommentCount(articleSlug) {
  try {
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single();

    if (articleError || !article) {
      console.error('Article fetch error:', articleError)
      throw new Error('Article not found');
    }

    const { data: interactions } = await supabaseAdmin
      .from('article_interactions')
      .select('comment_count')
      .eq('article_id', article.id)
      .single();

    const currentCount = interactions?.comment_count || 0;

    const { error } = await supabaseAdmin
      .from('article_interactions')
      .upsert({
        article_id: article.id,
        comment_count: currentCount + 1,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'article_id'
      });

    if (error) {
      console.error('Comment count increment error:', error)
      throw new Error('Error incrementing comment count: ' + error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Increment comment count error:', error)
    throw error;
  }
}

/**
 * Recalculates the comment count for an article based on actual comments.
 * @param {string} articleSlug The slug of the article.
 * @returns {Object} An object with success status and the new count.
 */
export async function updateCommentCount(articleSlug) {
  try {
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single();

    if (articleError || !article) {
      console.error('Article fetch error:', articleError)
      throw new Error('Article not found');
    }

    const { data: comments, error: countError } = await supabaseAdmin
      .from('comments')
      .select('id')
      .eq('article_id', article.id);

    if (countError) {
      console.error('Comment count error:', countError)
      throw new Error('Error counting comments: ' + countError.message);
    }

    const actualCount = comments?.length || 0;

    const { error } = await supabaseAdmin
      .from('article_interactions')
      .upsert({
        article_id: article.id,
        comment_count: actualCount,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'article_id'
      });

    if (error) {
      console.error('Comment count update error:', error)
      throw new Error('Error updating comment count: ' + error.message);
    }

    return { success: true, count: actualCount };
  } catch (error) {
    console.error('Update comment count error:', error)
    throw error;
  }
}

// =====================================
// Helper Functions
// =====================================

/**
 * Helper function to transform article data into a consistent format.
 * @param {Object} data The raw article data from Supabase.
 * @returns {Object} The transformed article object.
 */
function transformArticleData(data) {
  return {
    ...data,
    publishedDate: data.published_date,
    readingTime: data.reading_time,
    featuredImage: data.featured_image,
    interactions: {
      reactions: {
        likes: data.article_interactions?.[0]?.likes || 0,
        hearts: data.article_interactions?.[0]?.hearts || 0,
        laughs: data.article_interactions?.[0]?.laughs || 0,
        dislikes: data.article_interactions?.[0]?.dislikes || 0
      },
      comments: organizeComments(data.comments || []),
      commentCount: data.article_interactions?.[0]?.comment_count || 0,
      lastUpdated: data.article_interactions?.[0]?.last_updated
    }
  }
}

/**
 * Helper function to organize comments with their replies into a tree structure.
 * @param {Array} comments The flat list of comments from Supabase.
 * @returns {Array} An array of root comments with nested replies.
 */
function organizeComments(comments) {
  const commentsMap = new Map();
  const rootComments = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    const transformedComment = {
      id: comment.id,
      userId: comment.user_id,
      userName: comment.user_name,
      userAvatar: comment.user_avatar,
      content: comment.content,
      timestamp: comment.timestamp,
      likes: comment.likes || 0,
      likedBy: Array.isArray(comment.liked_by) ? comment.liked_by : [],
      replies: [],
      parentId: comment.parent_id,
      edited: comment.edited || false
    };
    commentsMap.set(comment.id, transformedComment);
  });

  // Second pass: organize into tree structure
  commentsMap.forEach(comment => {
    if (comment.parentId) {
      const parent = commentsMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}
