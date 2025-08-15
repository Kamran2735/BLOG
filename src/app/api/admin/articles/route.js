// src/app/api/admin/articles/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin client

// GET - Fetch all articles for admin
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
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
        created_at,
        updated_at,
        article_interactions (
          likes,
          hearts,
          laughs,
          dislikes,
          comment_count
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to match frontend expectations
    const transformedData = data.map(article => ({
      ...article,
      publishedDate: article.published_date,
      readingTime: article.reading_time,
      featuredImage: article.featured_image,
      article_interactions: article.article_interactions
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug || !body.author || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, author, content' },
        { status: 400 }
      );
    }

    // Check if slug already exists
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

    // Insert article
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .insert([{
        slug: body.slug,
        title: body.title,
        author: body.author,
        category: body.category || 'General',
        published_date: body.publishedDate || new Date().toISOString().split('T')[0],
        reading_time: body.readingTime || '5 min read',
        featured_image: body.featuredImage || null,
        excerpt: body.excerpt || '',
        content: body.content
      }])
      .select()
      .single();

    if (articleError) {
      throw articleError;
    }

    // Create initial interactions record
    const { error: interactionError } = await supabaseAdmin
      .from('article_interactions')
      .insert([{
        article_id: article.id,
        likes: 0,
        hearts: 0,
        laughs: 0,
        dislikes: 0,
        comment_count: 0,
        last_updated: new Date().toISOString()
      }]);

    if (interactionError) {
      console.error('Error creating interactions:', interactionError);
      // Don't fail the whole operation for this
    }

    // Transform response
    const response = {
      ...article,
      publishedDate: article.published_date,
      readingTime: article.reading_time,
      featuredImage: article.featured_image
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}