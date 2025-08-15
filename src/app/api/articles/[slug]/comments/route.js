// src/app/api/articles/[slug]/comments/route.js
import { NextResponse } from 'next/server';
import { addComment } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    const { content, userId, userName, userAvatar, parentId } = body;
    
    if (!content || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: content, userId, userName' },
        { status: 400 }
      );
    }
    
    // Generate comment ID (matching your existing format)
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const commentData = {
      id: commentId,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar || '/api/placeholder/40/40',
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked_by: [],
      parent_id: parentId || null,
      edited: false
    };

    const result = await addComment(slug, commentData);
    
    // Return the full comment data with proper field names for frontend
    const responseData = {
      id: result.id,
      userId: result.user_id,
      userName: result.user_name,
      userAvatar: result.user_avatar,
      content: result.content,
      timestamp: result.timestamp,
      likes: result.likes || 0,
      likedBy: result.liked_by || [],
      parentId: result.parent_id,
      edited: result.edited || false
    };
    
    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
