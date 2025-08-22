// =====================================
// FILE 10: app/api/admin/articles/[slug]/route.js (UPDATE EXISTING)
// =====================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch single article for editing (admin access - includes drafts)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    console.log('GET: Fetching article with slug:', slug);

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
        )
      `)
      .eq('slug', slug)
      .single();

    console.log('GET: Query result:', { data: !!data, error });

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Article not found' },
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
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT - Update article (now includes status)
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    console.log('PUT: Updating article with slug:', slug);
    console.log('PUT: Request body:', body);

    // Validate required fields
    if (!body.title || !body.slug || !body.author || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, author, content' },
        { status: 400 }
      );
    }

    // If slug is changing, check if new slug already exists
    if (body.slug !== slug) {
      const { data: existingArticle } = await supabaseAdmin
        .from('articles')
        .select('slug')
        .eq('slug', body.slug)
        .single();

      if (existingArticle) {
        return NextResponse.json(
          { error: 'Article with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update article with status
    const { data: article, error: updateError } = await supabaseAdmin
      .from('articles')
      .update({
        slug: body.slug,
        title: body.title,
        author: body.author,
        category: body.category || 'General',
        published_date: body.publishedDate || new Date().toISOString().split('T')[0],
        reading_time: body.readingTime || '5 min read',
        featured_image: body.featuredImage || null,
        excerpt: body.excerpt || '',
        content: body.content,
        status: body.status || 'published',
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single();

    console.log('PUT: Update result:', { data: !!article, error: updateError });

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
      throw updateError;
    }

    // Transform response
    const response = {
      ...article,
      publishedDate: article.published_date,
      readingTime: article.reading_time,
      featuredImage: article.featured_image
    };

    console.log('PUT: Success, returning:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT: Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete article (move to deleted_articles table)
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { reason = '', deletedBy = 'admin' } = body;

    console.log('SOFT DELETE: Moving article to deleted_articles:', slug);

    // Get the full article data including related data
    const { data: article, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select(`
        *,
        article_interactions (*),
        comments (*)
      `)
      .eq('slug', slug)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    console.log('SOFT DELETE: Found article:', article.title);

    // Move to deleted_articles table
    const { error: moveError } = await supabaseAdmin
      .from('deleted_articles')
      .insert([{
        original_article_id: article.id,
        article_data: article,
        deleted_by: deletedBy,
        reason: reason
      }]);

    if (moveError) {
      console.error('Error moving to deleted_articles:', moveError);
      throw moveError;
    }

    console.log('SOFT DELETE: Moved to deleted_articles table');

    // Delete from articles table (will cascade delete interactions and comments)
    const { error: deleteError } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      console.error('Error deleting from articles:', deleteError);
      throw deleteError;
    }

    console.log('SOFT DELETE: Success');
    return NextResponse.json({ 
      success: true, 
      message: `Article "${article.title}" moved to trash successfully. It will be permanently deleted in 30 days.`,
      deletedArticle: {
        title: article.title,
        slug: article.slug,
        author: article.author
      }
    });
  } catch (error) {
    console.error('SOFT DELETE: Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete article: ' + error.message },
      { status: 500 }
    );
  }
}