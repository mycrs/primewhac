import React from 'react';
import { CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Link as LinkIcon, Search } from 'lucide-react';

const SeoChecklist = () => {
    return (
        <div className="space-y-6 p-2">
            <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                    Blog yazılarınızın arama motorlarında daha iyi sıralanması için aşağıdaki adımları takip edin.
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h3 className="flex items-center text-lg font-semibold text-yellow-400 mb-3">
                        <FileText className="w-5 h-5 mr-2" /> İçerik Kalitesi & Yapısı
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Başlık:</strong> İlgi çekici, benzersiz ve anahtar kelime içeren bir başlık kullanın. (50-60 karakter ideal)</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Özet (Excerpt):</strong> Yazının içeriğini net bir şekilde özetleyen bir meta açıklama yazın. (150-160 karakter ideal)</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Kategori & Etiketler:</strong> Yazıyı doğru kategoriye atayın ve ilgili etiketleri ekleyin.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>URL (Slug):</strong> Kısa, anlaşılır ve anahtar kelime içeren URL yapısı kullanın (örn: <code>iptv-kurulum-rehberi</code>).</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h3 className="flex items-center text-lg font-semibold text-blue-400 mb-3">
                        <ImageIcon className="w-5 h-5 mr-2" /> Medya & Görseller
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Alt Metinler:</strong> Tüm görsellere içeriği tanımlayan "alt text" ekleyin.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Kapak Resmi:</strong> Yüksek kaliteli ve ilgi çekici bir kapak görseli kullanın.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h3 className="flex items-center text-lg font-semibold text-purple-400 mb-3">
                        <Search className="w-5 h-5 mr-2" /> Teknik SEO
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Yazar Bilgisi:</strong> E-E-A-T (Deneyim, Uzmanlık, Yetkinlik, Güvenilirlik) kriterleri için yazar biyografisi ve linklerini ekleyin.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Tarih:</strong> İçerik güncellendiğinde "Son Güncelleme" tarihinin yansıdığından emin olun.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>JSON-LD:</strong> Google Yapısal Veri Test Aracı ile makalenin Schema yapısını doğrulayın.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                    <h3 className="flex items-center text-lg font-semibold text-red-400 mb-3">
                        <AlertCircle className="w-5 h-5 mr-2" /> Önemli Hatırlatmalar
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>Google Search Console üzerinden dizinleme durumunu düzenli olarak kontrol edin.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>Yazılarınızı sosyal medyada paylaşarak sinyal gücünü artırın.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SeoChecklist;