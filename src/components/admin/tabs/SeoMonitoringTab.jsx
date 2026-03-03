import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MousePointerClick, Search, AlertCircle, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SeoMonitoringTab = () => {
  // Dummy data simulating GSC stats
  const keywords = [
    { term: "kaliteli iptv", position: 3.2, impressions: 4500, clicks: 131, ctr: "2.9%" },
    { term: "iptv paketleri", position: 5.1, impressions: 3200, clicks: 98, ctr: "3.1%" },
    { term: "iptv kurulum", position: 2.8, impressions: 2100, clicks: 85, ctr: "4.0%" },
    { term: "donmayan iptv", position: 8.4, impressions: 1800, clicks: 42, ctr: "2.3%" },
    { term: "4k iptv", position: 12.1, impressions: 1500, clicks: 25, ctr: "1.6%" },
  ];

  const pageAnalysis = [
    { page: "Anasayfa (/)", score: 92, status: "İyi", keywords: 12, density: "1.8%" },
    { page: "Paketler (/paketler)", score: 88, status: "İyi", keywords: 8, density: "1.5%" },
    { page: "Kurulum (/installation)", score: 85, status: "İyi", keywords: 15, density: "2.1%" },
    { page: "SSS (/faq)", score: 76, status: "Geliştirilmeli", keywords: 5, density: "0.8%" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Toplam Tıklama</CardTitle>
            <MousePointerClick className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,245</div>
            <p className="text-xs text-slate-500">+12% geçen haftaya göre</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Görüntülenme</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">45.2K</div>
            <p className="text-xs text-slate-500">+5% geçen haftaya göre</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Ort. Pozisyon</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.4</div>
            <p className="text-xs text-slate-500">0.4 artış</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">SEO Puanı</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">85/100</div>
            <p className="text-xs text-slate-500">Genel Site Sağlığı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Anahtar Kelime Performansı</CardTitle>
            <CardDescription>Google arama sonuçlarındaki performansınız.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Anahtar Kelime</TableHead>
                        <TableHead className="text-slate-400">Sıra</TableHead>
                        <TableHead className="text-slate-400">Tıklama</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {keywords.map((k, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="font-medium text-slate-200">{k.term}</TableCell>
                            <TableCell className="text-slate-300">{k.position}</TableCell>
                            <TableCell className="text-slate-300">{k.clicks}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
             <Button variant="outline" className="w-full mt-4 border-slate-700 hover:bg-slate-800 text-slate-300">
                <Download className="w-4 h-4 mr-2" /> Raporu İndir
             </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Sayfa Analizi</CardTitle>
            <CardDescription>Sayfa bazlı SEO uyumluluk durumu.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {pageAnalysis.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-slate-800 rounded-lg">
                        <div>
                            <div className="font-semibold text-slate-200">{p.page}</div>
                            <div className="text-xs text-slate-500">Yoğunluk: {p.density}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-200">{p.score}</div>
                                <div className="text-[10px] text-slate-500">Puan</div>
                            </div>
                            <Badge variant={p.status === 'İyi' ? 'default' : 'destructive'} className={p.status === 'İyi' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}>
                                {p.status}
                            </Badge>
                        </div>
                    </div>
                ))}
             </div>
             <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="text-xs text-blue-300">
                    <strong>Öneri:</strong> SSS sayfasındaki anahtar kelime yoğunluğu düşük. "iptv nedir" ve "iptv kurulum" kelimelerini daha sık kullanın.
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeoMonitoringTab;