import { GoogleGenAI } from "@google/genai";
import { VehicleData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getAiAssistance = async (
  prompt: string,
  vehicleData: VehicleData | null
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your Gemini API Key.";
  }

  const context = vehicleData
    ? `
    I am currently connected to my Tesla. Here is the real-time vehicle JSON data:
    \`\`\`json
    ${JSON.stringify(vehicleData)}
    \`\`\`
    
    Interpret this data to answer my question. 
    - If I ask about range, analyze the battery_level and battery_range.
    - If I ask about diagnostics, look at tire pressures, alerts, or odometer.
    - If I ask about climate, check inside_temp and is_climate_on.
    - Be helpful, concise, and act like an expert Tesla technician and concierge.
    `
    : "I am a Tesla expert assistant.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${context}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction: "You are an advanced AI assistant integrated into a Tesla Dashboard application.",
      }
    });

    return response.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error communicating with the AI service.";
  }
};
