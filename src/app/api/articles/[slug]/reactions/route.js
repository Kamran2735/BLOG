// src/app/api/articles/[slug]/reactions/route.js
import { NextResponse } from 'next/server';
import { updateReactions } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    // Ensure params is awaited (Next.js 13+ requirement)
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    console.log('=== REACTIONS API DEBUG ===');
    console.log('Slug:', slug);
    
    if (!slug) {
      console.log('ERROR: No slug provided');
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.log('ERROR: Invalid JSON in request body');
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log('Request body:', body);
    
    const { reactions } = body;
    
    if (!reactions || typeof reactions !== 'object') {
      console.log('ERROR: No reactions data provided or invalid format');
      return NextResponse.json(
        { error: 'Valid reactions data required' },
        { status: 400 }
      );
    }
    
    // Validate reaction structure
    const validReactionTypes = ['likes', 'hearts', 'laughs', 'dislikes'];
    const sanitizedReactions = {};
    
    for (const [key, value] of Object.entries(reactions)) {
      if (validReactionTypes.includes(key)) {
        sanitizedReactions[key] = Math.max(0, parseInt(value) || 0);
      }
    }
    
    console.log('Sanitized reactions:', sanitizedReactions);
    console.log('Calling updateReactions with:', sanitizedReactions);
    
    const result = await updateReactions(slug, sanitizedReactions);
    
    console.log('Update result:', result);
    console.log('=== END REACTIONS API DEBUG ===');
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Reactions updated successfully'
    });
  } catch (error) {
    console.error('=== REACTIONS API ERROR ===');
    console.error('Error updating reactions:', error);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== END ERROR ===');
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update reactions',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Also add a GET method to fetch current reactions
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }
    
    // Import your database function to get article data
    const { getArticleBySlug } = await import('@/lib/database');
    const article = await getArticleBySlug(slug);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      reactions: article.interactions?.reactions || {
        likes: 0,
        hearts: 0,
        laughs: 0,
        dislikes: 0
      }
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

