"use client";
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Type, 
  List, 
  Quote, 
  Code, 
  Image, 
  AlertCircle, 
  HelpCircle, 
  Zap, 
  Hash,
  Save,
  Eye,
  Edit3,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const BlogEditor = ({ onSave, initialData = null }) => {
  // Blog metadata state
  const [metadata, setMetadata] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    author: initialData?.author || '',
    category: initialData?.category || '',
    publishedDate: initialData?.publishedDate || new Date().toISOString().split('T')[0],
    readingTime: initialData?.readingTime || '',
    featuredImage: initialData?.featuredImage || '',
    excerpt: initialData?.excerpt || ''
  });

  // Content sections state
  const [content, setContent] = useState(initialData?.content || []);
  const [previewMode, setPreviewMode] = useState(false);

  // Add new section
  const addSection = (type) => {
    const newSection = createEmptySection(type);
    setContent([...content, newSection]);
  };

  // Create empty section based on type
  const createEmptySection = (type) => {
    const baseSection = { type, id: `${type}-${Date.now()}` };
    
    switch (type) {
      case 'heading':
        return { ...baseSection, level: 2, text: '' };
      case 'paragraph':
        return { ...baseSection, text: '' };
      case 'list':
        return { ...baseSection, ordered: false, items: [''] };
      case 'quote':
        return { ...baseSection, text: '', author: '' };
      case 'code':
        return { ...baseSection, language: 'javascript', code: '' };
      case 'image':
        return { ...baseSection, src: '', alt: '', caption: '' };
      case 'note':
        return { ...baseSection, noteType: 'info', title: '', text: '' };
      case 'faq':
        return { ...baseSection, items: [{ question: '', answer: '' }] };
      case 'tldr':
        return { ...baseSection, points: [''] };
      case 'tags':
        return { ...baseSection, tags: [''] };
      default:
        return baseSection;
    }
  };

  // Update section
  const updateSection = (index, updatedSection) => {
    const newContent = [...content];
    newContent[index] = updatedSection;
    setContent(newContent);
  };

  // Delete section
  const deleteSection = (index) => {
    setContent(content.filter((_, i) => i !== index));
  };

  // Move section up/down
  const moveSection = (index, direction) => {
    const newContent = [...content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < content.length) {
      [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
      setContent(newContent);
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle metadata changes
  const handleMetadataChange = (field, value) => {
    setMetadata(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  // Save blog post
  const handleSave = () => {
    const blogPost = {
      ...metadata,
      content,
      interactions: {
        reactions: { likes: 0, hearts: 0, laughs: 0, dislikes: 0 },
        comments: [],
        commentCount: 0,
        lastUpdated: new Date().toISOString()
      }
    };
    
    onSave(blogPost);
  };

  // Render section editor based on type
  const renderSectionEditor = (section, index) => {
    const commonProps = {
      className: "w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none"
    };

    switch (section.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={section.level}
                onChange={(e) => updateSection(index, { ...section, level: parseInt(e.target.value) })}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
              <input
                type="text"
                placeholder="Heading text..."
                value={section.text}
                onChange={(e) => updateSection(index, { ...section, text: e.target.value })}
                {...commonProps}
              />
            </div>
            <input
              type="text"
              placeholder="ID (optional, auto-generated if empty)"
              value={section.id || ''}
              onChange={(e) => updateSection(index, { ...section, id: e.target.value })}
              {...commonProps}
            />
          </div>
        );

      case 'paragraph':
        return (
          <textarea
            placeholder="Paragraph text..."
            value={section.text}
            onChange={(e) => updateSection(index, { ...section, text: e.target.value })}
            rows={4}
            {...commonProps}
          />
        );

      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name={`list-type-${index}`}
                  checked={!section.ordered}
                  onChange={() => updateSection(index, { ...section, ordered: false })}
                  className="mr-2"
                />
                Unordered
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name={`list-type-${index}`}
                  checked={section.ordered}
                  onChange={() => updateSection(index, { ...section, ordered: true })}
                  className="mr-2"
                />
                Ordered
              </label>
            </div>
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex gap-2">
                <input
                  type="text"
                  placeholder="List item..."
                  value={item}
                  onChange={(e) => {
                    const newItems = [...section.items];
                    newItems[itemIndex] = e.target.value;
                    updateSection(index, { ...section, items: newItems });
                  }}
                  {...commonProps}
                />
                <button
                  onClick={() => {
                    const newItems = section.items.filter((_, i) => i !== itemIndex);
                    updateSection(index, { ...section, items: newItems });
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateSection(index, { ...section, items: [...section.items, ''] })}
              className="px-4 py-2 bg-[#39FF14] text-black rounded hover:bg-[#39FF14]/80"
            >
              Add Item
            </button>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <textarea
              placeholder="Quote text..."
              value={section.text}
              onChange={(e) => updateSection(index, { ...section, text: e.target.value })}
              rows={3}
              {...commonProps}
            />
            <input
              type="text"
              placeholder="Author (optional)"
              value={section.author || ''}
              onChange={(e) => updateSection(index, { ...section, author: e.target.value })}
              {...commonProps}
            />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Language (e.g., javascript, python, bash)"
              value={section.language}
              onChange={(e) => updateSection(index, { ...section, language: e.target.value })}
              {...commonProps}
            />
            <textarea
              placeholder="Code..."
              value={section.code}
              onChange={(e) => updateSection(index, { ...section, code: e.target.value })}
              rows={6}
              className="font-mono text-sm"
              {...commonProps}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <input
              type="url"
              placeholder="Image URL"
              value={section.src}
              onChange={(e) => updateSection(index, { ...section, src: e.target.value })}
              {...commonProps}
            />
            <input
              type="text"
              placeholder="Alt text"
              value={section.alt}
              onChange={(e) => updateSection(index, { ...section, alt: e.target.value })}
              {...commonProps}
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={section.caption || ''}
              onChange={(e) => updateSection(index, { ...section, caption: e.target.value })}
              {...commonProps}
            />
            {section.src && (
              <img src={section.src} alt={section.alt} className="max-w-xs rounded border" />
            )}
          </div>
        );

      case 'note':
        return (
          <div className="space-y-3">
            <select
              value={section.noteType}
              onChange={(e) => updateSection(index, { ...section, noteType: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="success">Success</option>
            </select>
            <input
              type="text"
              placeholder="Note title"
              value={section.title}
              onChange={(e) => updateSection(index, { ...section, title: e.target.value })}
              {...commonProps}
            />
            <textarea
              placeholder="Note text..."
              value={section.text}
              onChange={(e) => updateSection(index, { ...section, text: e.target.value })}
              rows={3}
              {...commonProps}
            />
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            {section.items.map((faq, faqIndex) => (
              <div key={faqIndex} className="p-4 bg-gray-800/50 rounded border border-gray-600">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Question..."
                    value={faq.question}
                    onChange={(e) => {
                      const newItems = [...section.items];
                      newItems[faqIndex] = { ...faq, question: e.target.value };
                      updateSection(index, { ...section, items: newItems });
                    }}
                    {...commonProps}
                  />
                  <textarea
                    placeholder="Answer..."
                    value={faq.answer}
                    onChange={(e) => {
                      const newItems = [...section.items];
                      newItems[faqIndex] = { ...faq, answer: e.target.value };
                      updateSection(index, { ...section, items: newItems });
                    }}
                    rows={3}
                    {...commonProps}
                  />
                  <button
                    onClick={() => {
                      const newItems = section.items.filter((_, i) => i !== faqIndex);
                      updateSection(index, { ...section, items: newItems });
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Remove FAQ
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => updateSection(index, { 
                ...section, 
                items: [...section.items, { question: '', answer: '' }] 
              })}
              className="px-4 py-2 bg-[#39FF14] text-black rounded hover:bg-[#39FF14]/80"
            >
              Add FAQ
            </button>
          </div>
        );

      case 'tldr':
        return (
          <div className="space-y-3">
            {section.points.map((point, pointIndex) => (
              <div key={pointIndex} className="flex gap-2">
                <input
                  type="text"
                  placeholder="TL;DR point..."
                  value={point}
                  onChange={(e) => {
                    const newPoints = [...section.points];
                    newPoints[pointIndex] = e.target.value;
                    updateSection(index, { ...section, points: newPoints });
                  }}
                  {...commonProps}
                />
                <button
                  onClick={() => {
                    const newPoints = section.points.filter((_, i) => i !== pointIndex);
                    updateSection(index, { ...section, points: newPoints });
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateSection(index, { ...section, points: [...section.points, ''] })}
              className="px-4 py-2 bg-[#39FF14] text-black rounded hover:bg-[#39FF14]/80"
            >
              Add Point
            </button>
          </div>
        );

      case 'tags':
        return (
          <div className="space-y-3">
            {section.tags.map((tag, tagIndex) => (
              <div key={tagIndex} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tag..."
                  value={tag}
                  onChange={(e) => {
                    const newTags = [...section.tags];
                    newTags[tagIndex] = e.target.value;
                    updateSection(index, { ...section, tags: newTags });
                  }}
                  {...commonProps}
                />
                <button
                  onClick={() => {
                    const newTags = section.tags.filter((_, i) => i !== tagIndex);
                    updateSection(index, { ...section, tags: newTags });
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateSection(index, { ...section, tags: [...section.tags, ''] })}
              className="px-4 py-2 bg-[#39FF14] text-black rounded hover:bg-[#39FF14]/80"
            >
              Add Tag
            </button>
          </div>
        );

      default:
        return <div className="text-gray-400">Unknown section type</div>;
    }
  };

  const sectionTypeIcons = {
    heading: Type,
    paragraph: Edit3,
    list: List,
    quote: Quote,
    code: Code,
    image: Image,
    note: AlertCircle,
    faq: HelpCircle,
    tldr: Zap,
    tags: Hash
  };

  const sectionTypeLabels = {
    heading: 'Heading',
    paragraph: 'Paragraph',
    list: 'List',
    quote: 'Quote',
    code: 'Code Block',
    image: 'Image',
    note: 'Note/Callout',
    faq: 'FAQ',
    tldr: 'TL;DR',
    tags: 'Tags'
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Preview Mode</h1>
            <button
              onClick={() => setPreviewMode(false)}
              className="px-6 py-2 bg-[#39FF14] text-black rounded-lg hover:bg-[#39FF14]/80"
            >
              Back to Editor
            </button>
          </div>
          
          {/* Render preview using your existing BlogContent component structure */}
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-4">{metadata.title}</h1>
            <div className="text-gray-400 mb-8">
              By {metadata.author} • {metadata.readingTime} • {metadata.publishedDate}
            </div>
            {content.map((section, index) => (
              <div key={index} className="mb-6">
                {/* You would use your existing renderContent function here */}
                <div className="p-4 border border-gray-600 rounded">
                  <strong>{sectionTypeLabels[section.type]}</strong>: {JSON.stringify(section, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#39FF14]">Blog Editor</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[#39FF14] text-black rounded-lg hover:bg-[#39FF14]/80"
            >
              <Save className="w-4 h-4" />
              Save Article
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metadata Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-[#39FF14]">Article Metadata</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="Article title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={metadata.slug}
                    onChange={(e) => handleMetadataChange('slug', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="article-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={metadata.author}
                    onChange={(e) => handleMetadataChange('author', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={metadata.category}
                    onChange={(e) => handleMetadataChange('category', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="Category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Published Date</label>
                  <input
                    type="date"
                    value={metadata.publishedDate}
                    onChange={(e) => handleMetadataChange('publishedDate', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reading Time</label>
                  <input
                    type="text"
                    value={metadata.readingTime}
                    onChange={(e) => handleMetadataChange('readingTime', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="5 min read"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                  <input
                    type="url"
                    value={metadata.featuredImage}
                    onChange={(e) => handleMetadataChange('featuredImage', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <textarea
                    value={metadata.excerpt}
                    onChange={(e) => handleMetadataChange('excerpt', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    rows={3}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#39FF14]">Article Content</h2>

              {/* Add Section Buttons */}
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Add Section</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.entries(sectionTypeIcons).map(([type, Icon]) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-[#39FF14]/20 hover:border-[#39FF14] border border-gray-600 rounded-lg transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{sectionTypeLabels[type]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                {content.map((section, index) => {
                  const Icon = sectionTypeIcons[section.type];
                  return (
                    <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-[#39FF14]" />
                          <span className="font-medium text-[#39FF14]">
                            {sectionTypeLabels[section.type]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === content.length - 1}
                            className="p-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSection(index)}
                            className="p-1 bg-red-600 hover:bg-red-700 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {renderSectionEditor(section, index)}
                    </div>
                  );
                })}
              </div>

              {content.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No content sections yet</p>
                  <p className="text-sm">Add your first section using the buttons above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;