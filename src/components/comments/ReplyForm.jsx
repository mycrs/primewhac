import React, { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2, X } from 'lucide-react';

const ReplyForm = ({ postId, parentCommentId, onReplyAdded, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) return "İsim alanı zorunludur.";
    if (!formData.content.trim()) return "Cevap içeriği boş olamaz.";
    return null;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: error,
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error: supabaseError } = await supabase
        .from('blog_comments')
        .insert([
          {
            blog_post_id: postId,
            parent_comment_id: parentCommentId,
            author_name: formData.name,
            author_email: 'reply@example.com', // Placeholder as email input wasn't requested for replies
            content: formData.content,
            is_approved: true // Auto-approve per policy
          }
        ]);

      if (supabaseError) throw supabaseError;

      toast({
        title: "Cevap Gönderildi",
        description: "Cevabınız başarıyla yayınlandı.",
        className: "bg-green-600 border-none text-white"
      });
      
      setFormData({ name: '', content: '' });
      if (onReplyAdded) onReplyAdded();
      
    } catch (err) {
      console.error('Error submitting reply:', err);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Cevap gönderilemedi. Lütfen tekrar deneyin."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-sm font-semibold text-slate-700">Cevap Yaz</h5>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-6 w-6 p-0 hover:bg-slate-200 rounded-full">
          <X className="w-4 h-4 text-slate-500" />
        </Button>
      </div>

      <div className="space-y-3">
        <Input 
          placeholder="Adınız" 
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          disabled={submitting}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
        />
        
        <Textarea 
          placeholder="Cevabınız..." 
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          disabled={submitting}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 min-h-[80px] resize-none"
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            disabled={submitting}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={submitting} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Gönder
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;