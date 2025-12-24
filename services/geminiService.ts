
import { GoogleGenAI } from "@google/genai";
import { CrimeRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeInvestigation = async (record: CrimeRecord): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        As a senior forensic analyst, please provide a concise executive summary of the following criminal investigation record.
        Include potential links to other cold cases or suggestions for further inquiry if applicable.
        
        Criminal Name: ${record.criminalName}
        Area: ${record.crimeSceneArea}
        Process: ${record.investigationProcess}
        Status: ${record.status}
      `,
      config: {
        systemInstruction: "You are an expert detective consultant. Provide professional, concise, and insightful case summaries.",
        temperature: 0.7,
      },
    });
    return response.text || "Summary could not be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to Intelligence engine.";
  }
};
