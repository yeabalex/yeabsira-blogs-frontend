"use client";
import React, { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";
import { X, Upload } from "lucide-react";
import { ApiClient } from "@/lib/api-client";
import { blogsBaseURL, webBaseURL } from "@/constants/url";
import { getCookie } from "@/lib/getCookie";

export interface ArticleData {
  title: string;
  description: string;
  thumbnail: string;
  content: string;
  topics: string[];
  likes?: number;
  views?: number;
  comments?: number;
  username?: string;
  userid?: string;
}

export default function CreateArticlePage() {
  const [article, setArticle] = useState<Partial<ArticleData>>({
    topics: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const apiClient = new ApiClient(webBaseURL);
      const imageUrl: { data: { publicUrl: string } } = await apiClient.uploadFile(
        "/image/upload/blog",
        file
      );
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticle((prev) => ({ ...prev, thumbnail: imageUrl.data.publicUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailRemove = () => {
    setArticle((prev) => ({ ...prev, thumbnail: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(""); // Clear any previous success message
    try {
      const apiClient = new ApiClient(blogsBaseURL);
      const token = getCookie("token");
      const user = getCookie("user");

      if (token && user) {
        setArticle((prev) => ({
          ...prev,
          userid: JSON.parse(user).id,
          username: JSON.parse(user).username,
          likes: 0,
          views: 0,
          comments: 0,
        }));
        apiClient.setAuthToken(token);
        await apiClient.post("/api/v1/add/article", article, { requiresAuth: true });

        setSuccessMessage("Article created successfully! 🎉");
        setArticle({ topics: [] }); // Clear the form after success
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTopic = (topic: string) => {
    if (topic && !article.topics?.includes(topic)) {
      setArticle((prev) => ({
        ...prev,
        topics: [...(prev.topics || []), topic],
      }));
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setArticle((prev) => ({
      ...prev,
      topics: prev.topics?.filter((topic) => topic !== topicToRemove),
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-black rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-spotify-green">
          Create New Article
        </h1>

        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-spotify-green font-semibold">
              Title
            </label>
            <input
              type="text"
              value={article.title || ""}
              onChange={(e) =>
                setArticle((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-spotify-green"
              required
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label className="block mb-2 text-spotify-green font-semibold">
              Description
            </label>
            <textarea
              value={article.description || ""}
              onChange={(e) =>
                setArticle((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-spotify-green h-32"
              required
              placeholder="Write a brief description"
            />
          </div>

          <div>
            <label className="block mb-2 text-spotify-green font-semibold">
              Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center bg-spotify-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                <Upload className="mr-2" size={20} />
                <span>Upload Thumbnail</span>
                <input
                  type="file"
                  onChange={handleThumbnailUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              {article.thumbnail && (
                <div className="relative">
                  <img
                    src={article.thumbnail}
                    alt="Thumbnail Preview"
                    className="max-w-xs max-h-48 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleThumbnailRemove}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-spotify-green font-semibold">
              Content
            </label>
            <RichTextEditor
              onContentChange={(content) =>
                setArticle((prev) => ({ ...prev, content }))
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-spotify-green font-semibold">
              Topics
            </label>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Add a topic (Press Enter)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    addTopic(input.value.trim());
                    input.value = "";
                  }
                }}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-spotify-green"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {article.topics?.map((topic) => (
                <span
                  key={topic}
                  className="bg-spotify-green bg-opacity-20 text-spotify-green px-3 py-1 rounded-full flex items-center space-x-2"
                >
                  <span>{topic}</span>
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="text-spotify-green hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white transition-colors ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-spotify-green hover:bg-opacity-90"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
