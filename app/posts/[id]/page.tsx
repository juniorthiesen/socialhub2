import { Metadata } from 'next';
import { PostDetails } from '@/components/posts/post-details';

interface PostPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Post Details',
  description: 'View post details and engagement',
};

export default function PostPage({ params }: PostPageProps) {
  return <PostDetails postId={params.id} />;
}