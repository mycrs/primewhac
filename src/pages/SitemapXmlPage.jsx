
import React, { useEffect, useState } from 'react';
import { generateSitemapXml } from '@/utils/sitemapGenerator';

const SitemapXmlPage = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGenerateXML = async () => {
      try {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://primewatch.tv';
        const xml = await generateSitemapXml(baseUrl);
        setXmlContent(xml);
      } catch (err) {
        console.error('Failed to generate sitemap', err);
        setXmlContent('<?xml version="1.0" encoding="UTF-8"?>\n<error>Failed to load sitemap</error>');
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateXML();
  }, []);

  useEffect(() => {
    if (!loading && xmlContent) {
      document.open();
      document.write(`<xmp>${xmlContent}</xmp>`);
      document.close();
    }
  }, [loading, xmlContent]);

  return null;
};

export default SitemapXmlPage;
