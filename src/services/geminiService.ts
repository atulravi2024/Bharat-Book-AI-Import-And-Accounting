import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Confidence } from "../app/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ExtractedEntity {
    name: string;
    type: 'person' | 'firm' | 'charge' | 'investment' | 'other';
    confidence: Confidence;
}

export const sanitizeModelId = (modelId?: string): string => {
    if (!modelId) return 'gemini-2.5-flash';
    const m = modelId.toLowerCase().trim();
    if (m === 'gemini-1.5-flash' || m === 'gemini-2.0-flash' || m === 'gemini 1.5 flash') {
        return 'gemini-2.5-flash';
    }
    if (m === 'gemini-1.5-pro' || m === 'gemini-1.5-pro-preview' || m === 'gemini 1.5 pro') {
        return 'gemini-2.5-pro';
    }
    if (m === 'gemini-2.0-flash-thinking-exp' || m === 'gemini-2.0-flash-thinking') {
         return 'gemini-2.5-flash';
    }
    return modelId;
};

export const getAiSettings = () => {
    try {
        const saved = localStorage.getItem('bharat_book_app_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.aiSettings) {
                const s = parsed.aiSettings;
                return {
                    ...s,
                    internalModel: sanitizeModelId(s.internalModel),
                    bankingModel: sanitizeModelId(s.bankingModel),
                    voucherModel: sanitizeModelId(s.voucherModel),
                    chatModel: s.chatModel === 'gemini-1.5-flash' || s.chatModel === 'gemini-2.0-flash' ? 'gemini-2.5-flash' : s.chatModel,
                    systemProvider: s.systemProvider || s.provider || 'internal',
                    chatProvider: s.chatProvider || s.provider || 'internal',
                    bankingProvider: s.bankingProvider || s.provider || 'internal',
                    auditProvider: s.auditProvider || s.provider || 'internal',
                    voucherProvider: s.voucherProvider || s.provider || 'internal',
                };
            }
        }
    } catch (e) {
        console.error("Error reading AI settings", e);
    }
    return { 
        provider: 'internal',
        systemProvider: 'internal',
        chatProvider: 'internal',
        bankingProvider: 'internal',
        auditProvider: 'internal',
        voucherProvider: 'internal',
    };
};

export const callExternalAi = async (prompt: string, settings: any, overrideModel?: string) => {
    const { externalProvider, apiKey, model: configModel, baseUrl } = settings;
    const targetModel = overrideModel || configModel;
    let url = baseUrl || '';
    
    if (!url) {
        if (externalProvider === 'openai') url = 'https://api.openai.com/v1/chat/completions';
        else if (externalProvider === 'groq') url = 'https://api.groq.com/openai/v1/chat/completions';
        else if (externalProvider === 'openrouter') url = 'https://openrouter.ai/api/v1/chat/completions';
        else if (externalProvider === '9router') url = 'http://localhost:20128/v1/chat/completions';
        else if (externalProvider === 'anthropic') url = 'https://api.anthropic.com/v1/messages'; 
        else if (externalProvider === 'nim') url = 'https://integrate.api.nvidia.com/v1/chat/completions';
        else url = 'https://api.openai.com/v1/chat/completions';
    }

    // Smart URL Suffixing
    const needsSuffix = !url.endsWith('/chat/completions') && 
                        !url.endsWith('/messages') && 
                        !url.endsWith('/completions') && 
                        !url.endsWith('/embeddings');
    
    if (needsSuffix && externalProvider !== 'anthropic') {
        url = `${url.replace(/\/$/, '')}/chat/completions`;
    }

    if (!apiKey && externalProvider !== '9router') throw new Error("API Key missing in settings");

    const proxyBody = {
        url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
            ...(externalProvider === 'openrouter' ? { 'HTTP-Referer': window.location.origin, 'X-Title': 'Bharat Book AI' } : {})
        },
        body: {
            model: targetModel || 'default',
            messages: [{ role: 'user', content: prompt }],
            stream: false,
            ...(externalProvider !== '9router' ? { response_format: { type: 'json_object' } } : {})
        }
    };

    // Check if URL is local (localhost or 127.0.0.1)
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
    let data: any;

    if (isLocal) {
        // Direct fetch for local URLs to reach user's machine
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify(proxyBody.body)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Local AI Provider Error (${response.status}): ${err}`);
        }
        data = await response.json();
    } else {
        // Use proxy for external URLs to bypass CORS
        const response = await fetch('/api/proxy-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proxyBody)
        });
        
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Proxy AI Error (${response.status}): ${err}`);
        }
        data = await response.json();
    }
    
    if (data.error) {
        throw new Error(`AI Provider Error: ${JSON.stringify(data.error)}`);
    }

    // Standard OpenAI format
    if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
    }
    
    // Fallback formats
    if (data.content) return data.content;
    if (data.text) return data.text;
    if (data.message) return typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
    if (typeof data === 'string') return data;

    throw new Error(`Unexpected AI response format: ${JSON.stringify(data)}`);
};

