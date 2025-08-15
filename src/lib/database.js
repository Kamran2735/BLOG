import { supabase, supabaseAdmin } from './supabase'

// Get all articles with basic info (for listing pages) - Use regular client for reads
export async function getArticles() {
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
    .order('published_date', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  // Transform data to match your existing component expectations
  return data.map(article => ({
    ...article,
    publishedDate: article.published_date,
    readingTime: article.reading_time,
    featuredImage: article.featured_image,
    // Keep the nested structure for compatibility
    article_interactions: article.article_interactions
  }))
}

// Get single article by slug with full content and interactions - Use regular client for reads
export async function getArticleBySlug(slug) {
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
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  // Transform the data to match your existing structure
  const transformedData = {
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

  return transformedData
}

// Helper function to organize comments with replies
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

// Get all article slugs (for static generation) - Use regular client for reads
export async function getArticleSlugs() {
  const { data, error } = await supabase
    .from('articles')
    .select('slug')

  if (error) {
    console.error('Error fetching slugs:', error)
    return []
  }

  return data.map(article => article.slug)
}

// Add a comment
export async function addComment(articleSlug, commentData) {
  try {
    // First get the article ID
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .select('id')
      .eq('slug', articleSlug)
      .single()

    if (articleError || !article) {
      console.error('Article fetch error:', articleError)
      throw new Error('Article not found')
    }

    // Insert the comment with proper structure
    const { data: comment, error: commentError } = await supabaseAdmin
      .from('comments')
      .insert([{
        id: commentData.id, // Use the generated ID from the API
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

    // Update comment count in article_interactions
    await incrementCommentCount(articleSlug)

    return comment
  } catch (error) {
    console.error('Add comment error:', error)
    throw error
  }
}

// Update article reactions - Use admin client for writes
export async function updateReactions(articleSlug, reactions) {
  try {
    console.log('Updating reactions for:', articleSlug, 'with:', reactions);
    
    // First get the article ID using regular client (faster)
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

    // Use admin client for the update operation
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

// Increment a specific reaction - Use regular client for reads, admin for writes
export async function incrementReaction(articleSlug, reactionType) {
  try {
    // First get current reactions using regular client (faster)
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

    // Increment the specific reaction
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

// Update comment likes
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

// Update comment content
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

// Delete comment
export async function deleteComment(commentId) {
  try {
    // First get the comment to find the article for updating comment count
    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('comments')
      .select('article_id, parent_id')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      console.error('Comment fetch error:', fetchError)
      throw new Error('Comment not found: ' + fetchError.message);
    }

    // Delete the comment (this will also delete replies due to cascade)
    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Comment delete error:', error)
      throw new Error('Error deleting comment: ' + error.message);
    }

    // Update comment count for the article
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

// Increment comment count
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

    // Get current comment count
    const { data: interactions } = await supabaseAdmin
      .from('article_interactions')
      .select('comment_count')
      .eq('article_id', article.id)
      .single();

    const currentCount = interactions?.comment_count || 0;

    // Update comment count
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

// Update comment count (recalculate from actual comments)
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

    // Count actual comments
    const { data: comments, error: countError } = await supabaseAdmin
      .from('comments')
      .select('id')
      .eq('article_id', article.id);

    if (countError) {
      console.error('Comment count error:', countError)
      throw new Error('Error counting comments: ' + countError.message);
    }

    const actualCount = comments?.length || 0;

    // Update comment count
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

// Admin functions for creating/updating articles
export async function createArticle(articleData) {
  try {
    // Insert article
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
        content: articleData.content
      }])
      .select()
      .single()

    if (articleError) {
      console.error('Article create error:', articleError)
      throw articleError
    }

    // Create initial interactions record
    const { error: interactionError } = await supabaseAdmin
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

    if (interactionError) {
      console.error('Error creating interactions:', interactionError)
    }

    return { success: true, data: article }
  } catch (error) {
    console.error('Create article error:', error)
    return { success: false, error: error.message }
  }
}

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
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Article update error:', error)
      throw error
    }

    return { success: true, data: article }
  } catch (error) {
    console.error('Update article error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteArticle(slug) {
  try {
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Article delete error:', error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Delete article error:', error)
    return { success: false, error: error.message }
  }
}