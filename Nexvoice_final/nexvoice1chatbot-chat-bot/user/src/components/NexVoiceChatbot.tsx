import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { DynamicIcon } from './DynamicIcon';
import { sendChatMessage } from '../lib/chatbot';
import type { ChatMessageInput, ChatMessageRole } from '../lib/chatbot';

interface ChatMessage extends ChatMessageInput {
  id: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const greeting: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content: 'Hi, I’m the NexVoice assistant. I can explain how the platform works and guide you through filing an issue.',
};

const quickQuestions = [
  'How do I file an issue?',
  'What information do I need to provide?',
  'What happens after I submit?',
];

const createMessage = (role: ChatMessageRole, content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
});

export function NexVoiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const closeChat = () => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const sendMessage = async (rawMessage: string) => {
    const content = rawMessage.trim();
    if (!content || isSending) return;

    if (content.length > MAX_MESSAGE_LENGTH) {
      setError(`Please keep messages to ${MAX_MESSAGE_LENGTH.toLocaleString()} characters or fewer.`);
      return;
    }

    const userMessage = createMessage('user', content);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsSending(true);

    try {
      const response = await sendChatMessage(nextMessages.map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      })));
      setMessages((current) => [...current, createMessage('assistant', response)]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The assistant is temporarily unavailable. Please try again shortly.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const clearConversation = () => {
    setMessages([greeting]);
    setInput('');
    setError('');
  };

  return (
    <>
      {isOpen && (
        <section
          id="nexvoice-chatbot"
          role="dialog"
          aria-modal="false"
          aria-labelledby="nexvoice-chatbot-title"
          className="fixed inset-x-4 bottom-24 z-50 flex max-h-[min(40rem,calc(100vh-8rem))] flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[min(24rem,calc(100vw-3rem))]"
        >
          <header className="flex items-start justify-between gap-4 bg-[#1E2B37] px-5 py-4 text-white">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0EA5E9]">
                <DynamicIcon name="sparkles" size={21} color="#FFFFFF" />
              </div>
              <div>
                <h2 id="nexvoice-chatbot-title" className="font-bold">NexVoice assistant</h2>
                <p className="mt-0.5 text-xs text-slate-300">Guidance for the public portal</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearConversation}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <DynamicIcon name="x-circle" size={17} />
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close NexVoice assistant"
              >
                <DynamicIcon name="x" size={19} />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#FAF9F6] px-4 py-4" aria-live="polite">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'rounded-br-md bg-[#0EA5E9] text-white'
                        : 'rounded-bl-md border border-[#E2E8F0] bg-white text-[#1A1A1A]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#E2E8F0] bg-white px-3.5 py-3 text-xs text-[#64748B]" aria-label="Assistant is typing">
                    <DynamicIcon name="loader" size={15} state="loading" />
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {messages.length === 1 && !isSending && (
            <div className="border-t border-[#E2E8F0] bg-white px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Quick questions</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void sendMessage(question)}
                    className="rounded-full border border-[#BAE6FD] bg-sky-50 px-3 py-1.5 text-left text-xs font-semibold text-[#0369A1] transition-colors hover:bg-sky-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#E2E8F0] bg-white p-3">
            <label htmlFor="nexvoice-chat-input" className="sr-only">Message the NexVoice assistant</label>
            <input
              ref={inputRef}
              id="nexvoice-chat-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (error) setError('');
              }}
              placeholder="Ask about NexVoice…"
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isSending}
              className="min-w-0 flex-1 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E9] text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <DynamicIcon name="send" size={17} color="#FFFFFF" />
            </button>
          </form>
        </section>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#1E2B37] px-4 py-3 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#263846] focus-visible:outline-offset-4 sm:right-6"
        aria-expanded={isOpen}
        aria-controls="nexvoice-chatbot"
        aria-label={isOpen ? 'Close NexVoice assistant' : 'Open NexVoice assistant'}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0EA5E9]">
          <DynamicIcon name={isOpen ? 'x' : 'message'} size={17} color="#FFFFFF" />
        </span>
        <span className="hidden sm:inline">{isOpen ? 'Close assistant' : 'Ask NexVoice'}</span>
      </button>
    </>
  );
}