export const testAiConnection = async (settings: any): Promise<{ success: boolean; message: string; details?: { name: string; success: boolean; modelId: string; error?: string }[] }> => {
    try {
        const testPrompt = "Respond with only the word 'OK' in a JSON object like {\"status\": \"OK\"}";
        
        const configurations = [
            { 
                name: "System Tasks (Payload Parsing & Validation)", 
                provider: settings.systemProvider || settings.provider || 'internal',
                modelId: (settings.systemProvider || settings.provider || 'internal') === 'internal' 
                    ? (settings.internalModel || "gemini-2.5-flash") 
                    : (settings.internalModel || settings.model || "gpt-4o")
            },
            { 
                name: "Chatbot Model (Support Conversations & Context)", 
                provider: settings.chatProvider || settings.provider || 'internal',
                modelId: (settings.chatProvider || settings.provider || 'internal') === 'internal' 
                    ? (settings.chatModel || "gemini-2.5-flash") 
                    : (settings.chatModel || settings.model || "gpt-4o")
            },
            { 
                name: "Banking Import Model (Statement Classification Rank)", 
                provider: settings.bankingProvider || settings.provider || 'internal',
                modelId: (settings.bankingProvider || settings.provider || 'internal') === 'internal' 
                    ? (settings.bankingModel || "gemini-2.5-flash") 
                    : (settings.bankingModel || settings.model || "gpt-4o")
            },
            { 
                name: "Audit Import Model (Tax Rule Auditor & Diagnostics)", 
                provider: settings.auditProvider || settings.provider || 'internal',
                modelId: (settings.auditProvider || settings.provider || 'internal') === 'internal' 
                    ? (settings.auditModel || "gemini-2.5-flash") 
                    : (settings.auditModel || settings.model || "gpt-4o")
            },
            { 
                name: "Voucher Import Model (Double-entry extraction & Ledger mapping)", 
                provider: settings.voucherProvider || settings.provider || 'internal',
                modelId: (settings.voucherProvider || settings.provider || 'internal') === 'internal' 
                    ? (settings.voucherModel || "gemini-2.5-flash") 
                    : (settings.voucherModel || settings.model || "gpt-4o")
            }
        ];

        const details: { name: string; success: boolean; modelId: string; error?: string }[] = [];

        for (const config of configurations) {
            const isInternal = config.provider === 'internal';
            const targetModel = config.modelId;
            try {
                if (isInternal) {
                    const sanitizedId = sanitizeModelId(targetModel);
                    const model = genAI.getGenerativeModel({ model: sanitizedId });
                    const completion = await model.generateContent(testPrompt);
                    const text = completion.response.text();
                    
                    if (text && text.toUpperCase().includes('OK')) {
                        details.push({
                            name: config.name,
                            success: true,
                            modelId: sanitizedId
                        });
                    } else {
                        details.push({
                            name: config.name,
                            success: false,
                            modelId: sanitizedId,
                            error: `Returned invalid response: ${text?.substring(0, 30)}`
                        });
                    }
                } else {
                    const text = await callExternalAi(testPrompt, settings, targetModel);
                    
                    if (text && text.toUpperCase().includes('OK')) {
                        details.push({
                            name: config.name,
                            success: true,
                            modelId: targetModel
                        });
                    } else {
                        details.push({
                            name: config.name,
                            success: false,
                            modelId: targetModel,
                            error: `Returned invalid response: ${text?.substring(0, 30)}`
                        });
                    }
                }
            } catch (err: any) {
                details.push({
                    name: config.name,
                    success: false,
                    modelId: targetModel,
                    error: err.message || 'Unknown error'
                });
            }
        }

        const hasFailure = details.some(d => !d.success);
        if (hasFailure) {
            return {
                success: false,
                message: "AI Connection test failed.",
                details
            };
        }

        return {
            success: true,
            message: "Connection successful! All tasks configured and available.",
            details
        };
    } catch (error: any) {
        console.error("AI Connection Test Failed:", error);
        let errorMsg = error.message || "Unknown error occurred";
        if (errorMsg.includes("404")) errorMsg = "Model or endpoint not found (404). Check your settings.";
        if (errorMsg.includes("401")) errorMsg = "Unauthorized (401). Check your API Key.";
        return { success: false, message: errorMsg };
    }
};

