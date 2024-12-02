"use client";

import { useMemo } from 'react';
import { InstagramPost, PostSortType } from '../instagram/types';
import { useInstagramStore } from '../instagram/store';

export function useSortedPosts() {
  const { posts, sortType, searchQuery } = useInstagramStore();

  const sortedPosts = useMemo(() => {
    // Garante que posts é um array
    const postsArray = Array.isArray(posts) ? posts : [];
    let filteredPosts = [...postsArray];

    // Aplicar filtro de busca se houver
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post?.caption?.toLowerCase().includes(query) || false
      );
    }

    // Ordenar posts com verificação de valores nulos
    return filteredPosts.sort((a, b) => {
      switch (sortType) {
        case 'date':
          return (new Date(b?.timestamp || 0).getTime()) - (new Date(a?.timestamp || 0).getTime());
        case 'likes':
          return (b?.like_count || 0) - (a?.like_count || 0);
        case 'comments':
          return (b?.comments_count || 0) - (a?.comments_count || 0);
        case 'engagement':
          return (b?.engagement_rate || 0) - (a?.engagement_rate || 0);
        default:
          return 0;
      }
    });
  }, [posts, sortType, searchQuery]);

  return sortedPosts;
}
