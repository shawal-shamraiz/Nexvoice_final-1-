import dotenv from 'dotenv';
dotenv.config();
const readPositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
export const config = {
    port: process.env.PORT || 5000,
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    clientOriginUser: process.env.CLIENT_ORIGIN_USER || 'http://localhost:5173',
    clientOriginAdmin: process.env.CLIENT_ORIGIN_ADMIN || 'http://localhost:5174',
    openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openRouterModel: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    chatbotMaxMessageLength: readPositiveInt(process.env.CHATBOT_MAX_MESSAGE_LENGTH, 2000),
    chatbotMaxMessages: readPositiveInt(process.env.CHATBOT_MAX_MESSAGES, 20),
    chatbotRateLimitRequests: readPositiveInt(process.env.CHATBOT_RATE_LIMIT_REQUESTS, 20),
    chatbotRateLimitWindowMs: readPositiveInt(process.env.CHATBOT_RATE_LIMIT_WINDOW_MS, 10 * 60 * 1000),
};
