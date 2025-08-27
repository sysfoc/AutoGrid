"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Eye,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Blog = () => {
  const t = useTranslations("HomePage");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) throw new Error("Failed to fetch blogs");
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

  const formatCount = (count) => {
    if (count === 0) return "0";
    if (count === 1) return "1";
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + "K";
    return (count / 1000000).toFixed(1) + "M";
  };

  const getUniqueViewsCount = (views) => {
    if (!views || !Array.isArray(views)) return 0;
    return new Set(views.map((view) => view.ip)).size;
  };

  if (error) {
    return (
      <section className="relative py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block rounded-lg p-6 dark:bg-green-900/20">
            <h3 className="text-app-bg dark:text-app-bg mb-2 text-xl font-semibold">
              Error Loading Blogs
            </h3>
            <p className="text-app-bg dark:text-app-bg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-6 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-app-bg dark:text-app-bg mb-3 inline-block rounded-full  px-4 py-1 text-sm font-medium dark:bg-green-900/30">
                Latest Updates
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
                {t("blogHeading")}
              </h2>
            </div>
            <Link href={"/blogs"} className="group">
              <div className="hover:bg-app-bg bg-app-bg flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white transition-colors">
                <span>{t("viewAll")}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
          <div className="bg-app-bg h-1 w-16 rounded-full"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="border-app-bg h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && blogs.length > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(showAll ? blogs : blogs.slice(0, INITIAL_DISPLAY_COUNT)).map(
                (blog) => (
                  <Link href={`/blog/${blog.slug}`} key={blog.slug}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={blog.image || "/sydney.jpg"}
                          alt={blog.metaTitle || blog.h1 || "Blog post"}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-4">
                        <div className="mb-3 flex-1">
                          <h3 className="group-hover:text-app-bg dark:group-hover:text-app-bg mb-2 line-clamp-2 text-lg font-semibold leading-tight text-gray-800 transition-colors dark:text-white">
                            {blog.h1 || blog.metaTitle}
                          </h3>
                          {blog.metaDescription && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                              {blog.metaDescription}
                            </p>
                          )}
                        </div>

                        {/* Date */}
                        <div className="mb-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          <time dateTime={blog.createdAt}>
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </time>
                        </div>

                        {/* Stats */}
                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                          <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <MessageCircle className="mr-1 h-3.5 w-3.5" />
                              <span>
                                {formatCount(blog.comments?.length || 0)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              <span>
                                {formatCount(getUniqueViewsCount(blog.views))}
                              </span>
                            </div>
                          </div>

                          <div className="text-app-bg group-hover:text-app-bg dark:text-app-bg flex items-center text-xs font-medium transition-colors">
                            Read more
                            <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ),
              )}
            </div>

            {/* Show More/Less Button */}
            {blogs.length > INITIAL_DISPLAY_COUNT && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="hover:bg-app-bg bg-app-bg flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors"
                >
                  <span>
                    {showAll
                      ? "Show Less"
                      : `Show More (${blogs.length - INITIAL_DISPLAY_COUNT})`}
                  </span>
                  {showAll ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-md rounded-xl p-8 dark:bg-green-900/20">
              <div className="text-app-bg dark:text-app-bg mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full  dark:bg-green-900/50">
                <svg
                  className="h-8 w-8"
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
              <h3 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">
                No Blogs Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're preparing fresh content. Check back soon for updates!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
