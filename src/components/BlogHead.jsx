"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Calendar, User, Tag } from "lucide-react";

const BlogHead = ({ blogData }) => {
  const [animationStage, setAnimationStage] = useState(0);

  // simple unique id for gradient ids (works on any React version)
  const uid = useMemo(() => Math.random().toString(36).slice(2), []);

  useEffect(() => {
    const timeline = [
      { stage: 1, delay: 100 }, // Breadcrumb
      { stage: 2, delay: 300 }, // Meta chips
      { stage: 3, delay: 500 }, // Image
      { stage: 4, delay: 700 }, // Title
    ];
    const timers = timeline.map(({ stage, delay }) =>
      setTimeout(() => setAnimationStage(stage), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // safely read fields (no dummy defaults)
  const title = blogData?.title?.toString().trim() || "";
  const slug = blogData?.slug?.toString().trim() || "";
  const author = blogData?.author?.toString().trim() || "";
  const category = blogData?.category?.toString().trim() || "";
  const publishedDate = blogData?.publishedDate || "";
  const readingTime = blogData?.readingTime || "";
  const featuredImage = blogData?.featuredImage || "";
  const breadcrumbs = Array.isArray(blogData?.breadcrumbs) ? blogData.breadcrumbs : [];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Home → Articles → Title (use incoming last href if present, else /articles/[slug])
  const normalizedBreadcrumbs = useMemo(() => {
    const base = [
      { name: "Home", href: "/" },
      { name: "Articles", href: "/articles" },
    ];
    if (!title) return base;

    const lastFromInput = breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1] : null;
    const lastHref = (lastFromInput && lastFromInput.href) || (slug ? `/articles/${slug}` : "/articles");

    return [...base, { name: title, href: lastHref }];
  }, [breadcrumbs, title, slug]);

  const getCategoryColor = (cat) => {
    const colors = {
      "Web Development": "from-blue-500 to-blue-600",
      React: "from-cyan-500 to-cyan-600",
      CSS: "from-purple-500 to-purple-600",
      JavaScript: "from-yellow-500 to-yellow-600",
      TypeScript: "from-indigo-500 to-indigo-600",
      Backend: "from-emerald-500 to-emerald-600",
      Design: "from-pink-500 to-pink-600",
      Tutorial: "from-orange-500 to-orange-600",
      "Next.js": "from-gray-200 to-slate-300",
    };
    return (cat && colors[cat]) || "from-gray-500 to-gray-600";
  };

  // title split (safe)
  const titleWords = title ? title.split(/\s+/).filter(Boolean) : [];
  const firstPart = titleWords.length > 2 ? titleWords.slice(0, -2).join(" ") : title;
  const lastTwo = titleWords.length > 2 ? titleWords.slice(-2).join(" ") : "";
  const prettyDate = formatDate(publishedDate);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white pt-20">
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`mb-8 transition-all duration-700 ${
            animationStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <ol
            className="
              flex items-center gap-1 text-sm
              overflow-x-auto no-scrollbar
              bg-gray-800/40 border border-gray-700/60
              rounded-full px-3 py-2 backdrop-blur-sm
              max-w-full whitespace-nowrap
            "
          >
            {normalizedBreadcrumbs.map((crumb, index) => {
              const isLast = index === normalizedBreadcrumbs.length - 1;
              const gradId = `crumb-grad-${uid}-${index}`;
              return (
                <React.Fragment key={`${crumb.href || "current"}-${index}`}>
                  {index > 0 && (
                    <li aria-hidden="true" className="px-1 sm:px-2 flex items-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
                        <defs>
                          <linearGradient id={gradId} x1="0" y1="0" x2="24" y2="24">
                            <stop stopColor="#39FF14" />
                            <stop offset="1" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M8 4l8 8-8 8"
                          stroke={`url(#${gradId})`}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.9"
                        />
                      </svg>
                    </li>
                  )}

                  <li className="flex items-center">
                    {!isLast ? (
                      <a
                        href={crumb.href || "#"}
                        className="
                          group relative flex items-center
                          px-3 py-1.5 rounded-full transition-all duration-200
                          text-gray-300 hover:text-white hover:bg-gray-700/40
                        "
                        title={crumb.name}
                      >
                        <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/60 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {crumb.icon && <span className="mr-2 opacity-80">{crumb.icon}</span>}
                        <span className="truncate">{crumb.name}</span>
                      </a>
                    ) : (
                      <span
                        aria-current="page"
                        className="
                          px-3 py-1.5 rounded-full
                          bg-gray-800/20 border border-gray-700/40
                          text-gray-200
                        "
                        title={crumb.name}
                      >
                        {crumb.icon && <span className="mr-2 opacity-80">{crumb.icon}</span>}
                        <span>{crumb.name}</span>
                      </span>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>

        {/* Meta chips (only if data exists) */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 mb-10 transition-all duration-700 delay-200 ${
            animationStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {author && (
            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 hover:border-[#39FF14]/50 transition-all duration-300 group">
              <User className="w-4 h-4 text-gray-400 group-hover:text-[#39FF14] transition-colors duration-300" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                {author}
              </span>
            </div>
          )}

          {category && (
            <div
              className={`flex items-center space-x-2 bg-gradient-to-r ${getCategoryColor(
                category
              )} rounded-full px-4 py-2 hover:scale-105 transition-transform duration-300 cursor-pointer group`}
            >
              <Tag className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-bold text-white">{category}</span>
            </div>
          )}

          {prettyDate && (
            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 hover:border-[#39FF14]/50 transition-all duration-300 group">
              <Calendar className="w-4 h-4 text-gray-400 group-hover:text-[#39FF14] transition-colors duration-300" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                {prettyDate}
              </span>
            </div>
          )}

{readingTime && (
  <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2">
    <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
    <span className="text-sm font-medium text-gray-300">{readingTime}</span>
  </div>
)}
        </div>

        {/* Featured Image (optional) */}
        {featuredImage && (
          <div
            className={`relative mb-10 transition-all duration-1000 delay-400 ${
              animationStage >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative group overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700/50">
              <img
                src={featuredImage}
                alt={title || "article image"}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        )}

        {/* Title (optional) */}
        {title && (
          <div
            className={`text-center transition-all duration-1000 delay-600 ${
              animationStage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              {titleWords.length > 2 ? (
                <>
                  <span className="text-white">{firstPart}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-cyan-400 ml-2">
                    {lastTwo}
                  </span>
                </>
              ) : (
                <span className="text-white">{title}</span>
              )}
            </h1>

            <div className="flex justify-center">
              <div className="w-20 h-1 bg-gradient-to-r from-[#39FF14] to-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHead;
