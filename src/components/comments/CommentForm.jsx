
import React, { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2, User, Mail, MessageSquare } from 'lucide-react';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';

const CommentForm = React.memo(({ postId, onCommentAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) return "İsim alanı zorunludur.";
    if (!formData.email.trim()) return "E-posta alanı zorunludur.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Geçerli bir e-posta adresi giriniz.";
    if (!formData.content.trim()) return "Yorum içeriği boş olamaz.";
    return null;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const errorMsg = validateForm();
    if (errorMsg) {
      toast({ variant: "destructive", title: "Eksik Bilgi", description: errorMsg });
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await executeSupabaseQuery(
        () => supabase.from('blog_comments').insert([{
            blog_post_id: postId,
            author_name: formData.name,
            author_email: formData.email,
            content: formData.content,
            is_approved: true 
        }]).select(),
        { retries: 3, context: 'submit_comment' }
      );

      if (error) throw error;

      toast({
        title: "Yorum Paylaşıldı",
        description: "Yorumunuz başarıyla yayınlandı.",
        className: "bg-green-600 border-none text-white shadow-lg"
      });
      
      setFormData({ name: '', email: '', content: '' });
      if (onCommentAdded) onCommentAdded();

    } catch (err) {
      console.error('Error submitting comment:', err);
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a]/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#e50914] to-[#b20710] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center gap-2 mb-6 text-white">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h4 className="text-lg font-semibold">Düşüncelerinizi Paylaşın</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Adınız Soyadınız" 
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={submitting}
            className="pl-10 bg-[#0a0a0a]/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input 
            type="email" 
            placeholder="E-posta Adresiniz (Yayınlanmaz)" 
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={submitting}
            className="pl-10 bg-[#0a0a0a]/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <Textarea 
        placeholder="Yorumunuzu buraya yazın..." 
        value={formData.content}
        onChange={(e) => handleChange('content', e.target.value)}
        disabled={submitting}
        className="bg-[#0a0a0a]/80 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px] mb-6 focus:border-primary focus:ring-primary/20 transition-all resize-none"
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={submitting} 
          className="bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white shadow-lg shadow-primary/20 transition-all duration-300 min-w-[140px]"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
        </Button>
      </div>
    </form>
  );
});

CommentForm.displayName = 'CommentForm';
export default CommentForm;
