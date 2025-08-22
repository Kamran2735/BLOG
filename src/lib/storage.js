// =====================================
// FILE 2: lib/storage.js (REPLACE EXISTING)
// =====================================

import { supabase, supabaseAdmin } from './supabase'

const BUCKET_NAME = 'blog-images'

// Upload a single blog image with better organization
export async function uploadBlogImage(file, articleSlug = null) {
  try {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    // Organize images by article if slug provided
    const folder = articleSlug ? `articles/${articleSlug}` : 'general'
    const fileName = `${folder}/${timestamp}_${sanitizedName}`
    
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return {
      success: true,
      path: fileName,
      url: publicUrl,
      data
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Upload multiple images for an article
export async function uploadArticleImages(files, articleSlug) {
  const results = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const result = await uploadBlogImage(file, articleSlug)
    results.push({
      file: file.name,
      ...result
    })
  }
  
  return results
}

// Get public URL for an existing image
export function getImageUrl(path) {
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
  
  return publicUrl
}

// Delete an image from storage
export async function deleteBlogImage(path) {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// List images for a specific article
export async function getArticleImages(articleSlug) {
  try {
    const folder = `articles/${articleSlug}`
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0
      })

    if (error) {
      throw error
    }

    return {
      success: true,
      images: data.map(file => ({
        name: file.name,
        path: `${folder}/${file.name}`,
        url: getImageUrl(`${folder}/${file.name}`),
        size: file.metadata?.size,
        lastModified: file.updated_at
      }))
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Clean up images for a deleted article
export async function cleanupArticleImages(articleSlug) {
  try {
    const folder = `articles/${articleSlug}`
    
    // List all images in the article folder
    const { data: images, error: listError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder)

    if (listError) {
      throw listError
    }

    if (images && images.length > 0) {
      // Delete all images in the folder
      const imagePaths = images.map(img => `${folder}/${img.name}`)
      const { error: deleteError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove(imagePaths)

      if (deleteError) {
        throw deleteError
      }
    }

    return { success: true, deletedCount: images?.length || 0 }
  } catch (error) {
    console.error('Error cleaning up article images:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// List all images in the bucket (for admin)
export async function listAllImages() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        offset: 0
      })

    if (error) {
      throw error
    }

    return {
      success: true,
      images: data.map(file => ({
        name: file.name,
        path: file.name,
        url: getImageUrl(file.name),
        size: file.metadata?.size,
        lastModified: file.updated_at
      }))
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}