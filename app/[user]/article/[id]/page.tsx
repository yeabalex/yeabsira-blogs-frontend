'use client'
import {use} from 'react'
import Article from '@/components/article-page';

export default function ArticlePage({ params }: { params: Promise<{ user: string; id: string }> }) {
  const {id} = use(params)


  return (
    <Article id={id}/>
  );
}
