// src/lib/storage.js
import { supabase } from './supabase'

const BUCKET_NAME = 'blog-images'

// Upload a single image
export async function uploadImage(file, path) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${path}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return {
      success: true,
      path: fileName,
      url: publicUrl,
      data
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Upload multiple images
export async function uploadImages(files, basePath = '') {
  const results = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const timestamp = Date.now()
    const path = basePath ? `${basePath}/${timestamp}_${i}` : `${timestamp}_${i}`
    
    const result = await uploadImage(file, path)
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

// Delete an image
export async function deleteImage(path) {
  try {
    const { error } = await supabase.storage
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

// List images in a folder
export async function listImages(folder = '') {
  try {
    const { data, error } = await supabase.storage
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
        path: folder ? `${folder}/${file.name}` : file.name,
        url: getImageUrl(folder ? `${folder}/${file.name}` : file.name),
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