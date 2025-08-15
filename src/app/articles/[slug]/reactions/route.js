// src/app/api/articles/[slug]/reactions/route.js
import { NextResponse } from 'next/server';
import { updateReactions } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    const { reactionType } = body; // 'likes', 'hearts', 'laughs', 'dislikes'
    
    // For now, we'll increment the reaction by 1
    // You can enhance this to track user-specific reactions
    const reactionUpdate = {
      likes: reactionType === 'likes' ? 1 : 0,
      hearts: reactionType === 'hearts' ? 1 : 0,
      laughs: reactionType === 'laughs' ? 1 : 0,
      dislikes: reactionType === 'dislikes' ? 1 : 0
    };

    const result = await updateReactions(slug, reactionUpdate);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating reactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    const { reactions } = body; // Complete reactions object
    
    const result = await updateReactions(slug, reactions);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating reactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}