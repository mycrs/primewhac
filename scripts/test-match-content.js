#!/usr/bin/env node
/** Maç içeriği AI üretim testi */
import 'dotenv/config';
import { generateMatchContentWithAI } from '../server/api/generateMatchContent.js';

const match = {
  home: 'Galatasaray',
  away: 'Fenerbahçe',
  league: { name: 'Süper Lig' },
  date: '2025-03-15',
  time: '20:00',
};

async function test() {
  try {
    console.log('Gemini ile içerik üretiliyor...');
    const result = await generateMatchContentWithAI(match);
    console.log('Paragraf sayısı:', result.paragraphs?.length);
    console.log('Kelime sayısı:', result.wordCount);
    console.log('İlk paragraf:', result.paragraphs?.[0]?.substring(0, 150) + '...');
    console.log('OK');
  } catch (err) {
    console.error('Hata:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

test();
