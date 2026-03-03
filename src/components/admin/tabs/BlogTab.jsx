import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { useBlogBlockManager } from '@/hooks/useBlogBlockManager';
import AddBlogBlockModal from './AddBlogBlockModal';

const BlogTab = () => {
  const {
    posts,
    loading,
    isModalOpen,
    editingPost,
    isSaving,
    isUploading,
    openModal,
    closeModal,
    savePost,
    deletePost,
    fetchPosts
  } = useBlogBlockManager();

  useEffect(() => {
    console.log('[BlogTab] Rendered. Posts count:', posts.length, 'Loading:', loading, 'ModalOpen:', isModalOpen);
  }, [posts, loading, isModalOpen]);

  const handleRefresh = () => {
    console.log('[BlogTab] Manual refresh triggered.');
    fetchPosts();
  };

  const handleOpenNewModal = () => {
    console.log('[BlogTab] User clicked "Yeni Blog Yazısı Ekle".');
    openModal();
  };

  const handleEditClick = (post) => {
    console.log('[BlogTab] User clicked Edit for post:', post.id);
    openModal(post);
  };

  const handleDeleteClick = (post) => {
    console.log('[BlogTab] User clicked Delete for post:', post.id);
    deletePost(post);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Blog Yönetimi
            <span className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-full font-medium">
              {posts.length} Yazı
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Blog içeriklerini oluşturun, düzenleyin ve yönetin.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={handleRefresh} variant="outline" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Yenile</span>
          </Button>
          <Button onClick={handleOpenNewModal} className="bg-purple-600 hover:bg-purple-500 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Yeni Blog Yazısı Ekle
          </Button>
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-40 animate-pulse flex items-center gap-4">
              <div className="w-24 h-24 bg-slate-800 rounded-lg shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-dashed border-slate-700 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-2">Henüz Blog Yazısı Yok</h3>
          <p className="text-slate-400 mb-6">Sitenizde gösterecek herhangi bir blog yazısı bulunmuyor.</p>
          <Button onClick={handleOpenNewModal} className="bg-purple-600 hover:bg-purple-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> İlk Yazıyı Oluştur
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 flex flex-col">
              <div className="relative h-40 bg-slate-800 overflow-hidden">
                {post.cover_image_url ? (
                  <img 
                    src={post.cover_image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2 bg-slate-800/50">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-none backdrop-blur-sm" onClick={() => handleEditClick(post)} title="Düzenle">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8 bg-red-500/80 hover:bg-red-600 text-white border-none backdrop-blur-sm" onClick={() => handleDeleteClick(post)} title="Sil">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-purple-400 mb-2 font-medium">
                  <span className="bg-purple-500/10 px-2 py-0.5 rounded">{post.category || 'Genel'}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h3 className="font-bold text-white text-base line-clamp-2 mb-1 group-hover:text-purple-300 transition-colors" title={post.title}>
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {post.excerpt || (post.content ? post.content.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...' : '')}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-4 truncate" title={post.slug}>/{post.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBlogBlockModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={savePost}
        initialData={editingPost}
        isSaving={isSaving}
        isUploading={isUploading}
      />
    </div>
  );
};

export default BlogTab;