import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { chatTools } from '@/lib/chatTools';
import { executeGetPrice, executeGetTopMovers } from '@/lib/chatToolExecutors';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { message } = await request.json();

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      tools: [{ functionDeclarations: chatTools }],
    },
  });

  let response = await chat.sendMessage({ message });
  const functionCalls = response.functionCalls;

  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    let result;

    switch (call.name) {
      case 'get_price':
        result = await executeGetPrice(call.args as { symbol: string });
        break;
      case 'get_top_movers':
        result = await executeGetTopMovers(
          call.args as { direction: 'gainers' | 'losers'; limit?: number }
        );
        break;
      default:
        result = { error: 'Unknown function requested' };
    }

    response = await chat.sendMessage({
      message: {
        functionResponse: {
          name: call.name,
          response: { output: result },
        },
      },
    });
  }

  return NextResponse.json({ reply: response.text });
}


/*
 ai.chats.create({...}) → αντί για το μεμονωμένο generateContent του Βήματος 2, 
 εδώ φτιάχνουμε chat session — κρατάει ιστορικό συνομιλίας αυτόματα, 
 χρειάζεται ακριβώς επειδή το function calling είναι πάντα πολλαπλά turns (ρώτα → κάλεσε function → στείλε αποτέλεσμα πίσω → πάρε τελική απάντηση).

 response.functionCalls → μετά το πρώτο sendMessage, το μοντέλο είτε απαντάει κατευθείαν
  (αν δεν χρειάζεται tool) είτε επιστρέφει "θέλω να καλέσεις αυτή τη function με αυτά τα args" — αυτό είναι ακριβώς αυτό που ελέγχει το if.

  switch (call.name) → εδώ κάνουμε το routing: ποια από τις δικές μας 2 functions 
  (executeGetPrice/executeGetTopMovers) ταιριάζει με το όνομα που ζήτησε το μοντέλο.

  Το δεύτερο chat.sendMessage({ message: { functionResponse: {...} } }) → στέλνουμε το 
  αποτέλεσμα πίσω στο ίδιο chat session. Το μοντέλο τώρα βλέπει: ερώτηση χρήστη + δικό του
   function call request + το πραγματικό αποτέλεσμα — και διατυπώνει την τελική απάντηση σε φυσική γλώσσα βασισμένη σε πραγματικά δεδομένα.
*/