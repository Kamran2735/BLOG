// src/app/api/admin/articles/[slug]/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single article for editing
export async function GET(request, { params }) {
  try {
    const { slug } = params;

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
        )
      `)
      .eq('slug', slug)
      .single();

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

// PUT - Update article
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.author || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, author, content' },
        { status: 400 }
      );
    }

    // If slug is changing, check if new slug already exists
    if (body.slug !== slug) {
      const { data: existingArticle } = await supabase
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

    // Update article
    const { data: article, error: updateError } = await supabase
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
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single();

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

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete article
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;

    // Get article ID first
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('id')
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

    // Delete article (this will cascade delete interactions and comments due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}