import React, { useState, useCallback } from 'react';
import CommentForm from '@/components/comments/CommentForm';
import CommentList from '@/components/comments/CommentList';

const CommentSection = ({ postId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  if (!postId) return null;

  return (
    <div className="mt-16 pt-10 border-t border-slate-800">
      <div className="max-w-4xl mx-auto space-y-12">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
        <CommentList postId={postId} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default CommentSection;