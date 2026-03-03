import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { MessageSquare } from 'lucide-react';

const CommentCounter = ({ postId, refreshTrigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (!postId) return;
      
      const { count: commentCount, error } = await supabase
        .from('blog_comments')
        .select('*', { count: 'exact', head: true })
        .eq('blog_post_id', postId)
        .eq('is_approved', true);

      if (!error && commentCount !== null) {
        setCount(commentCount);
      }
    };

    fetchCount();
  }, [postId, refreshTrigger]);

  return (
    <div className="flex items-center gap-2 text-[#A855F7] bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 w-fit">
      <MessageSquare className="w-4 h-4" />
      <span className="font-semibold">{count} Yorum</span>
    </div>
  );
};

export default CommentCounter;