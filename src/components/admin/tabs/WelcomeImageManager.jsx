import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Trash2, Image as ImageIcon, Check, Star } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { cn } from '@/lib/utils';

export const WelcomeImageManager = ({ siteData }) => {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const BUCKET_NAME = 'welcome-images';

  useEffect(() => {
    fetchImages();
    fetchActiveImage();
  }, []);

  const fetchActiveImage = async () => {
    try {
      // Using maybeSingle() to prevent PGRST116 error if no active image is set
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'welcome_hero_active_image')
        .maybeSingle();
      
      if (error) {
        console.warn("Error fetching active image:", error.message);
        return;
      }
      
      if (data?.value?.url) {
        setActiveImage(data.value.url);
      }
    } catch (error) {
      console.error("Error fetching active image:", error);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      const imagesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);
        return {
          ...file,
          url: publicUrl
        };
      });

      setImages(imagesWithUrls);
    } catch (error) {
      console.error("Fetch images error:", error);
      toast({ title: "Hata", description: "Resimler yüklenemedi.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({ title: "Başarılı", description: "Resim yüklendi." });
      fetchImages(); // Refresh list

    } catch (error) {
      console.error('Upload failed:', error);
      toast({ 
        title: "Hata", 
        description: "Yükleme hatası: " + error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    if (!confirm("Bu resmi silmek istediğinize emin misiniz?")) return;

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) throw error;

      toast({ title: "Silindi", description: "Resim silindi." });
      
      // If deleted image was active, clear active state
      const deletedUrl = images.find(img => img.name === fileName)?.url;
      if (deletedUrl === activeImage) {
        await supabase
          .from('site_content')
          .delete()
          .eq('key', 'welcome_hero_active_image');
        setActiveImage(null);
      }

      fetchImages();
    } catch (error) {
      toast({ title: "Hata", description: "Silme işlemi başarısız.", variant: "destructive" });
    }
  };

  const handleSetActive = async (url) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
            key: 'welcome_hero_active_image',
            value: { url, updatedAt: new Date().toISOString() }
        });

      if (error) throw error;

      setActiveImage(url);
      toast({ title: "Başarılı", description: "Karşılama resmi güncellendi." });
    } catch (error) {
      toast({ title: "Hata", description: "Güncelleme başarısız.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0a0a] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Karşılama Ekranı Yönetimi
          </CardTitle>
          <CardDescription className="text-gray-400">
             Ana sayfa "Hero" alanında kullanılacak arka plan görsellerini yükleyin ve seçin.
          </CardDescription>
        </CardHeader>
        <CardContent>
           
           <div className="mb-6 flex justify-end">
                <div className="relative">
                    <input 
                        type="file" 
                        id="hero-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    <label htmlFor="hero-upload">
                        <Button 
                            variant="default" 
                            className="cursor-pointer bg-primary hover:bg-primary"
                            asChild
                            disabled={uploading}
                        >
                            <span>
                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                {uploading ? 'Yükleniyor...' : 'Yeni Görsel Yükle'}
                            </span>
                        </Button>
                    </label>
                </div>
           </div>

           {loading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        Hiç görsel bulunamadı.
                    </div>
                ) : (
                    images.map((img) => (
                        <div 
                            key={img.id} 
                            className={cn(
                                "relative group aspect-video rounded-xl overflow-hidden border-2 transition-all",
                                activeImage === img.url ? "border-primary shadow-[0_0_15px_rgba(229,9,20,0.3)]" : "border-slate-800 hover:border-slate-600"
                            )}
                        >
                            <img src={img.url} alt={`${img.name} karşılama görseli`} className="w-full h-full object-cover" />
                            
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                {activeImage !== img.url && (
                                    <Button 
                                        size="sm" 
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => handleSetActive(img.url)}
                                    >
                                        <Star className="w-4 h-4 mr-2" /> Seç
                                    </Button>
                                )}
                                <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    className="w-full"
                                    onClick={() => handleDelete(img.name)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Sil
                                </Button>
                            </div>

                            {activeImage === img.url && (
                                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg">
                                    <Check className="w-3 h-3 mr-1" /> Aktif
                                </div>
                            )}
                        </div>
                    ))
                )}
             </div>
           )}

        </CardContent>
      </Card>
    </div>
  );
};