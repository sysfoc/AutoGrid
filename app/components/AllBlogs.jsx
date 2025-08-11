"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineArrowOutward, MdSearch } from "react-icons/md";
import Image from "next/image";

const BlogsPage = () => {

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.blogs);
        setFilteredBlogs(data.blogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen mt-32 bg-gradient-to-br from-gray-50 via-red-50 to-red-100 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-md bg-red-50/70 dark:bg-red-900/20 border border-red-200/50 dark:border-red-500/20 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Blogs</h2>
              <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors">
                <span>Go Back Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 via-red-50 to-red-100 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900">
     
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000000%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 dark:bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700/10 dark:bg-red-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
         
          <div className="flex-shrink-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-red-800 to-red-900 dark:from-white dark:via-red-100 dark:to-red-200 bg-clip-text text-transparent">
                Our Blog
              </span>
            </h1>
            
            <p className="text-gray-600 dark:text-red-100/80 mb-4">
              Discover insights, tutorials, and stories from our team
            </p>
            
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
          </div>

          <div className="flex-1 max-w-2xl lg:max-w-none">
            <div className="backdrop-blur-md bg-white/70 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-2xl p-4">
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {!loading && filteredBlogs.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-red-100/80 text-center text-sm">
              {`Showing ${indexOfFirstBlog + 1}-${Math.min(indexOfLastBlog, filteredBlogs.length)} of ${filteredBlogs.length} articles`}
            </p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-200 dark:border-red-800 rounded-full animate-spin border-t-red-700 dark:border-t-red-400"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-red-600/50"></div>
            </div>
          </div>
        )}

        {!loading && currentBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {currentBlogs.map((blog, index) => (
              <article
                key={`${blog.slug}-${index}`}
                className="group relative backdrop-blur-md bg-white/70 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/10 dark:hover:shadow-red-600/25"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-red-600/5 dark:bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="relative overflow-hidden">
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="relative h-48">
                        <Image
                          src={blog.image || "/sydney.jpg"}
                          alt={blog.title || blog.slug}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-r from-red-600 to-red-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {blog.category || "Article"}
                      </span>
                      {blog.readTime && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {blog.readTime} min read
                        </span>
                      )}
                    </div>

                    <Link href={`/blog/${blog.slug}`} className="group/title">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover/title:text-red-700 dark:group-hover/title:text-red-400 transition-colors duration-300 line-clamp-2">
                        {blog.title || blog.slug}
                      </h2>
                    </Link>
                    
                    {blog.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}

                    {blog.publishedAt && (
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
                      <span className="text-sm text-red-700 dark:text-red-400 font-medium">Read Article</span>
                      <MdOutlineArrowOutward className="w-4 h-4 text-red-700 dark:text-red-400" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="backdrop-blur-md bg-white/70 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-3xl p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdSearch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {searchTerm ? "No articles found" : "No articles available"}
              </h3>
              <p className="text-gray-600 dark:text-red-100/80 mb-4">
                {searchTerm 
                  ? `We couldn't find any articles matching "${searchTerm}"`
                  : "We are working on bringing you fresh content. Check back soon!"
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <div className="backdrop-blur-md bg-white/70 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-2xl p-2">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentPage === 1
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-red-600/10 dark:hover:bg-red-600/20'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-red-600/10 dark:hover:bg-red-600/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-red-600/10 dark:hover:bg-red-600/20'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;