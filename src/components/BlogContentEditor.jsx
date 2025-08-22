// =====================================
// FILE 3: components/BlogEditor.js (REPLACE EXISTING)
// =====================================

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
  Upload,
  CheckCircle
} from 'lucide-react';

const BlogEditor = ({ onSave, initialData = null }) => {
  // Blog metadata state with status
  const [metadata, setMetadata] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    author: initialData?.author || '',
    category: initialData?.category || '',
    publishedDate: initialData?.publishedDate || new Date().toISOString().split('T')[0],
    readingTime: initialData?.readingTime || '',
    featuredImage: initialData?.featuredImage || '',
    excerpt: initialData?.excerpt || '',
    status: initialData?.status || 'draft'
  });

  const [content, setContent] = useState(initialData?.content || []);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Image upload handler
  const handleImageUpload = async (file, sectionIndex = null) => {
    if (!file) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (metadata.slug) {
        formData.append('articleSlug', metadata.slug);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // If this is for a specific image section, update it
      if (sectionIndex !== null) {
        const newContent = [...content];
        newContent[sectionIndex] = {
          ...newContent[sectionIndex],
          src: result.url,
          alt: file.name.split('.')[0] // Use filename as default alt text
        };
        setContent(newContent);
      }

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Enhanced featured image upload
  const handleFeaturedImageUpload = async (file) => {
    const result = await handleImageUpload(file);
    if (result?.success) {
      setMetadata(prev => ({ ...prev, featuredImage: result.url }));
    }
  };

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
      content
    };
    
    onSave(blogPost);
  };

  // Enhanced image section renderer
  const renderImageSection = (section, index) => {
    return (
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                await handleImageUpload(file, index);
              }
            }}
            className="hidden"
            id={`image-upload-${index}`}
          />
          <label
            htmlFor={`image-upload-${index}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] text-black rounded cursor-pointer hover:bg-[#39FF14]/80 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
          <span className="text-sm text-gray-400">or enter URL below</span>
        </div>
        
        <input
          type="url"
          placeholder="Or paste image URL"
          value={section.src || ''}
          onChange={(e) => updateSection(index, { ...section, src: e.target.value })}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none"
        />
        
        <input
          type="text"
          placeholder="Alt text (important for accessibility)"
          value={section.alt || ''}
          onChange={(e) => updateSection(index, { ...section, alt: e.target.value })}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none"
        />
        
        <input
          type="text"
          placeholder="Caption (optional)"
          value={section.caption || ''}
          onChange={(e) => updateSection(index, { ...section, caption: e.target.value })}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none"
        />
        
        {section.src && (
          <div className="border border-gray-600 rounded-lg overflow-hidden">
            <img 
              src={section.src} 
              alt={section.alt || 'Preview'} 
              className="max-w-full h-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {section.caption && (
              <div className="p-3 bg-gray-800 text-sm text-gray-300 border-t border-gray-600">
                <strong>Caption:</strong> {section.caption}
              </div>
            )}
          </div>
        )}
      </div>
    );
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
              className="font-mono text-sm w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#39FF14] focus:outline-none"
            />
          </div>
        );

      case 'image':
        return renderImageSection(section, index);

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
          
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-4">{metadata.title}</h1>
            <div className="text-gray-400 mb-8 flex items-center gap-4">
              <span>By {metadata.author}</span>
              <span>•</span>
              <span>{metadata.readingTime}</span>
              <span>•</span>
              <span>{metadata.publishedDate}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded text-xs ${
                metadata.status === 'published' ? 'bg-green-600' : 'bg-yellow-600 text-black'
              }`}>
                {metadata.status}
              </span>
            </div>
            {content.map((section, index) => (
              <div key={index} className="mb-6">
                <div className="p-4 border border-gray-600 rounded bg-gray-800/30">
                  <div className="text-[#39FF14] text-sm mb-2">
                    {sectionTypeLabels[section.type]}
                  </div>
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                    {JSON.stringify(section, null, 2)}
                  </pre>
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
        {/* Header with status indicator */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#39FF14]">Blog Editor</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              metadata.status === 'published' 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-600 text-black'
            }`}>
              {metadata.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
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
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2 bg-[#39FF14] text-black rounded-lg hover:bg-[#39FF14]/80 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {uploading ? 'Uploading...' : `Save as ${metadata.status}`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Metadata Section */}
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
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={metadata.status}
                    onChange={(e) => handleMetadataChange('status', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {metadata.status === 'draft' ? 'Only visible to admins' : 'Visible to public'}
                  </p>
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
                  <label className="block text-sm font-medium mb-2">Featured Image</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleFeaturedImageUpload(file);
                        }}
                        className="hidden"
                        id="featured-image-upload"
                      />
                      <label
                        htmlFor="featured-image-upload"
                        className="flex items-center gap-2 px-3 py-2 bg-[#39FF14] text-black rounded cursor-pointer hover:bg-[#39FF14]/80 text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload'}
                      </label>
                    </div>
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={metadata.featuredImage}
                      onChange={(e) => handleMetadataChange('featuredImage', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    {metadata.featuredImage && (
                      <div className="border border-gray-600 rounded overflow-hidden">
                        <img 
                          src={metadata.featuredImage} 
                          alt="Featured" 
                          className="w-full max-w-xs"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
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