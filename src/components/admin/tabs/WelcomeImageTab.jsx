import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, GripVertical, Upload, Loader2, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';

const WelcomeImageTab = ({ siteData, setSiteData }) => {
  const { toast } = useToast();
  // IMPORTANT: The setter is named setWelcome_images because the data key is 'welcome_images'
  const { setWelcome_images } = setSiteData;
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sync state on load
  useEffect(() => {
    if (siteData.welcome_images && Array.isArray(siteData.welcome_images)) {
        setImages(siteData.welcome_images);
    } else if (siteData.welcomeImages && Array.isArray(siteData.welcomeImages)) {
        // Migration from old format if needed
        setImages(siteData.welcomeImages.map((img, idx) => ({ ...img, id: idx.toString(), order: idx + 1 })));
    }
  }, [siteData]);

  const handleAddImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: '',
      title: '',
      description: '',
      order: images.length + 1
    };
    setImages([...images, newImage]);
  };

  const handleRemoveImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleChange = (id, field, value) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const handleFileUpload = async (event, imageId) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('welcome-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('welcome-images')
        .getPublicUrl(filePath);

      handleChange(imageId, 'url', publicUrl);
      
      toast({
        title: "Görsel Yüklendi",
        description: "Görsel başarıyla depolandı.",
        className: "bg-green-600 text-white"
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Yükleme Hatası",
        description: error.message || "Görsel yüklenirken bir hata oluştu.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Sort by order before saving
      const sortedImages = [...images].sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
      
      // Save to Supabase using the wrapper hook
      await setWelcome_images(sortedImages);
      
      toast({
        title: "Başarılı",
        description: "Splash ekranı görselleri veritabanına kaydedildi.",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminTabWrapper
        title="Banner Görsel Yönetimi"
        description="Ana sayfa slayt alanındaki görselleri yükleyin ve düzenleyin."
        icon={ImageIcon}
        actions={
            <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
        }
    >
      <div className="space-y-6">
        {images.length === 0 && (
            <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-dashed border-slate-600">
                <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Henüz Görsel Yok</h3>
                <p className="text-slate-400 mb-4">Ana sayfada gösterilecek bir görsel ekleyerek başlayın.</p>
                <Button onClick={handleAddImage} variant="secondary">
                    <Plus className="w-4 h-4 mr-2" /> İlk Görseli Ekle
                </Button>
            </div>
        )}

        {images.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0)).map((image, index) => (
          <Card key={image.id} className="bg-slate-800 border-slate-700 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-6 bg-slate-900/50 border-b border-slate-700">
              <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-slate-700 rounded cursor-grab active:cursor-grabbing text-slate-400 hover:text-white transition-colors">
                    <GripVertical className="w-4 h-4" />
                 </div>
                 <span className="font-bold text-white bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                 </span>
                 <span className="text-sm font-medium text-slate-300">Slayt</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={() => handleRemoveImage(image.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Sil
              </Button>
            </CardHeader>
            <CardContent className="p-6 grid gap-6 md:grid-cols-2">
              {/* Left Column: Inputs */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-gray-300">Görsel Kaynağı</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={image.url}
                      onChange={(e) => handleChange(image.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="bg-slate-900 border-slate-700 text-white flex-1 font-mono text-sm"
                    />
                    <div className="relative">
                       <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, image.id)}
                          disabled={uploading}
                       />
                       <Button variant="secondary" className="px-3 min-w-[3rem]" disabled={uploading}>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                       </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-300/80">
                      <Info className="w-3 h-3" />
                      Dosya yükleyebilir veya harici bir URL (örn. Unsplash) kullanabilirsiniz.
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-gray-300">Sıralama</Label>
                        <Input 
                            type="number"
                            value={image.order}
                            onChange={(e) => handleChange(image.id, 'order', parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border-slate-700 text-white"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-gray-300">Başlık (Opsiyonel)</Label>
                  <Input 
                    value={image.title}
                    onChange={(e) => handleChange(image.id, 'title', e.target.value)}
                    placeholder="Varsayılan metin kullanılır"
                    className="bg-slate-900 border-slate-700 text-white font-medium"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-gray-300">Açıklama (Opsiyonel)</Label>
                  <Textarea 
                    value={image.description}
                    onChange={(e) => handleChange(image.id, 'description', e.target.value)}
                    placeholder="Varsayılan açıklama kullanılır"
                    className="bg-slate-900 border-slate-700 text-white min-h-[80px]"
                  />
                </div>
              </div>

              {/* Right Column: Preview */}
              <div className="space-y-2">
                <Label className="text-gray-300">Önizleme</Label>
                <div className="relative aspect-video w-full rounded-lg border-2 border-slate-700 border-dashed bg-slate-900/50 overflow-hidden flex items-center justify-center group shadow-inner">
                  {image.url ? (
                    <>
                        <img 
                        src={image.url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('flex');
                        }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 flex items-center gap-2 font-medium">
                                <ExternalLink className="w-5 h-5" /> Tam Boyut Gör
                            </a>
                        </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                      <span className="text-sm">Görsel bekleniyor...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {images.length > 0 && (
            <Button 
                variant="outline" 
                onClick={handleAddImage}
                className="w-full border-dashed border-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white py-8 transition-all"
            >
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span className="text-base font-medium">Yeni Slayt Ekle</span>
                </div>
            </Button>
        )}
      </div>
    </AdminTabWrapper>
  );
};

export default WelcomeImageTab;