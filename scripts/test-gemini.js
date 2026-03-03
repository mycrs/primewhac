#!/usr/bin/env node
/** Gemini API bağlantı testi */
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY .env dosyasında tanımlı değil');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Merhaba, kısaca kendini tanıt.',
    });
    console.log('Yanıt:', response?.text || 'Boş');
    console.log('OK - Gemini API çalışıyor');
  } catch (err) {
    console.error('Hata:', err.message);
    if (err.response) console.error('Response:', err.response);
    process.exit(1);
  }
}

test();
