// =====================================
// FILE 12: app/api/articles/[slug]/route.js (UPDATE EXISTING - for public access)
// =====================================

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single published article for public viewing
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    console.log('PUBLIC GET: Fetching published article with slug:', slug);

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
      .eq('status', 'published') // Only show published articles
      .single();

    console.log('PUBLIC GET: Query result:', { data: !!data, error });

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Article not found or not published' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Transform data to match frontend expectations
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
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('PUBLIC GET: Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
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

  return rootComments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}