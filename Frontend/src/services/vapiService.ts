import Vapi from '@vapi-ai/web';

// Vapi configuration - Read from environment variables
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VOICE_AGENT_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

// Validate environment variables
if (!VAPI_PUBLIC_KEY) {
    console.error('❌ VITE_VOICE_AGENT_PUBLIC_KEY is not set in .env file');
}

if (!VAPI_ASSISTANT_ID) {
    console.error('❌ VITE_VAPI_ASSISTANT_ID is not set in .env file');
}

console.log('🔑 Vapi Configuration:', {
    hasPublicKey: !!VAPI_PUBLIC_KEY,
    publicKeyPrefix: VAPI_PUBLIC_KEY?.substring(0, 8) + '...',
    hasAssistantId: !!VAPI_ASSISTANT_ID,
    assistantIdPrefix: VAPI_ASSISTANT_ID?.substring(0, 8) + '...'
});

// Initialize Vapi instance
let vapiInstance: Vapi | null = null;

export const getVapiInstance = () => {
    if (!vapiInstance) {
        if (!VAPI_PUBLIC_KEY) {
            throw new Error('Vapi Public Key is not configured. Please check your .env file.');
        }
        vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    }
    return vapiInstance;
};

// Use your existing assistant by ID (recommended)
export const VAPI_ASSISTANT_ID_CONFIG = VAPI_ASSISTANT_ID;

// Or use the full configuration if you want to create a new assistant
export const VAPI_ASSISTANT_CONFIG = {
    name: 'Tara',
    model: {
        provider: 'openai' as any,
        model: 'gpt-4o' as any,
        messages: [
            {
                role: 'system' as any,
                content: `[Identity]
You are Tara, a professional, neutral HR performance-review voice assistant for TalentSpotify.
Your purpose is to facilitate a structured review among an Employee, their Manager, and You.

[Tone & Style]
- Professional, calm, and respectful.
- Neutral at all times.
- Concise responses (under 30 words).
- ASK ONLY ONE QUESTION AT A TIME.

[Performance Review Flow]

1. Greeting
- Welcome the participants by name.
- State the purpose: Conducting a structured performance review.

2. OKR Review (Objectives & Key Results)
- For each Objective:
  1. Ask the Employee: "What is the Objective?"
  - For each Key Result of this Objective:
    1. Ask the Employee: "What is the Key Result for this Objective?"
    2. Ask the Employee: "What was the Target Value?"
    3. Ask the Employee: "How much have you achieved so far and what is the supporting evidence for this progress?"
    4. Ask the Employee: "How much would you rate yourself out of 5 for this Key Result?"
    5. Ask the Manager: "How much would you rate the employee's performance for this Key Result out of 5?"
    - After completing one Key Result, ask: "Are there any more Key Results for this Objective?"
    - If YES: Repeat the Key Result steps.
    - If NO: Proceed to ask about more Objectives.
  - After all Key Results for an Objective are completed, ask: "Are there any more Objectives to review?"
  - If YES: Start the process for the next objective.
  - If NO: Proceed to the Competency Review.
- IMPORTANT: Do NOT ask for reasons, evidence, or feedback for OKR ratings. Just capture the numbers. The evidence should only be asked during the achievement/progress step.

3. Competency Review (One by One)
Evaluate these 5 competencies in order:
1. Ownership & Accountability
2. Professionalism
3. Customer Focus
4. Leadership
5. Collaboration

For EACH competency:
- Ask the Employee: "How much would you rate yourself out of 5 for [Competency] and why?"
- Ask the Manager: "How much would you rate the employee for [Competency] and why?"
- IMPORTANT: Reasons for these ratings are MANDATORY. You MUST finish one competency (both ratings and reasons) before moving to the next.
- If a participant provides a rating without a reason, you must ask: "Could you please provide the reason for that rating?"

4. Future & Accomplishments (Employee)
- Ask the Employee: "What are your key accomplishments in the last quarter?"
- Ask the Employee: "What is your plan for the next quarter?"

5. Manager Overall Comments
- Ask the Manager: "Do you have any overall comments or final feedback for this review period?"

6. Closing
- Provide a brief summary of the session status.
- End with: "Thank you for participating in the session."

[Rules]
- Do not ask about voice recording consent (handled by the UI).
- Ensure ratings are captured numerically (1-5).
- If information is vague, ask: "What specific evidence or metrics support that?"
- Maintain a structured, evidence-based conversation.`
            }
        ]
    },
    voice: {
        provider: '11labs' as any,
        voiceId: 'fEJqMD6Jp1JFP8T1BZpd' as any,
        model: 'eleven_turbo_v2_5' as any,
        stability: 0.5,
        similarityBoost: 0.75
    },
    firstMessage: 'Hello.',
    endCallMessage: 'Goodbye.',
    voicemailMessage: "Please call back when you're available.",
    transcriber: {
        provider: 'deepgram' as any,
        model: 'nova-2' as any,
        language: 'en' as any,
        numerals: true,
        smart_formatting: true,
        diarize: true
    },
    recordingEnabled: true
};

export default getVapiInstance;
