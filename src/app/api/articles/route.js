// =====================================
// FILE 11: app/api/articles/route.js (UPDATE EXISTING - for public access)
// =====================================

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch only published articles for public site
export async function GET() {
  try {
    const { data, error } = await supabase
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
        article_interactions (
          likes,
          hearts,
          laughs,
          dislikes,
          comment_count
        )
      `)
      .eq('status', 'published') // Only show published articles
      .order('published_date', { ascending: false });

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
    console.error('Error fetching published articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}