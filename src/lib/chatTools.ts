import type { FunctionDeclaration } from '@google/genai';
import { Type } from '@google/genai';

export const getPriceDeclaration: FunctionDeclaration = {
  name: 'get_price',
  description: 'Get the current live price and 24h change percent for a specific crypto symbol',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      symbol: {
        type: 'string',
        description: 'Trading pair symbol, e.g. BTCUSDT, ETHUSDT',
      },
    },
    required: ['symbol'],
  },
};

export const getTopMoversDeclaration: FunctionDeclaration = {
  name: 'get_top_movers',
  description: 'Get the top gaining or losing coins by 24h percent change, from the current top 100 by volume',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      direction: {
        type: 'string',
        enum: ['gainers', 'losers'],
        description: 'Whether to return top gainers or top losers',
      },
      limit: {
        type: 'number',
        description: 'How many results to return, default 3',
      },
    },
    required: ['direction'],
  },
};

export const chatTools = [getPriceDeclaration, getTopMoversDeclaration];


/*
 FunctionDeclaration → αυτό είναι μόνο περιγραφή/σχήμα, όχι πραγματικός κώδικας.
 Λέει στο Gemini "υπάρχει function με αυτό το όνομα, κάνει αυτό, δέχεται αυτές τις 
 παραμέτρους" — το μοντέλο διαβάζει το description για να αποφασίσει πότε να το χρησιμοποιήσει.

 parametersJsonSchema → τυπικό JSON Schema (ίδιο format που ίσως έχεις δει σε form validation/OpenAPI)
  — καθορίζει ρητά τι σχήμα δεδομένων περιμένει η function

 enum: ['gainers', 'losers'] → περιορίζει το μοντέλο να διαλέξει 
  μόνο μία από τις 2 τιμές, όχι ελεύθερο string — μειώνει λάθη


  Το περιγραφικό description σε κάθε πεδίο δεν είναι διακόσμηση — είναι το μόνο context
   που έχει το μοντέλο για να καταλάβει τι κάνει η function. Κακή περιγραφή = λάθος επιλογές από το μοντέλο.
*/