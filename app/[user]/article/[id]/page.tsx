'use client'
import { items } from "@/components/landing-page/blog-grid";
import { notFound } from "next/navigation";
import {use} from 'react'

export default function ArticlePage({ params }: { params: Promise<{ user: string; id: string }> }) {
  const {id} = use(params)
  const article = items.find((item) => item.id === parseInt(id));

  if (!article) {
    return notFound(); 
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <p className="text-neutral-500">
          By {article.username} | {article.views} views | {article.likes} likes | {article.comments} comments
        </p>
      </div>

      {/* Content Section */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      ></div>
    </div>
  );
}
