import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* 404 Animation */}
        <div className="relative mb-12">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-blue-500 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-9xl font-bold text-[#39FF14]/10 animate-ping">
            404
          </div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Article Not Found
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/articles"
              className="bg-[#39FF14] text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#2ecc71] hover:scale-105 transition-all duration-300"
            >
              Browse All Articles
            </Link>
            
            <Link 
              href="/"
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:border-[#39FF14] hover:text-[#39FF14] transition-all duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>📚</div>
        <div className="absolute top-32 right-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>⚛️</div>
        <div className="absolute bottom-20 left-32 text-3xl animate-bounce" style={{ animationDelay: '2s' }}>🚀</div>
        <div className="absolute bottom-32 right-32 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🔷</div>
      </div>
    </div>
  );
}