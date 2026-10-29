
import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminBlogForm from './AdminBlogForm';
import {
  clearActiveBlogDraft,
  clearBlogDraft,
  readActiveBlogDraft,
  writeActiveBlogDraft,
} from '@/utils/blogDraftStorage';

const BlogManager = ({ siteData }) => {
  const { fetchBlogPosts, deletePost, loading } = useAdminData();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeDraft, setActiveDraft] = useState(null);

  const loadPosts = async () => {
    const data = await fetchBlogPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Form sayfa değişiminde unmount olsa bile yeni/düzenlenen yazıyı tekrar aç.
  useEffect(() => {
    if (activeDraft) return;
    const savedDraft = readActiveBlogDraft(user?.id);
    if (!savedDraft) return;

    if (savedDraft.mode === 'new') {
      setActiveDraft(savedDraft);
      setIsCreating(true);
      return;
    }

    if (savedDraft.mode === 'edit' && posts.length > 0) {
      const matchingPost = posts.find((item) => item.id === savedDraft.postId);
      if (matchingPost) {
        setActiveDraft(savedDraft);
        setEditingPost(matchingPost);
      } else {
        clearActiveBlogDraft(user?.id);
      }
    }
  }, [activeDraft, posts, user?.id]);

  const handleDelete = async (id) => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      const success = await deletePost(id);
      if (success) loadPosts();
    }
  };

  const startCreating = () => {
    const draft = { mode: 'new', postId: null };
    writeActiveBlogDraft(user?.id, draft);
    setActiveDraft(draft);
    setIsCreating(true);
  };

  const startEditing = (post) => {
    const draft = { mode: 'edit', postId: post.id };
    writeActiveBlogDraft(user?.id, draft);
    setActiveDraft(draft);
    setEditingPost(post);
  };

  const closeEditor = () => {
    clearBlogDraft(user?.id, activeDraft?.postId);
    clearActiveBlogDraft(user?.id);
    setActiveDraft(null);
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleFormSuccess = () => {
    clearBlogDraft(user?.id, activeDraft?.postId);
    clearActiveBlogDraft(user?.id);
    setActiveDraft(null);
    setEditingPost(null);
    setIsCreating(false);
    loadPosts();
  };

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (editingPost || isCreating) {
    return (
      <AdminBlogForm 
        post={editingPost} 
        siteData={siteData}
        onSuccess={handleFormSuccess}
        onCancel={closeEditor}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Blog Yönetimi</h2>
        <Button onClick={startCreating} className="bg-primary hover:bg-primary text-white">
          <Plus className="w-4 h-4 mr-2" /> Yeni Yazı
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded-lg border border-slate-800">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <Input 
          placeholder="Yazılarda ara..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent text-white focus-visible:ring-0"
        />
      </div>

      <div className="bg-[#0a0a0a] rounded-lg border border-slate-800 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-300">Başlık</TableHead>
              <TableHead className="text-slate-300">Durum</TableHead>
              <TableHead className="text-slate-300">Kategori</TableHead>
              <TableHead className="text-slate-300">Tarih</TableHead>
              <TableHead className="text-right text-slate-300">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-400">Yükleniyor...</TableCell></TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-400">Yazı bulunamadı.</TableCell></TableRow>
            ) : (
              filteredPosts.map(post => (
                <TableRow key={post.id} className="border-slate-800 text-slate-300">
                  <TableCell className="font-medium text-white">{post.title}</TableCell>
                  <TableCell>
                    {post.published_at ? <Badge className="bg-green-600 text-white">Yayında</Badge> : <Badge variant="secondary" className="bg-amber-600 text-white">Taslak</Badge>}
                  </TableCell>
                  <TableCell>{post.category || '-'}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => startEditing(post)} className="text-blue-400 hover:text-blue-300 hover:bg-[#141414]/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BlogManager;
