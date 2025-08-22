// =====================================
// FILE 6: app/api/admin/deleted-articles/route.js (NEW FILE)
// =====================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('deleted_articles')
      .select('*')
      .order('deleted_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to include article info from JSON
    const transformedData = data.map(item => ({
      deleteId: item.id,
      deletedAt: item.deleted_at,
      deletedBy: item.deleted_by,
      reason: item.reason,
      permanentDeleteAt: item.permanent_delete_at,
      // Extract article data from JSON
      id: item.article_data.id,
      slug: item.article_data.slug,
      title: item.article_data.title,
      author: item.article_data.author,
      category: item.article_data.category,
      publishedDate: item.article_data.published_date,
      readingTime: item.article_data.reading_time,
      featuredImage: item.article_data.featured_image,
      excerpt: item.article_data.excerpt,
      status: item.article_data.status
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching deleted articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deleted articles' },
      { status: 500 }
    );
  }
}