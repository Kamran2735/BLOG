// src/app/api/comments/[commentId]/route.js
import { NextResponse } from 'next/server';
import { updateComment, deleteComment, updateCommentLikes } from '@/lib/database';

export async function PUT(request, { params }) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    
    const { content, likes, likedBy } = body;
    
    let result;
    
    if (content !== undefined) {
      // Update comment content
      result = await updateComment(commentId, content);
    } else if (likes !== undefined && likedBy !== undefined) {
      // Update comment likes
      result = await updateCommentLikes(commentId, likes, likedBy);
    } else {
      return NextResponse.json(
        { error: 'No valid update data provided' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { commentId } = await params;
    
    const result = await deleteComment(commentId);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}