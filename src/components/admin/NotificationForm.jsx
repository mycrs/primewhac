
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, X, AlertCircle } from 'lucide-react';
import NotificationPreview from './NotificationPreview';
import { useNotificationInsert } from '@/hooks/useNotificationInsert';

const NotificationForm = ({ initialData, onSave, onCancel, serverError }) => {
  const { insertNotification, loading: insertLoading } = useNotificationInsert();
  const loading = insertLoading;
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    link: '',
    type: 'Duyuru',
    color: 'mavi',
    active: true,
    start_date: '',
    end_date: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        link: initialData.link || '',
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : '',
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Başlık zorunludur.';
    if (!formData.message.trim()) newErrors.message = 'Mesaj zorunludur.';
    
    if (formData.start_date && formData.end_date) {
        if (new Date(formData.start_date) >= new Date(formData.end_date)) {
            newErrors.end_date = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.';
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const dataToSave = {
        ...formData,
        link: formData.link ? formData.link.trim() : null,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (!initialData?.id) {
        const result = await insertNotification(dataToSave);
        if (result.success && onSave) {
          onSave(result.data);
        } else {
          setErrors({ form: result.error });
        }
      } else {
        if (onSave) {
           await onSave(dataToSave);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">
          {initialData ? 'Bildirimi Düzenle' : 'Yeni Bildirim Ekle'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white" disabled={loading}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {(serverError || errors.form) && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{errors.form || serverError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Başlık <span className="text-red-400">*</span></Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Bildirim başlığı"
                disabled={loading}
                className={`bg-slate-950/50 text-white border-slate-700 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Mesaj <span className="text-red-400">*</span></Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Bildirim içeriği..."
                disabled={loading}
                className={`min-h-[100px] bg-slate-950/50 text-white border-slate-700 ${errors.message ? 'border-red-500' : ''}`}
              />
              {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Yönlendirme Bağlantısı</Label>
              <Input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
                disabled={loading}
                className="bg-slate-950/50 text-white border-slate-700"
              />
              <p className="text-xs text-slate-500">Kullanıcılar bildirime tıkladığında bu adrese yönlendirilir. (İsteğe bağlı)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Tür</Label>
                <Select disabled={loading} value={formData.type} onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}>
                  <SelectTrigger className="bg-slate-950/50 text-white border-slate-700">
                    <SelectValue placeholder="Tür Seç" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="Duyuru">Duyuru</SelectItem>
                    <SelectItem value="Uyarı">Uyarı</SelectItem>
                    <SelectItem value="Promosyon">Promosyon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Renk</Label>
                <Select disabled={loading} value={formData.color} onValueChange={(val) => setFormData(prev => ({ ...prev, color: val }))}>
                  <SelectTrigger className="bg-slate-950/50 text-white border-slate-700">
                    <SelectValue placeholder="Renk Seç" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="mavi">Mavi (Bilgi)</SelectItem>
                    <SelectItem value="yeşil">Yeşil (Başarı)</SelectItem>
                    <SelectItem value="sarı">Sarı (Dikkat)</SelectItem>
                    <SelectItem value="kırmızı">Kırmızı (Hata)</SelectItem>
                    <SelectItem value="mor">Mor (Özel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Başlangıç Zamanı</Label>
                <Input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-slate-950/50 text-white border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Bitiş Zamanı</Label>
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={loading}
                  className={`bg-slate-950/50 text-white border-slate-700 ${errors.end_date ? 'border-red-500' : ''}`}
                />
                 {errors.end_date && <p className="text-red-400 text-xs">{errors.end_date}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700">
              <Label className="text-white font-medium cursor-pointer">Aktif Durumu</Label>
              <Switch
                disabled={loading}
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading} className="text-slate-300">İptal</Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>

        <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-start">
          <NotificationPreview data={formData} />
          
          <div className="mt-8 text-sm text-slate-400 bg-slate-950/50 p-4 rounded-lg border border-slate-800">
            <h4 className="font-semibold text-slate-300 mb-2">Bilgilendirme</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Bildirimler, aktif durumda olduklarında ve tarih aralığı uygunsa sitenin en üstünde gösterilir.</li>
              <li>Tarih belirtilmezse bildirim her zaman aktif sayılır (Aktif anahtarı açıksa).</li>
              <li>Kullanıcı bildirimi kapatırsa (X butonuna basarsa) o bildirim tekrar gösterilmez.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;
