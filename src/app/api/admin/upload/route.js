// =====================================
// FILE 5: app/api/admin/upload/route.js (NEW FILE)
// =====================================

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const articleSlug = formData.get('articleSlug');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate file path
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = articleSlug ? `articles/${articleSlug}` : 'general';
    const fileName = `${folder}/${timestamp}_${sanitizedName}`;

    console.log('Uploading file:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    console.log('Upload successful:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: fileName,
      size: file.size,
      type: file.type,
      originalName: file.name
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image: ' + error.message },
      { status: 500 }
    );
  }
}

// GET - List uploaded images for an article
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleSlug = searchParams.get('articleSlug');
    
    if (!articleSlug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    const folder = `articles/${articleSlug}`;
    const { data, error } = await supabaseAdmin.storage
      .from('blog-images')
      .list(folder, {
        limit: 100,
        offset: 0
      });

    if (error) {
      throw error;
    }

    const images = data.map(file => ({
      name: file.name,
      path: `${folder}/${file.name}`,
      url: supabaseAdmin.storage.from('blog-images').getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
      size: file.metadata?.size,
      lastModified: file.updated_at
    }));

    return NextResponse.json({
      success: true,
      images
    });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images: ' + error.message },
      { status: 500 }
    );
  }
}