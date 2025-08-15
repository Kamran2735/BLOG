// ============================================
// src/app/api/articles/[slug]/interactions/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch interactions for a specific article
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    console.log('Fetching interactions for slug:', slug);

    if (!slug) {
      return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
    }

    // Get article with interactions and comments using regular client
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select(`
        id,
        slug,
        title,
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
      .single();

    if (articleError) {
      console.error('Article fetch error:', articleError);
      if (articleError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      throw articleError;
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    console.log('Article found:', article.slug);
    console.log('Raw interactions:', article.article_interactions);
    console.log('Raw comments count:', article.comments?.length || 0);

    // Transform data to match UserInteractions expected format
    const interactions = {
      reactions: {
        likes: article.article_interactions?.[0]?.likes || 0,
        hearts: article.article_interactions?.[0]?.hearts || 0,
        laughs: article.article_interactions?.[0]?.laughs || 0,
        dislikes: article.article_interactions?.[0]?.dislikes || 0
      },
      comments: organizeComments(article.comments || []),
      commentCount: article.article_interactions?.[0]?.comment_count || 0,
      lastUpdated: article.article_interactions?.[0]?.last_updated || new Date().toISOString()
    };

    console.log('Transformed interactions:', interactions);

    return NextResponse.json({ 
      success: true,
      interactions 
    });
  } catch (error) {
    console.error('GET interactions error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch interactions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Helper function to organize comments into nested structure
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

  return rootComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}