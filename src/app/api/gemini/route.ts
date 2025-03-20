import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = ''; // Store this in your .env file
const genAI = new GoogleGenerativeAI(API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error('Gemini API Error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch response from Gemini API' }, { status: 500 });
    }
}