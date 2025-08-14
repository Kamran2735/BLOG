// src/app/articles/[slug]/page.js
import { notFound } from 'next/navigation';
import BlogHead from '@/components/BlogHead';
import BlogContent from '@/components/BlogContent';
import BlogInteraction  from '@/components/BlogInteraction';
import BlogAuthor from '@/components/BlogAuthor';
import RelatedArticles from '@/components/BlogRelated';
import rawArticles from '@/data/articles.json';

// Normalize JSON shape (array or { articles: [...] })
const allArticles = Array.isArray(rawArticles) ? rawArticles : (rawArticles.articles ?? []);

// (Optional) Pre-render all known slugs at build time
export function generateStaticParams() {
  return allArticles.map(({ slug }) => ({ slug }));
}

// (Optional) Basic SEO per article
export function generateMetadata({ params }) {
  const article = allArticles.find(a => a.slug === params.slug);
  if (!article) return { title: 'Article not found' };

  const urlBase = process.env.NEXT_PUBLIC_SITE_URL || '';
  const pageUrl = `${urlBase}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt || article.description || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || article.description || '',
      type: 'article',
      url: pageUrl,
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    alternates: { canonical: pageUrl },
  };
}

export default function ArticlePage({ params }) {
  const { slug } = params;
  const article = allArticles.find(a => a.slug === slug);
  if (!article) return notFound();

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
    id: 'current-user-id', // Replace with actual user ID logic
    name: 'Current User', // Replace with actual user name logic
    avatar: '/api/placeholder/40/40', // Placeholder avatar, replace with actual user avatar
  };
  const contentData = { content: article.content || [] };
  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${slug}`;

  return (
    <main>
      <BlogHead blogData={blogData} />
      <BlogContent contentData={contentData} blogTitle={article.title} blogUrl={blogUrl} />
      <BlogInteraction 
  articleId={article.slug}
  articleSlug={article.slug}
  initialData={article} // Pass the full article data
  currentUser={currentUser}
/>
      <BlogAuthor />

      {/* Pass ALL articles down so the child can filter */}
      <RelatedArticles
        currentCategory={blogData.category}
        currentSlug={blogData.slug}
        articles={allArticles}
      />
    </main>
  );
}
