// src/app/api/articles/[slug]/interactions/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ARTICLES_FILE_PATH = path.join(process.cwd(), 'src/data/articles.json');

// Helper to read articles from JSON file
async function readArticles() {
  try {
    const fileContents = await fs.readFile(ARTICLES_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return Array.isArray(data) ? data : (data.articles ?? []);
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

// Helper to write articles to JSON file
async function writeArticles(articles) {
  try {
    await fs.writeFile(ARTICLES_FILE_PATH, JSON.stringify(articles, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing articles:', error);
    return false;
  }
}

// GET - Fetch interactions for a specific article
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const articles = await readArticles();
    const article = articles.find(a => a.slug === slug);
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      interactions: article.interactions || {
        reactions: { likes: 0, hearts: 0, laughs: 0, dislikes: 0 },
        comments: [],
        commentCount: 0,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 });
  }
}

// POST - Update interactions for a specific article
export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { interactions } = body;

    if (!interactions) {
      return NextResponse.json({ error: 'Interactions data required' }, { status: 400 });
    }

    const articles = await readArticles();
    const articleIndex = articles.findIndex(a => a.slug === slug);
    
    if (articleIndex === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update the article with new interactions
    articles[articleIndex] = {
      ...articles[articleIndex],
      interactions: {
        ...articles[articleIndex].interactions,
        ...interactions,
        lastUpdated: new Date().toISOString()
      }
    };

    const success = await writeArticles(articles);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save interactions' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      interactions: articles[articleIndex].interactions 
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to update interactions' }, { status: 500 });
  }
}

// PUT - Replace all interactions for a specific article
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { interactions } = body;

    const articles = await readArticles();
    const articleIndex = articles.findIndex(a => a.slug === slug);
    
    if (articleIndex === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Replace interactions completely
    articles[articleIndex].interactions = {
      reactions: interactions.reactions || { likes: 0, hearts: 0, laughs: 0, dislikes: 0 },
      comments: interactions.comments || [],
      commentCount: interactions.commentCount || 0,
      lastUpdated: new Date().toISOString()
    };

    const success = await writeArticles(articles);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save interactions' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      interactions: articles[articleIndex].interactions 
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to replace interactions' }, { status: 500 });
  }
}