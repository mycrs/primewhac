
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit2, Trash2, Search, Loader2, GripVertical } from 'lucide-react';

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faq_entries').select('*').order('order_index', { ascending: true });
    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
    else setFaqs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Emin misiniz?')) return;
    const { error } = await supabase.from('faq_entries').delete().eq('id', id);
    if (error) toast({ variant: "destructive", title: "Hata", description: error.message });
    else {
      toast({ title: "Başarılı", description: "SSS silindi." });
      fetchFaqs();
    }
  };

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">SSS Yönetimi</h2>
        <Button onClick={() => toast({ description: "🚧 Modal ekleme yakında!" })}>
          <Plus className="w-4 h-4 mr-2" /> Yeni Soru
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input 
          placeholder="Soru ara..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10 bg-[#131326] border-white/10 text-white" 
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map(faq => (
            <div key={faq.id} className="bg-[#131326] border border-white/10 p-4 rounded-xl flex items-start gap-4">
              <div className="mt-1 cursor-grab text-gray-500 hover:text-white">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{faq.question}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => toast({ description: "🚧 Düzenleme yakında eklenecek!" })}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleDelete(faq.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredFaqs.length === 0 && <p className="text-gray-500 text-center py-8">Soru bulunamadı.</p>}
        </div>
      )}
    </div>
  );
};

export default FAQManager;
