// NexVoice Verified Thread style: contact is handled as a clear, private message record with visible field feedback.
import { useState } from 'react';
import { DataService } from '../lib/supabase';
import { AnimatedFormInput } from './AnimatedFormInput';
import { DynamicIcon } from './DynamicIcon';

interface ContactFormProps { onSuccess?: () => void; }
type ContactData = { name: string; email: string; subject: string; message: string; };

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = (field: keyof ContactData, value: string) => { setFormData((previous) => ({ ...previous, [field]: value })); setErrors((previous) => ({ ...previous, [field]: '' })); };
  const validate = () => {
    const next: Record<string, string> = {};
    if (formData.name.trim().length < 2) next.name = 'Enter a name with at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email address.';
    if (!formData.subject.trim()) next.subject = 'Add a short subject.';
    if (formData.message.trim().length < 10) next.message = 'Provide at least 10 characters so we can understand your message.';
    setErrors(next); return Object.keys(next).length === 0;
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!validate()) return; setSubmitting(true); setSubmitError('');
    try { const success = await DataService.sendContactMessage(formData); if (!success) throw new Error('Contact message could not be stored.'); setSubmitted(true); setFormData({ name: '', email: '', subject: '', message: '' }); onSuccess?.(); }
    catch { setSubmitError('Your message could not be sent. Please review the form and try again.'); }
    finally { setSubmitting(false); }
  };
  if (submitted) return <div className="space-y-4 py-12 text-center animate-pop-in"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"><DynamicIcon name="check" size={40} state="success" /></div><h3 className="text-2xl font-bold text-[#1A1A1A]">Message recorded</h3><p className="mx-auto max-w-sm text-[#64748B]">Thank you for contacting NexVoice. Your message has been added to the contact record.</p><button type="button" onClick={() => setSubmitted(false)} className="rounded-xl bg-[#0EA5E9] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:bg-sky-500 active:scale-[0.97]">Send another message</button></div>;
  return <form noValidate onSubmit={submit} className="space-y-5"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><AnimatedFormInput label="Your name" value={formData.name} onChange={(value) => setField('name', value)} placeholder="e.g. Ayesha Khan" required icon="user" error={errors.name} /><AnimatedFormInput label="Email address" type="email" value={formData.email} onChange={(value) => setField('email', value)} placeholder="e.g. ayesha@example.com" required icon="mail" error={errors.email} /></div><AnimatedFormInput label="Subject" value={formData.subject} onChange={(value) => setField('subject', value)} placeholder="What is this regarding?" required icon="message" error={errors.subject} /><div className="space-y-1.5"><label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Message<span className="ml-1 text-[#0EA5E9]">*</span></label><div className={`relative rounded-xl border-2 transition-all duration-300 ${errors.message ? 'border-rose-500 bg-rose-50/30' : 'border-[#E2E8F0] hover:border-[#0EA5E9]/50 focus-within:border-[#0EA5E9] focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]'}`}><textarea value={formData.message} onChange={(event) => setField('message', event.target.value)} placeholder="Describe your question, feedback, or concern in detail..." rows={5} maxLength={1000} className="min-h-[130px] w-full resize-y rounded-xl bg-transparent px-4 py-3 pr-16 text-sm text-[#1A1A1A] placeholder:text-[#94A3B8] outline-none" /><span className="absolute bottom-3 right-3 text-xs text-[#94A3B8]">{formData.message.length}/1000</span></div>{errors.message && <p className="text-xs font-medium text-rose-600 animate-fade-in">{errors.message}</p>}</div>{submitError && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 animate-fade-in"><DynamicIcon name="alert" size={20} state="error" className="mt-0.5 shrink-0" />{submitError}</div>}<button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-sky-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <><DynamicIcon name="loader" size={20} state="loading" />Sending…</> : <>Send message<DynamicIcon name="send" size={18} animated className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" /></>}</button></form>;
}
