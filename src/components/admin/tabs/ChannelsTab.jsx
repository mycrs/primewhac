import React from 'react';
import { GenericListEditor } from '@/components/admin/GenericListEditor';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Tv, AlertTriangle } from 'lucide-react';
import { Input, Textarea } from '@/components/admin/AdminFormControls';
import { defaultData } from '@/data/defaultSiteData';
import AdminTabWrapper from '@/components/admin/AdminTabWrapper';

export const ChannelsTab = ({ siteData, setSiteData }) => {
    const { toast } = useToast();
    const [texts, setTexts] = React.useState(siteData.siteTexts?.channelSlider || {});
    const { setSiteTexts, setChannelsData } = setSiteData;

    const handleSaveTexts = () => {
        const newSiteTexts = { ...siteData.siteTexts, channelSlider: texts };
        setSiteTexts(newSiteTexts);
        toast({ title: "Kanal bölümü metinleri güncellendi!" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTexts(prev => ({ ...prev, [name]: value }));
    };

    const handleResetChannels = () => {
        if(confirm("Tüm kanal listesi varsayılan ile değiştirilecek. Emin misiniz?")) {
            setChannelsData(defaultData.channelsData);
            toast({ title: "Kanallar Sıfırlandı!", description: "Kanal listesi varsayılan listeyle güncellendi." });
        }
    };

    return (
        <AdminTabWrapper title="Kanal Listesi" description="Ana sayfadaki kanal slider'ı için içerik yönetimi." icon={Tv}>
            <div className="admin-card">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold text-white">Bölüm Metinleri</h3>
                    <Button onClick={handleSaveTexts} className="admin-button-success"><Save className="mr-2 h-4 w-4" /> Metinleri Kaydet</Button>
                </div>
                
                <div className="space-y-4">
                    <Input label="Ana Başlık" name="title" value={texts?.title || ''} onChange={handleChange} />
                    <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400 -mt-2 mb-2 border border-slate-800">
                        İpucu: Renkli metin için {`{gradient}`}Metin{`{gradient}`} formatını kullanın.
                    </div>
                    <Textarea label="Açıklama" name="subtitle" value={texts?.subtitle || ''} onChange={handleChange} rows={2} />
                </div>
            </div>

            <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-xl p-4 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="font-bold text-yellow-500 text-sm mb-1">Varsayılan Veri</h4>
                    <p className="text-yellow-200/70 text-xs mb-3">
                        Eğer kanal listesinde sorun yaşıyorsanız veya varsayılan listeye dönmek istiyorsanız bu işlemi kullanabilirsiniz.
                    </p>
                    <Button onClick={handleResetChannels} size="sm" variant="outline" className="border-yellow-700 text-yellow-500 hover:bg-yellow-900/30 hover:text-yellow-400">
                        <RefreshCw className="mr-2 h-3 w-3" /> Listeyi Sıfırla
                    </Button>
                </div>
            </div>

            <GenericListEditor 
                title="Kanal" 
                singularName="Kanal" 
                data={Array.isArray(siteData.channelsData) ? siteData.channelsData : []} 
                setData={setChannelsData} 
                fields={[
                    {name: 'name', label: 'Kanal Adı'}, 
                    {name: 'logoUrl', label: 'Logo URL'},
                    {name: 'category', label: 'Kategori'}, 
                    {name: 'country', label: 'Ülke Kodu (TR, DE...)'}
                ]} 
            />
        </AdminTabWrapper>
    );
};

export default ChannelsTab;