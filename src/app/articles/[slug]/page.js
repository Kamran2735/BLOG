// src/app/articles/[slug]/page.js
import { notFound } from 'next/navigation';
import BlogHead from '@/components/BlogHead';
import BlogContent from '@/components/BlogContent';
import BlogInteraction from '@/components/BlogInteraction';
import BlogAuthor from '@/components/BlogAuthor';
import RelatedArticles from '@/components/BlogRelated';
import { getArticleBySlug, getArticleSlugs, getPublishedArticles } from '@/lib/database';
// Pre-render all known slugs at build time
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Basic SEO per article
export async function generateMetadata({ params }) {
  const { slug } = await params; // ⬅️ await params
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article not found' };

  const urlBase = process.env.NEXT_PUBLIC_SITE_URL || '';
  const pageUrl = `${urlBase}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      type: 'article',
      url: pageUrl,
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    alternates: { canonical: pageUrl },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params; // ⬅️ await params

  // Fetch the specific article
  const article = await getArticleBySlug(slug);
  if (!article) return notFound();

  // Fetch all articles for related articles component
  const allArticles = await getPublishedArticles();

  const blogData = {
    title: article.title,
    slug: article.slug,
    author: article.author || 'Unknown',
    category: article.category || 'General',
    publishedDate: article.publishedDate,
    featuredImage: article.featuredImage,
    readingTime: article.readingTime,
  };

  const currentUser = {
    id: 'current-user-id',
    name: 'Current User',
    avatar: '/api/placeholder/40/40',
  };

  const contentData = { content: article.content || [] };
  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${slug}`;

  return (
    <main>
      <BlogHead blogData={blogData} />
      <BlogContent contentData={contentData} blogTitle={article.title} blogUrl={blogUrl} />
      <BlogAuthor />
      <BlogInteraction
        articleId={article.slug}
        articleSlug={article.slug}
        initialData={article}
        currentUser={currentUser}
      />
      <RelatedArticles
        currentCategory={blogData.category}
        currentSlug={blogData.slug}
        articles={allArticles}
      />
    </main>
  );
}

// Enable ISR for dynamic updates
export const revalidate = 3600;
