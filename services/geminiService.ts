
import { GoogleGenAI } from "@google/genai";
import { NewsItem, GroundingChunk, ChatMessage } from "../types";

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Fix: Add generateArticleImage to support image generation in AdminDashboard.
// This function uses gemini-2.5-flash-image to create editorial illustrations.
export const generateArticleImage = async (prompt: string): Promise<string | null> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("API Key is missing for image generation.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, modern, and minimalist financial editorial illustration for an article titled: "${prompt}". Use a sophisticated color palette suitable for a corporate financial portal. No text in the image.`,
          },
        ],
      },
    });

    // Iterate through response parts to find the generated image data.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Failed to generate image from Gemini:", error);
    return null;
  }
};

export const fetchFinancialNews = async (): Promise<NewsItem[]> => {
  try {
    // API key check remains to handle demo mode
    if (!process.env.API_KEY) {
      console.warn("API Key is missing. Returning mock data.");
      return getMockNews();
    }

    // Initialize GoogleGenAI directly with process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      // Use 'gemini-3-flash-preview' for text summarization and crawling tasks
      model: "gemini-3-flash-preview",
      contents: `You are an AI Web Crawler for a financial portal. 
      Scan the web for the top 6 most important financial news stories right now.
      
      CRAWLER DIRECTIVES:
      1. PRIORITY: Focus on African Financial Markets (Nigeria, South Africa, Kenya, Egypt). Look for updates on CBDCs, Fintech funding, Forex rates (Naira/Rand), and Central Bank policies.
      2. SECONDARY: Major Global Economic events that impact Emerging Markets (Fed Rates, Oil Prices, Crypto regulation).
      
      Return the response in this EXACT plain text format for each story, separated by "---":
      
      Title: [Headline - Punchy, < 10 words]
      Summary: [A concise 2-sentence summary focusing on the economic impact]
      Impact: [Bullish, Bearish, or Neutral]
      Image: [Find a direct URL to a relevant news image or thumbnail from the source if available. If not found, leave this file empty.]
      ---
      Title: [Headline 2]...
      `,
      config: {
        // Search Grounding tool configuration
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract text output from response.text property
    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    const stories = text.split('---').map(block => block.trim()).filter(block => block.length > 0);
    
    const parsedNews: NewsItem[] = stories.map((story, index) => {
      const titleMatch = story.match(/Title:\s*(.+)/);
      const summaryMatch = story.match(/Summary:\s*(.+)/);
      const impactMatch = story.match(/Impact:\s*(.+)/);
      const imageMatch = story.match(/Image:\s*(.+)/);

      let imageUrl = imageMatch ? imageMatch[1].trim() : undefined;
      
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = undefined;
      }

      return {
        id: generateId(),
        title: titleMatch ? titleMatch[1].trim() : "African Market Update",
        summary: summaryMatch ? summaryMatch[1].trim() : "Latest movements in the continental financial sector.",
        impact: (impactMatch ? impactMatch[1].trim() : "Neutral") as 'Bullish' | 'Bearish' | 'Neutral',
        imageUrl: imageUrl,
        // Extract sources from grounding metadata as required by guidelines
        sources: index < groundingChunks.length && groundingChunks[index]?.web 
          ? [groundingChunks[index].web!] 
          : index === 0 && groundingChunks.length > 0 ? [groundingChunks[0].web!] : []
      };
    }).slice(0, 6); 

    return parsedNews;

  } catch (error) {
    console.error("Failed to fetch news from Gemini:", error);
    return getMockNews();
  }
};

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "I'm currently in demo mode (API Key missing). I can help you navigate the site, but I can't process live queries yet!";
    }

    // Initialize with named parameter as required
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      // Use 'gemini-3-flash-preview' for basic customer support chat
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are 'Nova', the advanced AI support specialist for CASIEC FINANCIALS & GSI STRATEGIC ALLIANCES (Broastreet DyDX). 
        Your persona is professional, knowledgeable, slightly futuristic, and helpful.
        
        Identity & Values:
        - Vision: To be the leading story and benchmark in finance & business support.
        - Mission: Delivering credit, capital and enterprise support to stimulate business growth.
        - Mandate: Fostering economic advancement through financial inclusion.
        - "Words on the Marble": God’s Own Institution (GOI factor).
        - Core Values: Growth & Professionalism, Opportunities & Resourcefulness, Innovation & Integrity.
        
        Your Capabilities:
        1. Explain services: Commercial Real Estate Loans, Business Term Loans, SBA Loans, and Business Support Advisory.
        2. Provide contact info: 
           - Strategic Alliances (GSI): info@broastreet.africa | +234 818-398-7171 (Dl)
           - CASIEC Financials: info@casiecfinancials.com | +234 810-326-0048 or +234 810-537-5394
        3. Guide users to the "Apply" button or "Contact" section.
        
        Guidelines:
        - Keep responses concise (under 60 words).
        - Do not give specific financial advice.
        - If unsure, suggest emailing info@casiecfinancials.com or info@broastreet.africa.
        `,
      },
      history: chatHistory
    });

    // sendMessage only accepts message parameter
    const result = await chat.sendMessage({ message: newMessage });
    // Use .text property for content extraction
    return result.text || "I apologize, I'm having trouble accessing my neural network right now.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "System offline. Please check your connection or try again later.";
  }
};

const getMockNews = (): NewsItem[] => [
  {
    id: "1",
    title: "Nigerian Fintech Sector Sees Record Inflows",
    summary: "Despite global headwinds, Lagos-based payment processors raised over $200M in Q3, signaling strong investor confidence in African tech.",
    impact: "Bullish",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
    sources: [{ uri: "#", title: "TechCab" }, { uri: "#", title: "Bloomberg Africa" }]
  },
  {
    id: "2",
    title: "Rand Strengthens as Mining Output Surges",
    summary: "South Africa's currency gained 2% against the dollar following positive platinum group metals production data and eased power cuts.",
    impact: "Bullish",
    imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    title: "AfCFTA Implementation Enters Phase 2",
    summary: "New protocols for digital trade and investment under the African Continental Free Trade Area are expected to boost intra-Africa commerce by 15%.",
    impact: "Bullish",
    imageUrl: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=800"
  }
];
