#!/usr/bin/env node
/** Maç içeriği şablon üretim testi (Gemini yok) */
import { generateMatchContent } from '../src/utils/matchContentGenerator.js';

const match = {
  home: 'Galatasaray',
  away: 'Fenerbahçe',
  league: { name: 'Süper Lig' },
  date: '2025-03-15',
  time: '20:00',
};

const result = generateMatchContent(match);
console.log('Paragraf sayısı:', result.paragraphs?.length);
console.log('Kelime sayısı:', result.wordCount);
console.log('İlk paragraf:', result.paragraphs?.[0]?.substring(0, 150) + '...');
console.log('OK');
