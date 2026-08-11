// Puter.js AI helper — calls AI models directly from the browser.
// No API key, no backend. Docs: https://docs.puter.com/AI/chat/

declare global {
  interface Window {
    puter: any;
  }
}

function extractText(response: any): string {
  if (typeof response === 'string') return response;
  if (response?.message?.content) {
    const content = response.message.content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content) && content[0]?.text) return content[0].text;
  }
  if (response?.toString && typeof response.toString === 'function') {
    const s = response.toString();
    if (s && s !== '[object Object]') return s;
  }
  return String(response ?? '');
}

function stripJsonFences(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

/**
 * Calls Puter.js AI chat directly from the browser.
 * @param systemPrompt Instructions/context for the model.
 * @param userPrompt The user's actual request.
 * @param jsonMode If true, instructs the model to respond with JSON only and strips markdown fences from the result.
 */
export async function askPuterAI(
  systemPrompt: string,
  userPrompt: string,
  jsonMode: boolean = false
): Promise<string> {
  if (!window.puter || !window.puter.ai || typeof window.puter.ai.chat !== 'function') {
    throw new Error('خدمة الذكاء الاصطناعي لم يتم تحميلها بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
  }

  const jsonInstruction = jsonMode
    ? '\n\nمهم جداً: يجب أن يكون ردك بصيغة JSON صالحة فقط بدون أي نص أو شرح قبل أو بعد الـ JSON، وبدون علامات ```.'
    : '';

  const fullPrompt = `${systemPrompt}${jsonInstruction}\n\n${userPrompt}`;

  const response = await window.puter.ai.chat(fullPrompt);
  let text = extractText(response);

  if (jsonMode) {
    text = stripJsonFences(text);
  }

  if (!text || !text.trim()) {
    throw new Error('لم يتم استلام رد من نموذج الذكاء الاصطناعي. حاول مرة أخرى.');
  }

  return text;
}
