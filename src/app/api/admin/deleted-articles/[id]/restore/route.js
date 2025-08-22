// =====================================
// FILE 7: app/api/admin/deleted-articles/[id]/restore/route.js (NEW FILE)
// =====================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    console.log('Restoring article with delete ID:', id);

    // Get deleted article data
    const { data: deletedArticle, error: fetchError } = await supabaseAdmin
      .from('deleted_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Deleted article fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Deleted article not found' },
        { status: 404 }
      );
    }

    const articleData = deletedArticle.article_data;
    console.log('Found deleted article:', articleData.title);

    // Check if slug conflicts with existing article
    const { data: existingArticle } = await supabaseAdmin
      .from('articles')
      .select('slug')
      .eq('slug', articleData.slug)
      .single();

    let finalSlug = articleData.slug;
    if (existingArticle) {
      // Generate new slug if conflict
      finalSlug = `${articleData.slug}-restored-${Date.now()}`;
      console.log('Slug conflict detected, using new slug:', finalSlug);
    }

    // Restore to articles table as draft
    const { data: restoredArticle, error: restoreError } = await supabaseAdmin
      .from('articles')
      .insert([{
        slug: finalSlug,
        title: articleData.title,
        author: articleData.author,
        category: articleData.category,
        published_date: articleData.published_date,
        reading_time: articleData.reading_time,
        featured_image: articleData.featured_image,
        excerpt: articleData.excerpt,
        content: articleData.content,
        status: 'draft', // Always restore as draft for safety
        created_at: articleData.created_at,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (restoreError) {
      console.error('Article restore error:', restoreError);
      throw restoreError;
    }

    console.log('Article restored with ID:', restoredArticle.id);

    // Restore interactions if they exist
    if (articleData.article_interactions?.[0]) {
      const interaction = articleData.article_interactions[0];
      const { error: interactionError } = await supabaseAdmin
        .from('article_interactions')
        .insert([{
          article_id: restoredArticle.id,
          likes: interaction.likes || 0,
          hearts: interaction.hearts || 0,
          laughs: interaction.laughs || 0,
          dislikes: interaction.dislikes || 0,
          comment_count: interaction.comment_count || 0,
          last_updated: new Date().toISOString()
        }]);

      if (interactionError) {
        console.error('Error restoring interactions:', interactionError);
      }
    } else {
      // Create new interactions record
      await supabaseAdmin
        .from('article_interactions')
        .insert([{
          article_id: restoredArticle.id,
          likes: 0,
          hearts: 0,
          laughs: 0,
          dislikes: 0,
          comment_count: 0,
          last_updated: new Date().toISOString()
        }]);
    }

    // Restore comments if they exist
    if (articleData.comments?.length > 0) {
      const commentsToRestore = articleData.comments.map(comment => ({
        ...comment,
        article_id: restoredArticle.id,
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));

      const { error: commentsError } = await supabaseAdmin
        .from('comments')
        .insert(commentsToRestore);

      if (commentsError) {
        console.error('Error restoring comments:', commentsError);
      }
    }

    // Remove from deleted_articles table
    const { error: removeError } = await supabaseAdmin
      .from('deleted_articles')
      .delete()
      .eq('id', id);

    if (removeError) {
      console.error('Error removing from deleted_articles:', removeError);
      // Don't fail the operation for this
    }

    console.log('Restore operation completed successfully');

    return NextResponse.json({ 
      success: true, 
      message: `Article "${articleData.title}" restored successfully as draft${finalSlug !== articleData.slug ? ` with new slug: ${finalSlug}` : ''}`,
      restoredSlug: finalSlug,
      restoredArticle: {
        id: restoredArticle.id,
        title: restoredArticle.title,
        slug: finalSlug,
        status: 'draft'
      }
    });

  } catch (error) {
    console.error('Error restoring article:', error);
    return NextResponse.json(
      { error: 'Failed to restore article: ' + error.message },
      { status: 500 }
    );
  }
}