import { GoogleGenAI } from "@google/genai";
import { Attack } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAttackAnalysis = async (attack: Attack): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve(`**Analysis Unavailable: API Key Not Configured**

A detailed analysis for the attack from **${attack.ip}** could not be generated. The Gemini API key is missing. Please configure the API key to enable this feature.

**Attack Details:**
- **Type:** ${attack.type}
- **Severity:** ${attack.severity}
- **Source:** ${attack.country}`);
  }

  const prompt = `
    Analyze the following cybersecurity event from a honeypot. Provide a clear, technical analysis.

    Event Details:
    - Attack Type: ${attack.type}
    - Severity: ${attack.severity}
    - Source IP: ${attack.ip}
    - Location: ${attack.country}

    Provide your analysis under the following exact headings. Do not use any markdown formatting (like ##, **, or lists with * or -).

    Threat Description:
    [Your detailed explanation here]

    Potential Impact:
    [Your description of potential damage here]

    Indicators of Compromise (IoCs):
    [Your list of potential IoCs here]

    Recommended Mitigation Steps:
    [Your prioritized list of actions here]

    Simulated Log Entry:
    [Your fictional log entry here]

    IMPORTANT: Do not include any introductory or concluding remarks. Do not add an analyst signature or sign-off.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching attack analysis from Gemini:", error);
    return "Error: Could not retrieve analysis from AI service. The service may be temporarily unavailable or the API key may be invalid.";
  }
};

export const getAttackSummary = async (analysis: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Summary generation disabled: API Key not configured.");
  }

  const prompt = `
    You are a helpful assistant. Summarize the following cybersecurity analysis into a single, concise sentence for a quick overview.
    The summary should capture the essence of the threat and its primary risk.

    **Full Analysis:**
    ${analysis}

    **One-sentence Summary:**
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching attack summary from Gemini:", error);
    return "Error: Could not retrieve summary from AI service.";
  }
};