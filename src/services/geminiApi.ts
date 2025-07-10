const GEMINI_API_KEY = "AIzaSyAHrjjFPtzRJPShqaXuwub446VgREPOds8";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent";

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const sendMessageToGemini = async (message: string, conversationHistory: ChatMessage[] = []): Promise<string> => {
  try {
    // System prompt for global citizenship focus
    const systemPrompt = "You are KWS GPT, an AI assistant focused on global citizenship. Your responses should emphasize digital responsibility, cultural unity, climate change awareness, and sustainable practices. Help users understand how they can be responsible global citizens in our interconnected world. Promote environmental consciousness, cultural understanding, ethical technology use, and collaborative solutions to global challenges.";
    
    // Build conversation contents with history
    const contents = [];
    
    // Add system message
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: "model", 
      parts: [{ text: "I understand. I'm KWS GPT, and I'll focus on global citizenship topics including digital responsibility, cultural unity, and climate change. How can I help you become a more responsible global citizen today?" }]
    });
    
    // Add conversation history
    conversationHistory.forEach((msg) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
    
    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response generated from Gemini');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};