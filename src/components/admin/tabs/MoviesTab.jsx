import React from 'react';
import { GenericListEditor } from '@/components/admin/GenericListEditor';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Save, Film } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';

export const MoviesTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const [texts, setTexts] = React.useState(siteData.siteTexts?.movieSlider || {});
    const { setSiteTexts, setMoviesData } = setSiteData;

    const handleSaveTexts = () => {
        const newSiteTexts = { ...siteData.siteTexts, movieSlider: texts };
        setSiteTexts(newSiteTexts);
        toast({ title: "Film bölümü metinleri güncellendi!" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTexts(prev => ({ ...prev, [name]: value }));
    };

    return (
        <AdminTabWrapper title="Filmler & Diziler" description="Popüler içerik vitrinini düzenleyin." icon={Film}>
            <div className="admin-card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Bölüm Metinleri</h3>
                    <Button onClick={handleSaveTexts} className="admin-button-success"><Save className="mr-2 h-4 w-4" /> Metinleri Kaydet</Button>
                </div>
                <div className="space-y-4">
                    <Input label="Ana Başlık" name="title" value={texts?.title || ''} onChange={handleChange} />
                    <Textarea label="Açıklama" name="subtitle" value={texts?.subtitle || ''} onChange={handleChange} rows={2} />
                </div>
            </div>
            
            <GenericListEditor 
                title="İçerik" 
                singularName="Film/Dizi" 
                data={Array.isArray(siteData.moviesData) ? siteData.moviesData : []} 
                setData={setMoviesData} 
                fields={[
                    {name: 'title', label: 'Başlık'}, 
                    {name: 'rating', label: 'Puan (Örn: 8.5)'}, 
                    {name: 'genre', label: 'Tür'}, 
                    {name: 'image', label: 'Kapak Görseli URL'}
                ]} 
            />
        </AdminTabWrapper>
    );
};

export default MoviesTab;