export const extractEntityWithAI = async (narration: string): Promise<ExtractedEntity | null> => {
    const settings = getAiSettings();
    const prompt = `Identify the main entity (person or firm) from this bank narration: "${narration}"
            
Rules:
1. Extract ONLY the name or firm name.
2. EXCLUDE all numbers, symbols, special characters, and separators from the final name.
3. SKIP all bank codes (UBIN, HDFC, ICIC, BKDN, etc.), Account numbers, Mobile numbers, IFSC codes, payment codes (UPI, IMPS, NEFT), and payment modes.
4. If no valid person or firm name can be identified, return null or an empty name.
5. Categories: 'person' or 'firm'. Use 'other' only if it's a valid named entity that doesn't fit either.

Return JSON format:
{
  "name": "string",
  "type": "person" | "firm" | "other",
  "confidence": "High" | "Medium" | "Low"
}`;

    try {
        let textResult: string;
        const provider = settings.bankingProvider || settings.provider || 'internal';

        if (provider === 'external' || provider === 'local') {
            textResult = await callExternalAi(prompt, settings, settings.bankingModel || settings.model);
        } else {
            const internalModelId = sanitizeModelId(settings.bankingModel || settings.internalModel || "gemini-2.5-flash");
            try {
                const model = genAI.getGenerativeModel({
                    model: internalModelId,
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                });

                const result = await model.generateContent(prompt + "\n\nIMPORTANT: Output ONLY valid JSON matching the specified structure.");
                textResult = (await result.response).text();
            } catch (err: any) {
                console.warn("Internal AI Error Details:", err);
                const fallbackModel = genAI.getGenerativeModel({ model: internalModelId });
                const result = await fallbackModel.generateContent(prompt + "\n\nIMPORTANT: Output ONLY valid JSON matching the specified structure.");
                textResult = (await result.response).text();
            }
        }

        if (!textResult) return null;
        const result = JSON.parse(textResult);
        
        if (!result.name || result.name.length < 3) return null;

        return {
            name: result.name,
            type: result.type,
            confidence: result.confidence as Confidence
        };
    } catch (error) {
        console.error("AI Extraction Error:", error);
        return null;
    }
};

export interface AIMatchResult {
    matchedName: string | null;
    confidenceScore: number; // 0 to 100
    isMatch: boolean;
}

export const matchEntityWithAI = async (extractedName: string, masters: string[]): Promise<AIMatchResult> => {
    if (!extractedName || masters.length === 0) return { matchedName: null, confidenceScore: 0, isMatch: false };
    
    const settings = getAiSettings();
    const prompt = `Match the extracted name "${extractedName}" against the following list of master names:
[${masters.join(', ')}]

Rules:
1. Compare based on semantic similarity and common naming variations.
2. Provide a confidence score from 0 to 100.
3. A match is only considered VALID (isMatch: true) if the confidence score is ABOVE 75.
4. If no match is above 75, set matchedName to "" (empty string) and isMatch to false.

Return JSON format:
{
  "matchedName": "string or empty string",
  "confidenceScore": number,
  "isMatch": boolean
}`;

    try {
        let textResult: string;
        const provider = settings.bankingProvider || settings.provider || 'internal';

        if (provider === 'external' || provider === 'local') {
            textResult = await callExternalAi(prompt, settings, settings.bankingModel || settings.model);
        } else {
            const internalModelId = sanitizeModelId(settings.bankingModel || settings.internalModel || "gemini-2.5-flash");
            
            try {
                const model = genAI.getGenerativeModel({
                    model: internalModelId,
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                });

                const result = await model.generateContent(prompt + "\n\nIMPORTANT: Output ONLY valid JSON matching the specified structure.");
                textResult = (await result.response).text();
            } catch (err: any) {
                console.warn("AI Generation with JSON mime-type failed, retrying without mime-type:", err);
                const fallbackModel = genAI.getGenerativeModel({ model: internalModelId });
                const result = await fallbackModel.generateContent(prompt + "\n\nIMPORTANT: Output ONLY valid JSON matching the specified structure.");
                textResult = (await result.response).text();
            }
        }

        const result = JSON.parse(textResult);
        
        // Strict enforcement of 75% rule even if AI hallucinated isMatch: true but score <= 75
        const finalIsMatch = result.confidenceScore > 75 && result.isMatch;

        return {
            matchedName: finalIsMatch && result.matchedName ? result.matchedName : null,
            confidenceScore: result.confidenceScore,
            isMatch: finalIsMatch
        };
    } catch (error) {
        console.error("AI Matching Error:", error);
        return { matchedName: null, confidenceScore: 0, isMatch: false };
    }
};
