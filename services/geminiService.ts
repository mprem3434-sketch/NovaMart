
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartSuggestions = async (query: string) => {
  if (!query || query.length < 3) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 concise shopping search terms related to: "${query}". Return only the list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};

export const generateSEOData = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate SEO metadata for a product named "${productName}" in the category "${category}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            slug: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["metaTitle", "metaDescription", "slug", "tags"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return null;
  }
};

export const getProductAnalysis = async (productName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a quick 2-sentence marketing highlight for a product named "${productName}".`,
    });
    return response.text;
  } catch (error) {
    return "This product is highly rated and recommended by our experts.";
  }
};

export const generateAIDescription = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a professional e-commerce copywriter. Write a compelling, detailed product description (approx 50 words) for a new "${category}" product named "${productName}". Focus on quality, utility, and modern lifestyle.`,
    });
    return response.text;
  } catch (error) {
    return "Failed to generate description. Please enter manually.";
  }
};

export const generateTrustPolicies = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate standard warranty and return policy text for a product named "${productName}" in the "${category}" category. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            warranty: { type: Type.STRING, description: "Detailed warranty text" },
            returnPolicy: { type: Type.STRING, description: "Detailed return policy text" }
          },
          required: ["warranty", "returnPolicy"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      warranty: "Standard 1-year brand warranty applies.",
      returnPolicy: "Easy 7-day return if item is unopened and in original packaging."
    };
  }
};
