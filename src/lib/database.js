import { supabase } from './supabase'

// Get all articles with basic info (for listing pages)
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

// Get single article by slug with full content and interactions
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
      likedBy: comment.liked_by || [],
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

// Get all article slugs (for static generation)
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
  // First get the article ID
  const { data: article } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', articleSlug)
    .single()

  if (!article) {
    throw new Error('Article not found')
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      ...commentData,
      article_id: article.id
    }])
    .select()
    .single()

  if (error) {
    throw new Error('Error adding comment: ' + error.message)
  }

  // Update comment count
  await supabase.rpc('increment_comment_count', { article_slug: articleSlug })

  return data
}

// Update article reactions
// Admin functions for creating/updating articles
export async function createArticle(articleData) {
  try {
    // Insert article
    const { data: article, error: articleError } = await supabase
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
      throw articleError
    }

    // Create initial interactions record
    const { error: interactionError } = await supabase
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
    return { success: false, error: error.message }
  }
}

export async function updateArticle(slug, articleData) {
  try {
    const { data: article, error } = await supabase
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
      throw error
    }

    return { success: true, data: article }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteArticle(slug) {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('slug', slug)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}