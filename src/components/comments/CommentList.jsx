
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Loader2, MessageCircle, Reply, RefreshCw } from 'lucide-react';
import ReplyForm from './ReplyForm';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

const CommentItem = ({ comment, replies, postId, onReplyAdded }) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative p-6 rounded-lg shadow-sm border border-primary bg-gradient-to-r from-[#e50914] to-[#b20710] group hover:shadow-md transition-all duration-300">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm shrink-0">
            <AvatarFallback className="bg-primary text-primary font-bold">
              {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h5 className="font-bold text-primary truncate pr-2">
                {comment.author_name}
              </h5>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                </span>
                {replies && replies.length > 0 && (
                  <span className="text-xs font-medium text-primary bg-primary px-2 py-0.5 rounded-full">
                    {replies.length} Cevap
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            <div className="mt-3 flex items-center pt-3 border-t border-primary/50">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsReplying(!isReplying)}
                className="text-primary hover:text-primary hover:bg-primary/50 px-2 h-8 text-xs font-medium transition-colors"
              >
                <Reply className="w-3 h-3 mr-1.5" />
                Cevapla
              </Button>
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="mt-4 pl-14">
            <ReplyForm 
              postId={postId} 
              parentCommentId={comment.id}
              onReplyAdded={() => {
                setIsReplying(false);
                onReplyAdded();
              }}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>

      {replies && replies.length > 0 && (
        <div className="ml-8 mt-3 pl-4 border-l-4 border-primary space-y-3">
          {replies.map(reply => (
            <div key={reply.id} className="relative p-4 rounded-lg bg-gray-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 border border-white shrink-0">
                  <AvatarFallback className="bg-[#141414] text-blue-700 text-xs font-bold">
                    {reply.author_name ? reply.author_name.charAt(0).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h6 className="font-semibold text-primary text-sm">
                      {reply.author_name}
                    </h6>
                    <span className="text-[10px] text-slate-400">
                      {reply.created_at && formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: tr })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CommentList = React.memo(({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localRefresh, setLocalRefresh] = useState(0);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await executeSupabaseQuery(
        () => supabase.from('blog_comments')
          .select('*')
          .eq('blog_post_id', postId)
          .eq('is_approved', true) 
          .order('created_at', { ascending: true }),
        { retries: 3, context: 'fetch_comments', fallback: [] }
      );

      if (fetchError) throw fetchError;
      setComments(data || []);
    } catch (err) {
      setError("Yorumlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger, localRefresh]);

  const { rootComments, repliesByParent } = useMemo(() => {
    const root = [];
    const byParent = {};
    comments.forEach(comment => {
      if (!comment.parent_comment_id) {
        root.push(comment);
      } else {
        if (!byParent[comment.parent_comment_id]) byParent[comment.parent_comment_id] = [];
        byParent[comment.parent_comment_id].push(comment);
      }
    });
    root.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rootComments: root, repliesByParent: byParent };
  }, [comments]);

  const handleReplyAdded = () => setLocalRefresh(prev => prev + 1);

  if (error) {
    return (
      <div className="mt-8 text-center p-6 bg-red-900/20 rounded-xl border border-red-900/50">
        <p className="text-red-400 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchComments} className="border-red-800 text-red-400 hover:bg-red-900/50">
          <RefreshCw className="w-4 h-4 mr-2" /> Tekrar Dene
        </Button>
      </div>
    );
  }

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-6 mt-8">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-lg bg-[#0a0a0a]/20 border border-slate-800 animate-pulse flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0a0a0a]/50 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-[#0a0a0a]/50 rounded w-1/3" />
              <div className="h-16 bg-[#0a0a0a]/50 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-white">
          Yorumlar <span className="text-slate-500 text-lg font-normal">({comments.length})</span>
        </h3>
      </div>

      {rootComments.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-[#0a0a0a]/30 border border-dashed border-slate-700">
          <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Henüz yorum yapılmamış.</p>
          <p className="text-slate-500 text-sm mt-1">İlk yorumu siz yaparak sohbete katılın!</p>
        </div>
      ) : (
        <div>
          {rootComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              replies={repliesByParent[comment.id]} 
              postId={postId}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CommentList.displayName = 'CommentList';
export default CommentList;
