"use client";
import React, { useState } from 'react';
import CategoriesOverviewSection from '@/components/categories';
import AllArticlesSection from '@/components/articlessection';

const ArticleClient = () => {
  const [articlesSectionTab, setArticlesSectionTab] = useState('All');
  const handleNavigateToArticles = (categoryName) => {
      

    setArticlesSectionTab(categoryName);
    
    // Scroll to all articles section
    const allArticlesSection = document.getElementById('all-articles-section');
    if (allArticlesSection) {
      allArticlesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <CategoriesOverviewSection onNavigateToArticles={handleNavigateToArticles} />
      <div id="all-articles-section">
        <AllArticlesSection 
          initialActiveTab={articlesSectionTab} 
          onTabChange={setArticlesSectionTab}
        />
      </div>
    </>
  );
};

export default ArticleClient;