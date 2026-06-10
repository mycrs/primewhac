
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, UploadCloud, Save, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useBlogPostForm } from '@/hooks/useBlogPostForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BlogWritePage = ({ siteData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contactData, siteTexts } = siteData || {};
  const [imageFile, setImageFile] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const {
    formData,
    handleInputChange,
    handleTagsChange,
    handleSwitchChange,
    handleImageUpload,
    handleSubmit,
    fetchPost,
    isLoading,
    isUploading,
    error,
    validationErrors
  } = useBlogPostForm();

  useEffect(() => {
    console.log(`[BlogWritePage] Component mounted. Mode: ${id ? 'Edit (ID: ' + id + ')' : 'Create'}`);
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    console.log(`[BlogWritePage] File input changed. Selected file:`, file?.name);
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(`[BlogWritePage] Form submit button clicked.`);
    await handleSubmit(e, id);
  };

  const handleBack = () => {
    console.log(`[BlogWritePage] Navigating back to /blog`);
    setIsNavigating(true);
    navigate('/blog');
  };

  return (
    <>
      <Helmet>
        <title>{id ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'} | Yönetim</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white">
        <Header contactData={contactData} siteTexts={siteTexts} />
        
        <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                disabled={isNavigating || isLoading}
                className="text-slate-400 hover:text-white hover:bg-[#0a0a0a]"
              >
                {isNavigating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ArrowLeft className="w-5 h-5 mr-2" />} 
                Geri Dön
              </Button>
              <h1 className="text-3xl font-bold text-white">
                {id ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
              </h1>
            </div>
            <Button 
              onClick={onSubmit} 
              disabled={isLoading || isUploading}
              className="bg-primary hover:bg-primary text-white min-w-[120px]"
            >
              {(isLoading || isUploading) ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />} 
              {id ? 'Güncelle' : 'Yayınla'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
              <p className="font-semibold mb-1">Bir hata oluştu:</p>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-xl shadow-lg">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-slate-300 text-sm font-medium mb-1 block">
                        Başlık <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Yazınızın başlığını girin..."
                        className={`bg-[#0a0a0a] text-white text-lg h-12 ${validationErrors.title ? 'border-red-500' : 'border-slate-700'}`}
                        disabled={isLoading}
                      />
                      {validationErrors.title && <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-slate-300 text-sm font-medium mb-1 block">
                        İçerik <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Blog içeriğini buraya yazın (HTML desteklenir)..."
                        className={`bg-[#0a0a0a] text-white min-h-[400px] font-mono text-sm leading-relaxed p-4 ${validationErrors.content ? 'border-red-500' : 'border-slate-700'}`}
                        disabled={isLoading}
                      />
                      {validationErrors.content && <p className="text-red-500 text-xs mt-1">{validationErrors.content}</p>}
                      <div className="text-xs text-slate-500 mt-2 text-right">
                        {formData.content.length} karakter
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                  <div>
                    <Label htmlFor="excerpt" className="text-slate-300 text-sm font-medium mb-1 block">
                      Özet (Excerpt) <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      maxLength={200}
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Yazının kısa özeti..."
                      className={`bg-[#0a0a0a] text-white h-24 shadow-inner ${validationErrors.excerpt ? 'border-red-500' : 'border-slate-700'}`}
                      disabled={isLoading}
                    />
                    {validationErrors.excerpt && <p className="text-red-500 text-xs mt-1">{validationErrors.excerpt}</p>}
                    <div className="text-xs text-slate-500 mt-2 text-right">
                      {formData.excerpt?.length || 0}/200 karakter
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-medium text-slate-300 mb-4">SEO Ayarları</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="seo_title" className="text-slate-400 text-xs font-medium mb-1 block">
                          SEO Başlığı
                        </Label>
                        <Input
                          id="seo_title"
                          name="seo_title"
                          value={formData.seo_title || ''}
                          onChange={handleInputChange}
                          placeholder="Arama motorlarında görünecek başlık..."
                          className="bg-[#0a0a0a] border-slate-700 text-white"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="seo_description" className="text-slate-400 text-xs font-medium mb-1 block">
                          SEO Açıklaması
                        </Label>
                        <Textarea
                          id="seo_description"
                          name="seo_description"
                          value={formData.seo_description || ''}
                          onChange={handleInputChange}
                          placeholder="Arama motorlarında görünecek açıklama..."
                          className="bg-[#0a0a0a] border-slate-700 text-white h-20"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
                  <h3 className="font-semibold text-white border-b border-slate-800 pb-3">Yayın Ayarları</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="draft-mode" className="text-slate-300 cursor-pointer">
                      Taslak Olarak Kaydet
                    </Label>
                    <Switch
                      id="draft-mode"
                      checked={formData.isDraft}
                      onCheckedChange={handleSwitchChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="published_at" className="text-slate-300 text-sm font-medium mb-1 block">
                      Yayın Tarihi
                    </Label>
                    <Input
                      type="date"
                      id="published_at"
                      name="published_at"
                      value={formData.published_at}
                      onChange={handleInputChange}
                      className="bg-[#0a0a0a] border-slate-700 text-white"
                      disabled={formData.isDraft || isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug" className="text-slate-300 text-sm font-medium mb-1 block">
                      URL Bağlantısı (Slug)
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="ornek-blog-yazisi"
                      className={`bg-[#0a0a0a] text-white font-mono text-sm ${validationErrors.slug ? 'border-red-500' : 'border-slate-700'}`}
                      disabled={isLoading}
                    />
                    {validationErrors.slug && <p className="text-red-500 text-xs mt-1">{validationErrors.slug}</p>}
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
                  <h3 className="font-semibold text-white border-b border-slate-800 pb-3">Kategorizasyon</h3>
                  
                  <div>
                    <Label htmlFor="category" className="text-slate-300 text-sm font-medium mb-1 block">
                      Kategori
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Örn: Rehberler, Haberler..."
                      className="bg-[#0a0a0a] border-slate-700 text-white"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-slate-300 text-sm font-medium mb-1 block">
                      Etiketler (Virgülle ayırın)
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                      placeholder="iptv, kurulum, rehber..."
                      className="bg-[#0a0a0a] border-slate-700 text-white"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                  <h3 className="font-semibold text-white border-b border-slate-800 pb-3">Kapak Görseli</h3>
                  
                  <div className="space-y-4">
                    {formData.cover_image_url ? (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-700">
                        <img 
                          src={formData.cover_image_url} 
                          alt="Blog kapak görseli önizlemesi"
                          className="w-full h-40 object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              console.log(`[BlogWritePage] Removing cover image URL`);
                              handleInputChange({ target: { name: 'cover_image_url', value: '' } });
                            }}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4 mr-2" /> Kaldır
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-[#0a0a0a] border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-sm">Görsel Seçilmedi</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="image-upload" className="cursor-pointer block w-full">
                        <div className="flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white rounded-md h-10 transition-colors w-full">
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                          {isUploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                        </div>
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={onFileChange}
                          disabled={isUploading || isLoading}
                        />
                      </Label>
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">VEYA URL</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                      </div>
                      <Input
                        name="cover_image_url"
                        value={formData.cover_image_url}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="bg-[#0a0a0a] border-slate-700 text-white text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BlogWritePage;
