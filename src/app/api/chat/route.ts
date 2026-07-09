import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { message } = await request.json();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: message,
  });

  return NextResponse.json({ reply: response.text });
}