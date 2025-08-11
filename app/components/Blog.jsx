// "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp, MessageCircle, Eye, Calendar } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Blog = () => {
  const t = useTranslations("HomePage");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const INITIAL_DISPLAY_COUNT = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleToggleView = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowAll(!showAll);
      setIsTransitioning(false);
    }, 150);
  };

  const displayedBlogs = showAll
    ? blogs
    : blogs.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreBlogs = blogs.length > INITIAL_DISPLAY_COUNT;

  // Helper function to format numbers
  const formatCount = (count) => {
    if (count === 0) return "0";
    if (count === 1) return "1";
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + "K";
    return (count / 1000000).toFixed(1) + "M";
  };

  // Helper function to get unique views count
  const getUniqueViewsCount = (views) => {
    if (!views || !Array.isArray(views)) return 0;
    const uniqueIPs = new Set(views.map(view => view.ip));
    return uniqueIPs.size;
  };

  if (error) {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-850"></div>
        <div className="relative px-4 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="rounded-3xl border border-red-200/50 bg-red-50/70 p-6 backdrop-blur-md dark:border-red-500/20 dark:bg-red-950/20">
              <h3 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
                Error Loading Blogs
              </h3>
              <p className="text-gray-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-850"></div>

      {/* Animated background elements */}
      <div className="absolute left-0 top-0 h-72 w-72 animate-pulse rounded-full bg-blue-500/10 blur-3xl dark:bg-gray-700/10"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000 dark:bg-gray-800/10"></div>

      <div className="relative px-4 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-12 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-block">
                  <div className="rounded-full border border-gray-200/50 bg-white/80 px-6 py-2 backdrop-blur-sm dark:border-white/20 dark:bg-white/10">
                    <span className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                      Latest Updates
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-gray-800 dark:text-gray-100 md:text-4xl lg:text-5xl">
                  {t("blogHeading")}
                </h2>
              </div>
              <Link href={"/blogs"} className="group">
                <div className="flex transform items-center gap-3 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-xl">
                  <span>{t("viewAll")}</span>
                  <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
            <div className="h-1 w-24 rounded-full bg-red-600"></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-red-600/30 border-t-red-600"></div>
                <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full border-4 border-transparent border-t-red-600/50"></div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && blogs.length > 0 && (
            <div className="space-y-8">
              <div
                className={`grid grid-cols-1 gap-6 transition-all duration-500 ease-in-out md:grid-cols-2 lg:grid-cols-3 ${
                  isTransitioning
                    ? "scale-98 transform opacity-50"
                    : "scale-100 transform opacity-100"
                }`}
              >
                {displayedBlogs.map((blog, index) => (
                  <Link
                    href={`/blog/${blog.slug}`}
                    key={`${blog.slug}-${index}`}
                  >
                    <article
                      className="group relative flex h-[480px] transform cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 dark:border-white/20 dark:bg-white/10 dark:hover:shadow-blue-500/25"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Background glow effect */}
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-blue-500/10"></div>
                      
                      <div className="relative z-10 flex h-full flex-col">
                        {/* Image Section */}
                        <div className="relative overflow-hidden">
                          <div className="relative h-48">
                            <Image
                              src={blog.image || "/sydney.jpg"}
                              alt={blog.metaTitle || blog.h1 || "Blog post"}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-1 flex-col justify-between p-6">
                          <div className="space-y-3">
                            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-gray-800 transition-colors duration-300 hover:text-red-600 dark:text-gray-100 dark:hover:text-red-400 md:text-xl">
                              {blog.h1 || blog.metaTitle}
                            </h3>

                            {blog.metaDescription && (
                              <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {blog.metaDescription}
                              </p>
                            )}
                          </div>

                          {/* Stats Section */}
                          <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <time dateTime={blog.createdAt}>
                                  {new Date(blog.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </time>
                              </div>
                            </div>

                            {/* Engagement Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  <span>
                                    {formatCount(blog.comments?.length || 0)} 
                                    {blog.comments?.length === 1 ? " comment" : " comments"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>
                                    {formatCount(getUniqueViewsCount(blog.views))} 
                                    {getUniqueViewsCount(blog.views) === 1 ? " view" : " views"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex translate-x-2 transform items-center space-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                <div className="h-0.5 w-6 rounded-full bg-red-600"></div>
                                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                  Read More
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Show More/Less Button */}
              {hasMoreBlogs && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleToggleView}
                    disabled={isTransitioning}
                    className="group flex transform items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span>
                      {showAll
                        ? "Show Less"
                        : `Show More (${blogs.length - INITIAL_DISPLAY_COUNT} more)`}
                    </span>
                    {showAll ? (
                      <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && blogs.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200/50 bg-white/70 p-10 backdrop-blur-md dark:border-white/20 dark:bg-white/10">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
                  <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  No Blogs Available
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  We're working on bringing you fresh content. Check back soon for the latest updates!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute left-0 right-0 top-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-12 w-full rotate-180 transform fill-gray-900 dark:fill-white"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Blog;