import { GoogleGenAI } from "@google/genai";
import { NewsItem, GroundingChunk, ChatMessage } from "../types";

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const fetchFinancialNews = async (): Promise<NewsItem[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing. Returning mock data.");
      return getMockNews();
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash for speed and search capability
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an AI Web Crawler for a financial portal. 
      Scan the web for the top 6 most important financial news stories right now.
      
      CRAWLER DIRECTIVES:
      1. PRIORITY: Focus on African Financial Markets (Nigeria, South Africa, Kenya, Egypt). Look for updates on CBDCs, Fintech funding, Forex rates (Naira/Rand), and Central Bank policies.
      2. SECONDARY: Major Global Economic events that impact Emerging Markets (Fed Rates, Oil Prices, Crypto regulation).
      
      Return the response in this EXACT plain text format for each story, separated by "---":
      
      Title: [Headline - Punchy, < 10 words]
      Summary: [A concise 2-sentence summary focusing on the economic impact]
      Impact: [Bullish, Bearish, or Neutral]
      Image: [Find a direct URL to a relevant news image or thumbnail from the source if available. If not found, leave this field empty.]
      ---
      Title: [Headline 2]...
      `,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    // Parse the text manually
    const stories = text.split('---').map(block => block.trim()).filter(block => block.length > 0);
    
    const parsedNews: NewsItem[] = stories.map((story, index) => {
      const titleMatch = story.match(/Title:\s*(.+)/);
      const summaryMatch = story.match(/Summary:\s*(.+)/);
      const impactMatch = story.match(/Impact:\s*(.+)/);
      const imageMatch = story.match(/Image:\s*(.+)/);

      let imageUrl = imageMatch ? imageMatch[1].trim() : undefined;
      
      // Basic validation to ensure it's a URL and not text
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = undefined;
      }

      return {
        id: generateId(),
        title: titleMatch ? titleMatch[1].trim() : "African Market Update",
        summary: summaryMatch ? summaryMatch[1].trim() : "Latest movements in the continental financial sector.",
        impact: (impactMatch ? impactMatch[1].trim() : "Neutral") as 'Bullish' | 'Bearish' | 'Neutral',
        imageUrl: imageUrl,
        // Attach source if available in the grounding metadata
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "I'm currently in demo mode (API Key missing). I can help you navigate the site, but I can't process live queries yet!";
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format history for the SDK
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are 'Nova', the advanced AI support specialist for KC Financial Group. 
        Your persona is professional, knowledgeable, slightly futuristic, and helpful.
        
        Your Capabilities:
        1. Explain KC Financial's services: Commercial Real Estate Loans, Business Term Loans, SBA Loans, and Business Support Advisory.
        2. Provide general information about interest rates (e.g., Real Estate starts at 6.875%, Business Loans at 6.99%).
        3. Guide users to the "Apply" button or "Contact" section for specific deals.
        
        Guidelines:
        - Keep responses concise (under 60 words) unless detailed explanation is asked.
        - Do not give specific financial advice or guarantee approval.
        - If you don't know an answer, politely suggest they contact a human advisor at support@kcfinancial.com.
        `,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I apologize, I'm having trouble accessing my neural network right now.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "System offline. Please check your connection or try again later.";
  }
};

// Fallback data if API key is missing or fails
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
    title: "Inflation Pressures Persist in East Africa",
    summary: "Central Banks in Kenya and Uganda hint at further rate hikes as fuel subsidies are removed and import costs rise.",
    impact: "Bearish",
    // No image for this one to test fallback
  },
  {
    id: "4",
    title: "AfCFTA Implementation Enters Phase 2",
    summary: "New protocols for digital trade and investment under the African Continental Free Trade Area are expected to boost intra-Africa commerce by 15%.",
    impact: "Bullish",
    imageUrl: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "5",
    title: "Crypto Adoption Spikes in Sub-Saharan Africa",
    summary: "Retail usage of stablecoins for cross-border payments has grown 40% YoY as businesses seek alternatives to volatile local currencies.",
    impact: "Neutral",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800"
  }
];