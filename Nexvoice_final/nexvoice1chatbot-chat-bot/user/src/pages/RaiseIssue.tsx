// NexVoice Verified Thread style: filing is an orderly public-record process with cyan state signals and private evidence handling.
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ISSUE_CATEGORIES, PROVINCES } from '../types';
import type { Category, SubmissionType } from '../types';
import { DataService } from '../lib/supabase';
import { AnimatedFormInput } from '../components/AnimatedFormInput';
import { DynamicIcon } from '../components/DynamicIcon';
import { FormStepContainer } from '../components/FormStepContainer';
import { StepProgress } from '../components/StepProgress';

type Step = 1 | 2 | 3 | 4 | 5;

export const RaiseIssue: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('STUDENT');
  const [fullName, setFullName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [program, setProgram] = useState('');
  const [province, setProvince] = useState(PROVINCES[0]);
  const [city, setCity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [role, setRole] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Scholarships');
  const [subcategory, setSubcategory] = useState('');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdIssueNumber, setCreatedIssueNumber] = useState('');
  const [createdIssueId, setCreatedIssueId] = useState('');

  const setError = (field: string) => setFieldErrors((previous) => ({ ...previous, [field]: '' }));
  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) { setFileError('Choose a JPG, PNG, or PDF document.'); setIdFile(null); return; }
    if (file.size > 5 * 1024 * 1024) { setFileError('The document must be 5 MB or smaller.'); setIdFile(null); return; }
    setIdFile(file); setFileError('');
  };
  const validateIdentity = () => {
    const errors: Record<string, string> = {};
    if (fullName.trim().length < 2) errors.fullName = 'Enter your full name.';
    if (!institutionName.trim()) errors.institutionName = 'Enter your institution name.';
    if (!city.trim()) errors.city = 'Enter your city.';
    if (submissionType === 'STUDENT' && !studentId.trim()) errors.studentId = 'Enter your student ID number.';
    if (submissionType === 'INSTITUTION_REPRESENTATIVE' && !institutionId.trim()) errors.institutionId = 'Enter your institution or employee ID.';
    if (submissionType === 'INSTITUTION_REPRESENTATIVE' && !role.trim()) errors.role = 'Enter your role or designation.';
    setFieldErrors(errors); return Object.keys(errors).length === 0;
  };
  const validateIssue = () => {
    const errors: Record<string, string> = {};
    if (title.trim().length < 8) errors.title = 'Use a concise title with at least 8 characters.';
    if (description.trim().length < 20 || description.length > 2000) errors.description = 'Describe the issue in 20 to 2,000 characters.';
    if (!idFile) setFileError('Upload an identity document for private verification.');
    setFieldErrors(errors); return Object.keys(errors).length === 0 && Boolean(idFile);
  };
  const submitIssue = async () => {
    setSubmitting(true); setSubmitError('');
    try {
      const issue = await DataService.createIssue({ submission_type: submissionType, name: fullName, institution_name: institutionName, education_level: submissionType === 'STUDENT' ? educationLevel : undefined, program: submissionType === 'STUDENT' ? program : undefined, province, city, student_id: submissionType === 'STUDENT' ? studentId : undefined, institution_id: submissionType === 'INSTITUTION_REPRESENTATIVE' ? institutionId : undefined, role: submissionType === 'INSTITUTION_REPRESENTATIVE' ? role : undefined, title, description, category, subcategory: subcategory || undefined, location: location || undefined, is_anonymous: isAnonymous }, idFile);
      setCreatedIssueNumber(issue.issue_number); setCreatedIssueId(issue.id); setStep(5);
    } catch { setSubmitError('The record could not be filed. Please try again.'); }
    finally { setSubmitting(false); }
  };
  const nav = (next: Step) => setStep(next);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="grid gap-6 animate-fade-in md:grid-cols-[minmax(0,1fr)_15rem] md:items-end"><div className="space-y-2 text-left"><div className="flex items-center gap-2 text-[#0EA5E9]"><DynamicIcon name="rocket" size={20} /><span className="text-xs font-bold uppercase tracking-widest">Public record filing</span></div><h1 className="text-3xl font-black text-[#1A1A1A]">File an academic issue</h1><p className="max-w-xl text-sm text-[#64748B]">Create a clear, traceable record in four steps. No account is required, and identity documents stay private throughout verification.</p></div><aside className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 card-shadow"><img src="/logo2.jpeg" alt="" aria-hidden="true" className="absolute -right-5 -top-5 h-24 w-24 opacity-10" /><div className="relative"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0EA5E9]">Filing ledger</span><div className="mt-2 font-mono text-sm font-bold text-[#1E2B37]">DRAFT / {String(step).padStart(2, '0')}</div><div className="mt-3 space-y-1.5 border-t border-[#E2E8F0] pt-3 text-xs"><div className="flex justify-between"><span className="text-[#64748B]">Evidence</span><span className="font-semibold text-[#14B8A6]">Private</span></div><div className="flex justify-between"><span className="text-[#64748B]">Reference</span><span className="font-semibold text-[#1A1A1A]">At publish</span></div></div></div></aside></header>
      {step < 5 && <StepProgress currentStep={step} totalSteps={4} labels={['Role', 'Identity', 'Details', 'Review']} icons={['users', 'shield', 'file-check', 'check-circle']} onStepClick={(completed) => nav(completed as Step)} />}

      {step === 1 && <FormStepContainer title="Choose your filing role" subtitle="Select the relationship you have to this academic issue." icon="users"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><button type="button" onClick={() => setSubmissionType('STUDENT')} className={`group space-y-3 rounded-2xl border-2 p-6 text-left transition-all hover:scale-[1.02] ${submissionType === 'STUDENT' ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 shadow-[0_0_0_4px_rgba(14,165,233,0.1)]' : 'border-[#E2E8F0] hover:border-[#0EA5E9]/50'}`}><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0EA5E9] text-white"><DynamicIcon name="user" size={24} color="#FFFFFF" animated /></div><div><h2 className="text-lg font-bold text-[#1A1A1A]">I am a student</h2><p className="mt-1 text-xs text-[#64748B]">Enrolled in school, college, university, or a vocational program.</p></div></button><button type="button" onClick={() => setSubmissionType('INSTITUTION_REPRESENTATIVE')} className={`group space-y-3 rounded-2xl border-2 p-6 text-left transition-all hover:scale-[1.02] ${submissionType === 'INSTITUTION_REPRESENTATIVE' ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 shadow-[0_0_0_4px_rgba(14,165,233,0.1)]' : 'border-[#E2E8F0] hover:border-[#0EA5E9]/50'}`}><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6] text-white"><DynamicIcon name="building" size={24} color="#FFFFFF" animated /></div><div><h2 className="text-lg font-bold text-[#1A1A1A]">I represent an institution</h2><p className="mt-1 text-xs text-[#64748B]">Faculty, staff, administrator, or another official representative.</p></div></button></div><div className="flex justify-end pt-6"><button type="button" onClick={() => nav(2)} className="group inline-flex items-center rounded-xl bg-[#0EA5E9] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:bg-sky-500 active:scale-[0.97]">Continue<DynamicIcon name="arrow-right" size={18} color="#FFFFFF" animated className="ml-2 group-hover:translate-x-1" /></button></div></FormStepContainer>}

      {step === 2 && <FormStepContainer title="Identity and location" subtitle="These details support verification and are not shown publicly without your permission." icon="shield"><form noValidate onSubmit={(event) => { event.preventDefault(); if (validateIdentity()) nav(3); }} className="space-y-4"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><AnimatedFormInput label="Full name" value={fullName} onChange={(value) => { setFullName(value); setError('fullName'); }} placeholder="e.g. Ayesha Khan" required icon="user" error={fieldErrors.fullName} /><AnimatedFormInput label="Institution name" value={institutionName} onChange={(value) => { setInstitutionName(value); setError('institutionName'); }} placeholder="e.g. University of Punjab" required icon="building" error={fieldErrors.institutionName} /><label className="space-y-1.5"><span className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Province</span><select value={province} onChange={(event) => setProvince(event.target.value)} className="w-full rounded-xl border-2 border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#0EA5E9] focus:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]">{PROVINCES.map((item) => <option key={item}>{item}</option>)}</select></label><AnimatedFormInput label="City" value={city} onChange={(value) => { setCity(value); setError('city'); }} placeholder="e.g. Lahore" required icon="map-pin" error={fieldErrors.city} /></div>{submissionType === 'STUDENT' ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="space-y-1.5"><span className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Education level</span><select value={educationLevel} onChange={(event) => setEducationLevel(event.target.value)} className="w-full rounded-xl border-2 border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#0EA5E9] focus:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]"><option>Undergraduate</option><option>Postgraduate</option><option>School</option><option>Vocational</option></select></label><AnimatedFormInput label="Program or class" value={program} onChange={setProgram} placeholder="e.g. BS Computer Science" icon="graduation-cap" /><div className="sm:col-span-2"><AnimatedFormInput label="Student ID number" value={studentId} onChange={(value) => { setStudentId(value); setError('studentId'); }} placeholder="e.g. 2023-CS-104" required icon="id-card" error={fieldErrors.studentId} /></div></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><AnimatedFormInput label="Institution or employee ID" value={institutionId} onChange={(value) => { setInstitutionId(value); setError('institutionId'); }} placeholder="e.g. EMP-9921" required icon="id-card" error={fieldErrors.institutionId} /><AnimatedFormInput label="Role or designation" value={role} onChange={(value) => { setRole(value); setError('role'); }} placeholder="e.g. Assistant Professor" required icon="briefcase" error={fieldErrors.role} /></div>}<div className="flex justify-between pt-4"><button type="button" onClick={() => nav(1)} className="group inline-flex items-center rounded-xl border border-[#E2E8F0] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[#FAF9F6]"><DynamicIcon name="arrow-left" size={16} animated className="mr-2 group-hover:-translate-x-1" />Back</button><button type="submit" className="group inline-flex items-center rounded-xl bg-[#0EA5E9] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:bg-sky-500 active:scale-[0.97]">Continue<DynamicIcon name="arrow-right" size={18} color="#FFFFFF" animated className="ml-2 group-hover:translate-x-1" /></button></div></form></FormStepContainer>}

      {step === 3 && <FormStepContainer title="Issue details and evidence" subtitle="Describe the concern clearly, then add identity evidence for private verification." icon="file-check"><form noValidate onSubmit={(event) => { event.preventDefault(); if (validateIssue()) nav(4); }} className="space-y-4"><AnimatedFormInput label="Issue title" value={title} onChange={(value) => { setTitle(value); setError('title'); }} placeholder="e.g. Scholarship disbursement delay" required icon="star" hint="Use at least 8 characters." error={fieldErrors.title} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="space-y-1.5"><span className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Category<span className="ml-1 text-[#0EA5E9]">*</span></span><select value={category} onChange={(event) => setCategory(event.target.value as Category)} className="w-full rounded-xl border-2 border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#0EA5E9] focus:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]">{ISSUE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><AnimatedFormInput label="Subcategory" value={subcategory} onChange={setSubcategory} placeholder="e.g. Merit scholarship" icon="folder" /></div><AnimatedFormInput label="Specific location or department" value={location} onChange={setLocation} placeholder="e.g. Admin Block, Room 102" icon="map-pin" /><div className="space-y-1.5"><div className="flex items-center justify-between"><label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Issue description<span className="ml-1 text-[#0EA5E9]">*</span></label><span className={`text-xs font-mono ${description.length < 20 || description.length > 2000 ? 'font-bold text-amber-600' : 'text-[#94A3B8]'}`}>{description.length}/2000 · min 20</span></div><div className={`rounded-xl border-2 transition-all ${fieldErrors.description ? 'border-rose-500 bg-rose-50/30' : 'border-[#E2E8F0] hover:border-[#0EA5E9]/50 focus-within:border-[#0EA5E9] focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]'}`}><textarea required rows={5} maxLength={2000} value={description} onChange={(event) => { setDescription(event.target.value); setError('description'); }} placeholder="Provide specific details about the issue…" className="w-full resize-y rounded-xl bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#94A3B8] outline-none" /></div>{fieldErrors.description && <p className="text-xs font-medium text-rose-600 animate-fade-in">{fieldErrors.description}</p>}</div><div className="space-y-2"><label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Identity document<span className="ml-1 text-[#0EA5E9]">*</span></label><div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) validateFile(file); }} className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${dragging ? 'border-[#0EA5E9] bg-[#0EA5E9]/5' : 'border-[#E2E8F0] hover:border-[#0EA5E9]/50'} ${fileError ? 'border-rose-500 bg-rose-50/30' : ''}`}><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) validateFile(file); }} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Upload identity document" /><div className="space-y-3"><DynamicIcon name={idFile ? 'file-check' : 'upload'} size={40} animated state={idFile ? 'success' : 'idle'} className="mx-auto" />{idFile ? <><p className="text-sm font-semibold text-[#1A1A1A]">{idFile.name}</p><p className="text-xs text-[#64748B]">{Math.round(idFile.size / 1024)} KB · click to change</p></> : <><p className="font-semibold text-[#1A1A1A]">Drop your ID here or click to browse</p><p className="text-xs text-[#64748B]">JPG, PNG, or PDF · maximum 5 MB</p></>}</div></div>{fileError && <p className="flex items-center gap-1 text-xs font-medium text-rose-600 animate-fade-in"><DynamicIcon name="alert" size={14} state="error" />{fileError}</p>}<div className="flex items-start gap-2 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] p-3 text-xs text-[#64748B]"><DynamicIcon name="shield" size={16} color="#0EA5E9" className="mt-0.5 shrink-0" /><span><strong className="text-[#1A1A1A]">Private verification:</strong> this document is stored privately and is never placed in the public issue record.</span></div></div><div className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-5"><div><div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]"><DynamicIcon name={isAnonymous ? 'eye-off' : 'eye'} size={18} color={isAnonymous ? '#0EA5E9' : '#14B8A6'} />Public display name</div><p className="mt-0.5 text-xs text-[#64748B]">{isAnonymous ? 'Your record will display an anonymous filing identity.' : `Your name, ${fullName || 'the filer'}, will appear publicly.`}</p></div><button type="button" role="switch" aria-checked={!isAnonymous} onClick={() => setIsAnonymous((anonymous) => !anonymous)} className={`flex h-8 w-14 items-center rounded-full p-1 transition-all ${isAnonymous ? 'bg-[#E2E8F0]' : 'bg-[#0EA5E9]'}`}><span className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform ${isAnonymous ? '' : 'translate-x-6'}`} /></button></div><div className="flex justify-between pt-4"><button type="button" onClick={() => nav(2)} className="group inline-flex items-center rounded-xl border border-[#E2E8F0] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[#FAF9F6]"><DynamicIcon name="arrow-left" size={16} animated className="mr-2 group-hover:-translate-x-1" />Back</button><button type="submit" className="group inline-flex items-center rounded-xl bg-[#0EA5E9] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:bg-sky-500 active:scale-[0.97]">Review record<DynamicIcon name="arrow-right" size={18} color="#FFFFFF" animated className="ml-2 group-hover:translate-x-1" /></button></div></form></FormStepContainer>}

      {step === 4 && (
        <FormStepContainer title="Review the record" subtitle="Confirm these details before adding the issue to the public register." icon="check-circle">
          <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 border-b border-[#E2E8F0] pb-4 sm:grid-cols-2">
              <div><span className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Filing role</span><span className="mt-1 flex items-center gap-2 font-semibold text-[#1A1A1A]"><DynamicIcon name={submissionType === 'STUDENT' ? 'user' : 'building'} size={16} />{submissionType === 'STUDENT' ? 'Student' : 'Institution representative'}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Public display</span><span className="mt-1 flex items-center gap-2 font-semibold text-[#1A1A1A]"><DynamicIcon name={isAnonymous ? 'eye-off' : 'eye'} size={16} color={isAnonymous ? '#64748B' : '#14B8A6'} />{isAnonymous ? 'Anonymous filing' : fullName}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Institution</span><span className="mt-1 font-semibold text-[#1A1A1A]">{institutionName}</span></div>
              <div><span className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Location</span><span className="mt-1 font-semibold text-[#1A1A1A]">{city}, {province}</span></div>
              <div className="sm:col-span-2"><span className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Private evidence</span><span className="mt-1 flex items-center gap-2 font-semibold text-emerald-700"><DynamicIcon name="file-check" size={16} state="success" />{idFile?.name}</span></div>
            </div>
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Issue</span>
              <h2 className="text-lg font-bold text-[#1A1A1A]">{title}</h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#0EA5E9]/10 px-2.5 py-1 font-bold text-[#0EA5E9]">{category}</span>
                {subcategory && <span className="rounded-full bg-[#E2E8F0] px-2.5 py-1 text-[#1A1A1A]">{subcategory}</span>}
                {location && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{location}</span>}
              </div>
              <p className="whitespace-pre-line rounded-xl border border-[#E2E8F0] bg-white p-4 text-sm leading-relaxed text-[#1A1A1A]">{description}</p>
            </div>
          </div>

          {/* Legal Submission Notice */}
          <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-4 text-xs text-[#64748B] space-y-1.5">
            <p className="font-medium text-[#1A1A1A] leading-relaxed">
              By submitting an issue, you confirm that the information you provide is submitted in good faith and does not intentionally contain false, misleading, abusive, or unlawful content.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-bold text-[#0EA5E9]">
              <Link to="/terms" target="_blank" className="hover:underline">📋 Terms of Service</Link>
              <span>·</span>
              <Link to="/privacy" target="_blank" className="hover:underline">🔐 Privacy Policy</Link>
              <span>·</span>
              <Link to="/age-policy" target="_blank" className="hover:underline">🧑‍🎓 Age & Guardian Policy</Link>
            </div>
          </div>

          {submitError && <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><DynamicIcon name="alert" size={18} state="error" />{submitError}</div>}
          
          <div className="flex justify-between pt-6">
            <button type="button" onClick={() => nav(3)} className="group inline-flex items-center rounded-xl border border-[#E2E8F0] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[#FAF9F6]"><DynamicIcon name="arrow-left" size={16} animated className="mr-2 group-hover:-translate-x-1" />Edit details</button>
            <button type="button" disabled={submitting} onClick={submitIssue} className="group inline-flex items-center rounded-xl bg-[#0EA5E9] px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:bg-sky-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <><DynamicIcon name="loader" size={18} state="loading" className="mr-2" />Filing…</> : <>File record<DynamicIcon name="send" size={18} color="#FFFFFF" animated className="ml-2 group-hover:-translate-y-0.5 group-hover:translate-x-1" /></>}</button>
          </div>
        </FormStepContainer>
      )}

      {step === 5 && (
        <section className="space-y-6 rounded-3xl border border-[#E2E8F0] bg-white p-8 text-center card-shadow animate-pop-in sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-50">
            <DynamicIcon name="file-check" size={48} color="#0EA5E9" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#1E2B37]">Issue Submitted for Review</h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
              Your academic issue has been submitted successfully and is awaiting review by a NexVoice administrator.
            </p>
          </div>
          <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Issue Reference</span>
              <span className="inline-flex items-center font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 text-[11px]">
                PENDING VERIFICATION
              </span>
            </div>
            <div className="select-all font-mono text-3xl font-black text-[#0EA5E9]">{createdIssueNumber}</div>
            <p className="text-xs text-[#64748B] border-t border-[#E2E8F0] pt-2">
              Your submission will become publicly visible only after review and approval by an authorized NexVoice administrator.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/issues')}
              className="w-full rounded-xl bg-[#0EA5E9] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:bg-sky-500 sm:w-auto"
            >
              Explore Public Register
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
