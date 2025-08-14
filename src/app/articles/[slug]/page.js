// src/app/articles/[slug]/page.js
import { notFound } from 'next/navigation';
import BlogHead from '@/components/BlogHead';
import BlogContent from '@/components/BlogContent';
import articles from '@/data/articles.json'; // create this file (example schema below)

// (Optional) Pre-render all known slugs at build time
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

// (Optional) Basic SEO per article
export function generateMetadata({ params }) {
  const article = articles.find(a => a.slug === params.slug);
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
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function ArticlePage({ params }) {
  const { slug } = params;
  const article = articles.find(a => a.slug === slug);

  if (!article) return notFound();

  // Build props for BlogHead
  const blogData = {
    title: article.title,
    slug: article.slug,
    author: article.author || 'Unknown',
    category: article.category || 'General',
    publishedDate: article.publishedDate,
    featuredImage: article.featuredImage,
    readingTime: article.readingTime,
  };

  // Build props for BlogContent
  const contentData = {
    content: article.content || [], // must match your BlogContent schema
  };

  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${slug}`;

  return (
    <main>
      <BlogHead blogData={blogData} />
      <BlogContent
        contentData={contentData}
        blogTitle={article.title}
        blogUrl={blogUrl}
      />
    </main>
  );
}
