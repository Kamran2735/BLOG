// =====================================
// FILE 8: app/api/admin/deleted-articles/[id]/permanent/route.js (NEW FILE)
// =====================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    console.log('Permanently deleting article with delete ID:', id);

    // Get the deleted article to clean up any associated images
    const { data: deletedArticle, error: fetchError } = await supabaseAdmin
      .from('deleted_articles')
      .select('article_data')
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

    // Clean up images associated with this article
    if (articleData.slug) {
      try {
        console.log('Cleaning up images for article:', articleData.slug);
        
        // List all images for this article
        const { data: images, error: listError } = await supabaseAdmin.storage
          .from('blog-images')
          .list(`articles/${articleData.slug}`);

        if (listError) {
          console.error('Error listing images:', listError);
        } else if (images && images.length > 0) {
          // Delete all images in the article folder
          const imagePaths = images.map(img => `articles/${articleData.slug}/${img.name}`);
          const { error: deleteImagesError } = await supabaseAdmin.storage
            .from('blog-images')
            .remove(imagePaths);

          if (deleteImagesError) {
            console.error('Error deleting images:', deleteImagesError);
          } else {
            console.log(`Deleted ${images.length} images for article ${articleData.slug}`);
          }
        }
      } catch (imageError) {
        console.error('Error cleaning up images:', imageError);
        // Don't fail the operation for image cleanup errors
      }
    }

    // Permanently delete from deleted_articles table
    const { error: deleteError } = await supabaseAdmin
      .from('deleted_articles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Permanent delete error:', deleteError);
      throw deleteError;
    }

    console.log('Permanent deletion completed successfully');

    return NextResponse.json({ 
      success: true, 
      message: `Article "${articleData.title}" permanently deleted`,
      deletedArticle: {
        title: articleData.title,
        slug: articleData.slug,
        author: articleData.author
      }
    });

  } catch (error) {
    console.error('Error permanently deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to permanently delete article: ' + error.message },
      { status: 500 }
    );
  }
}