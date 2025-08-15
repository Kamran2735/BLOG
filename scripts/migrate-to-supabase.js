// scripts/migrate-to-supabase.js
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
)

async function migrateData() {
  try {
    // Read the JSON file
    const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json')
    const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'))

    console.log(`Found ${articlesData.length} articles to migrate`)

    for (const article of articlesData) {
      console.log(`Migrating: ${article.title}`)

      // Insert article
      const { data: insertedArticle, error: articleError } = await supabase
        .from('articles')
        .insert([{
          slug: article.slug,
          title: article.title,
          author: article.author,
          category: article.category,
          published_date: article.publishedDate,
          reading_time: article.readingTime,
          featured_image: article.featuredImage,
          excerpt: article.excerpt,
          content: article.content
        }])
        .select()
        .single()

      if (articleError) {
        console.error(`Error inserting article ${article.slug}:`, articleError)
        continue
      }

      // Insert interactions
      const { error: interactionError } = await supabase
        .from('article_interactions')
        .insert([{
          article_id: insertedArticle.id,
          likes: article.interactions.reactions.likes,
          hearts: article.interactions.reactions.hearts,
          laughs: article.interactions.reactions.laughs,
          dislikes: article.interactions.reactions.dislikes,
          comment_count: article.interactions.commentCount || 0,
          last_updated: article.interactions.lastUpdated
        }])

      if (interactionError) {
        console.error(`Error inserting interactions for ${article.slug}:`, interactionError)
      }

      // Insert comments
      if (article.interactions.comments && article.interactions.comments.length > 0) {
        const commentsToInsert = article.interactions.comments.map(comment => ({
          id: comment.id,
          article_id: insertedArticle.id,
          user_id: comment.userId,
          user_name: comment.userName,
          user_avatar: comment.userAvatar,
          content: comment.content,
          timestamp: comment.timestamp,
          likes: comment.likes || 0,
          liked_by: comment.likedBy || [],
          parent_id: comment.parentId,
          edited: comment.edited || false
        }))

        // Insert parent comments first
        const parentComments = commentsToInsert.filter(c => !c.parent_id)
        if (parentComments.length > 0) {
          const { error: parentCommentError } = await supabase
            .from('comments')
            .insert(parentComments)

          if (parentCommentError) {
            console.error(`Error inserting parent comments for ${article.slug}:`, parentCommentError)
          }
        }

        // Then insert reply comments
        const replyComments = commentsToInsert.filter(c => c.parent_id)
        if (replyComments.length > 0) {
          const { error: replyCommentError } = await supabase
            .from('comments')
            .insert(replyComments)

          if (replyCommentError) {
            console.error(`Error inserting reply comments for ${article.slug}:`, replyCommentError)
          }
        }
      }

      console.log(`✅ Successfully migrated: ${article.title}`)
    }

    console.log('🎉 Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateData()