"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MdOutlineArrowOutward,
  MdSearch,
  MdViewModule,
  MdViewList,
} from "react-icons/md";
import Image from "next/image";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
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
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="mt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Error Loading Blogs
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
              <Link
                href="/"
                className="hover:bg-app-bg bg-app-bg inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-app-bg dark:text-app-bg mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <div className="bg-app-bg h-2 w-2 animate-pulse rounded-full"></div>
              Knowledge Hub
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Insights &{" "}
              <span className="text-app-bg dark:text-app-bg">Articles</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              Explore our collection of in-depth articles, tutorials, and
              industry insights crafted by our expert team.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <MdSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-app-bg w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Results Count */}
            {!loading && filteredBlogs.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredBlogs.length} article
                {filteredBlogs.length !== 1 ? "s" : ""} found
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "grid"
                    ? "text-app-bg dark:text-app-bg bg-white shadow-sm dark:bg-gray-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <MdViewModule className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "list"
                    ? "text-app-bg dark:text-app-bg bg-white shadow-sm dark:bg-gray-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <MdViewList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="border-3 border-t-app-bg dark:border-app-bg h-8 w-8 animate-spin rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Loading articles...
              </span>
            </div>
          </div>
        )}

        {!loading && currentBlogs.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={`${blog.slug}-${index}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={
                            blog.image ||
                            "/placeholder.svg?height=200&width=400&query=blog article"
                          }
                          alt={blog.title || blog.slug}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </div>
                    </Link>

                    <div className="p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-app-bg dark:text-app-bg rounded-full px-3 py-1 text-sm font-medium">
                          {blog.category || "Article"}
                        </span>
                        {blog.readTime && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {blog.readTime} min read
                          </span>
                        )}
                      </div>

                      <Link href={`/blog/${blog.slug}`} className="group/title">
                        <h2 className="group-hover/title:text-app-bg dark:group-hover/title:text-app-bg mb-3 line-clamp-2 text-xl font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
                          {blog.title || blog.slug}
                        </h2>
                      </Link>

                      {blog.excerpt && (
                        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {blog.publishedAt && (
                          <time className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(blog.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </time>
                        )}

                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-app-bg group/link hover:text-app-bg dark:hover:text-app-bg dark:text-app-bg inline-flex items-center gap-1 text-sm font-medium transition-colors"
                        >
                          Read more
                          <MdOutlineArrowOutward className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={`${blog.slug}-${index}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex flex-col md:flex-row">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="flex-shrink-0 md:w-80"
                      >
                        <div className="relative h-48 overflow-hidden md:h-full">
                          <Image
                            src={
                              blog.image ||
                              "/placeholder.svg?height=200&width=320&query=blog article"
                            }
                            alt={blog.title || blog.slug}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="mb-3 flex items-center gap-3">
                            <span className="text-app-bg dark:text-app-bg rounded-full px-3 py-1 text-sm font-medium">
                              {blog.category || "Article"}
                            </span>
                            {blog.readTime && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {blog.readTime} min read
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/blog/${blog.slug}`}
                            className="group/title"
                          >
                            <h2 className="group-hover/title:text-app-bg dark:group-hover/title:text-app-bg mb-3 text-2xl font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
                              {blog.title || blog.slug}
                            </h2>
                          </Link>

                          {blog.excerpt && (
                            <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">
                              {blog.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {blog.publishedAt && (
                            <time className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(blog.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </time>
                          )}

                          <Link
                            href={`/blog/${blog.slug}`}
                            className="hover:bg-app-bg bg-app-bg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                          >
                            Read Article
                            <MdOutlineArrowOutward className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <MdSearch className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
                {searchTerm ? "No articles found" : "No articles available"}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms.`
                  : "We're working on bringing you fresh content. Check back soon!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-app-bg bg-app-bg rounded-lg px-6 py-3 font-medium text-white transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-lg border px-4 py-2 transition-colors ${
                  currentPage === 1
                    ? "cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-app-bg text-white"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded-lg border px-4 py-2 transition-colors ${
                  currentPage === totalPages
                    ? "cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
