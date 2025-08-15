// src/app/api/articles/[slug]/comments/route.js
import { NextResponse } from 'next/server';
import { addComment } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    const { content, userId, userName, userAvatar, parentId } = body;
    
    // Generate comment ID (matching your existing format)
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const commentData = {
      id: commentId,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked_by: [],
      parent_id: parentId || null,
      edited: false
    };

    const result = await addComment(slug, commentData);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}