"use client";
import React from 'react';

const Breadcrumb = ({ 
  items = [], 
  showHome = true, 
  className = "",
  variant = "default" // "default", "minimal", "hero"
}) => {
  // Default home item
  const homeItem = { label: "Home", href: "/" };
  
  // Combine home with provided items if showHome is true
  const allItems = showHome ? [homeItem, ...items] : items;

  // Variant styles
  const variants = {
    default: {
      container: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-12",
      wrapper: "bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6",
      text: "text-gray-300",
      activeText: "text-[#39FF14]",
      separator: "text-gray-500"
    },
    hero: {
      container: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-20",
      wrapper: "text-center",
      text: "text-gray-300",
      activeText: "text-[#39FF14]",
      separator: "text-gray-500"
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
<section 
  className={`relative overflow-hidden ${currentVariant.container} ${className}`}
  style={{
    borderBottom: '2px solid transparent', // Required for border-image to work
    borderImage: 'linear-gradient(to right, #39FF14, #1e90ff) 1',
  }}
>



      <div className="container mx-auto px-6 relative z-10">
        <div className={currentVariant.wrapper}>
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm pt-10" aria-label="Breadcrumb">
            {allItems.map((item, index) => {
              const isLast = index === allItems.length - 1;
              const isFirst = index === 0;

              return (
                <div key={index} className="flex items-center space-x-2">
                  {/* Home Icon for first item */}
                  {isFirst && showHome && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-[#39FF14] rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-xs"></div>
                      </div>
                    </div>
                  )}

                  {/* Breadcrumb Item */}
                  {isLast ? (
                    <span 
                      className={`font-medium ${currentVariant.activeText} ${variant === "hero" ? "text-lg" : ""}`}
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      className={`${currentVariant.text} hover:text-[#39FF14] transition-colors duration-300 hover:underline ${variant === "hero" ? "text-lg" : ""}`}
                    >
                      {item.label}
                    </a>
                  )}

                  {/* Separator */}
                  {!isLast && (
                    <span className={`${currentVariant.separator} select-none`}>
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Additional Hero Content for hero variant */}
          {variant === "hero" && items.length > 0 && (
            <div className="mt-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
                  {items[items.length - 1].label}
                </span>
              </h1>
              {items[items.length - 1].description && (
                <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
                  {items[items.length - 1].description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Breadcrumb;




