import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SitemapXMLGenerator = ({ pages }) => {
  const { toast } = useToast();

  const generateXML = () => {
    const baseUrl = window.location.origin;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    pages.forEach(page => {
      // Ensure URL starts with / if not absolute
      const urlPath = page.url.startsWith('http') ? page.url : `${baseUrl}${page.url.startsWith('/') ? '' : '/'}${page.url}`;
      xml += `\n  <url>\n    <loc>${urlPath}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`;
    });

    xml += `\n</urlset>`;
    return xml;
  };

  const handleDownload = () => {
    if (!pages || pages.length === 0) {
      toast({
        title: "Uyarı",
        description: "İndirilecek site haritası verisi bulunamadı.",
        variant: "destructive"
      });
      return;
    }

    try {
      const xml = generateXML();
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Başarılı",
        description: "sitemap.xml dosyası indirildi."
      });
    } catch (error) {
      console.error("Sitemap download error:", error);
      toast({
        title: "Hata",
        description: "Sitemap oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={handleDownload} className="bg-[#141414] hover:bg-[#0a0a0a] text-white">
      <Download className="w-4 h-4 mr-2" />
      Sitemap XML İndir
    </Button>
  );
};

export default SitemapXMLGenerator;