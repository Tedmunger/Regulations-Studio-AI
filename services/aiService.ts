
import { GoogleGenAI } from "@google/genai";

// Security Check: Ensure the environment is actually providing the key
const API_KEY = process.env.API_KEY;

export interface ResearchMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
}

export const performRegulatoryResearch = async (query: string, history: ResearchMessage[] = []) => {
  if (!API_KEY) {
    throw new Error("CRITICAL: API_KEY is missing from environment. Check environment configurations.");
  }

  // Use the latest Gemini model as per requirements
  const model = 'gemini-3-pro-preview';
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `You are the Lead Regulatory Architect at Forefront. 
  Your expertise covers Title 17, Regulation S-X, and Rule 5-04.
  
  CRITICAL INSTRUCTION: When discussing Rule 5-04 Schedule II, identify if the user is referring to the historical exclusion of 'Schedule VI'. 
  Provide high-precision technical answers. 
  If you use Google Search grounding, you MUST extract and return the URLs.
  
  Structure your responses using clear Markdown headers and bullet points for readability.`;

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for regulatory precision
      },
    });

    if (!response || !response.text) {
      throw new Error("Model returned an empty or malformed response.");
    }

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      ?.map(chunk => ({
        title: chunk.web?.title || 'Regulatory Source',
        uri: chunk.web?.uri || ''
      })) || [];

    return { text, sources };
  } catch (error: any) {
    console.error("AI Service Hostile Review - Error Captured:", error);
    // Categorize error for the UI
    if (error.message?.includes("401") || error.message?.includes("API_KEY")) {
      return { text: "Authentication Error: The regulatory engine's credentials are invalid.", sources: [] };
    }
    if (error.message?.includes("500")) {
      return { text: "Upstream Error: The Gemini inference engine is currently unavailable.", sources: [] };
    }
    throw error;
  }
};
