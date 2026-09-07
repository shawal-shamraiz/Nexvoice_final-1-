import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISSUE_CATEGORIES, PROVINCES } from '../types';
import type { SubmissionType, Category } from '../types';
import { DataService } from '../lib/supabase';
import { User, Building2, Upload, Eye, EyeOff, ShieldAlert, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const RaiseIssue: React.FC = () => {
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('STUDENT');

  // Step 2 Fields
  const [fullName, setFullName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [program, setProgram] = useState('');
  const [province, setProvince] = useState(PROVINCES[0]);
  const [city, setCity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [role, setRole] = useState('');

  // Step 3 Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Scholarships');
  const [subcategory, setSubcategory] = useState('');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  // File Upload State
  const [idFile, setIdFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdIssueNumber, setCreatedIssueNumber] = useState('');
  const [createdIssueId, setCreatedIssueId] = useState('');

  // File validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      
      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file format. Please upload JPG, PNG, or PDF.');
        setIdFile(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size exceeds maximum limit of 5 MB.');
        setIdFile(null);
        return;
      }

      setIdFile(file);
    }
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !institutionName || !province || !city) {
      alert('Please fill out all required basic information fields.');
      return;
    }
    if (submissionType === 'STUDENT' && !studentId) {
      alert('Please enter your Student ID number.');
      return;
    }
    if (submissionType === 'INSTITUTION_REPRESENTATIVE' && (!institutionId || !role)) {
      alert('Please enter your Employee ID and Role/Designation.');
      return;
    }
    setStep(3);
  };

  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      alert('Please complete the title, category, and issue description.');
      return;
    }
    if (description.length < 20 || description.length > 2000) {
      alert('Description must be between 20 and 2000 characters.');
      return;
    }
    if (!idFile) {
      setFileError('Identity document upload is required for verification.');
      return;
    }
    setStep(4);
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const issue = await DataService.createIssue({
        submission_type: submissionType,
        name: fullName,
        institution_name: institutionName,
        education_level: submissionType === 'STUDENT' ? educationLevel : undefined,
        program: submissionType === 'STUDENT' ? program : undefined,
        province,
        city,
        student_id: submissionType === 'STUDENT' ? studentId : undefined,
        institution_id: submissionType === 'INSTITUTION_REPRESENTATIVE' ? institutionId : undefined,
        role: submissionType === 'INSTITUTION_REPRESENTATIVE' ? role : undefined,
        title,
        description,
        category,
        subcategory: subcategory || undefined,
        location: location || undefined,
        is_anonymous: isAnonymous
      }, idFile);

      setCreatedIssueNumber(issue.issue_number);
      setCreatedIssueId(issue.id);
      setStep(5);
    } catch {
      alert('Error submitting issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#0F172A]">Raise an Academic Issue</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Submit your genuine concern to make it visible. No account required. Identity documents remain 100% private.
        </p>
      </div>

      {/* Progress Steps Header */}
      {step < 5 && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs font-semibold">
          {[
            { n: 1, label: 'Role' },
            { n: 2, label: 'Identity Info' },
            { n: 3, label: 'Issue Details' },
            { n: 4, label: 'Review & Submit' }
          ].map((s) => (
            <div key={s.n} className={`flex items-center space-x-2 ${step >= s.n ? 'text-[#4F46E5]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step === s.n
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : step > s.n
                  ? 'bg-[#10B981] text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: Select Role */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#0F172A]">Step 1: Who are you?</h2>
            <p className="text-xs text-slate-500">Select your submission category to proceed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <button
              type="button"
              onClick={() => setSubmissionType('STUDENT')}
              className={`p-6 rounded-2xl border-2 text-left space-y-3 transition-all ${
                submissionType === 'STUDENT'
                  ? 'border-[#4F46E5] bg-[#4F46E5]/5 ring-2 ring-[#4F46E5]/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">I am a Student</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enrolled in school, college, university, or vocational program.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSubmissionType('INSTITUTION_REPRESENTATIVE')}
              className={`p-6 rounded-2xl border-2 text-left space-y-3 transition-all ${
                submissionType === 'INSTITUTION_REPRESENTATIVE'
                  ? 'border-[#4F46E5] bg-[#4F46E5]/5 ring-2 ring-[#4F46E5]/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#1E293B] text-white flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">I represent an Institution</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Faculty member, administrator, staff, or official representative.
                </p>
              </div>
            </button>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleStep1Next}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Basic & Identity Information */}
      {step === 2 && (
        <form onSubmit={handleStep2Next} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#0F172A]">Step 2: Basic & Identity Information</h2>
            <p className="text-xs text-slate-500">Provide details for record validation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ayesha Khan"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. University of Punjab"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Province *
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:outline-none bg-white"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            {submissionType === 'STUDENT' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:outline-none bg-white"
                  >
                    <option value="Secondary School">Secondary School</option>
                    <option value="Higher Secondary / Intermediate">Higher Secondary / Intermediate</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Doctoral / PhD">Doctoral / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Program / Class
                  </label>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="e.g. BS Computer Science"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student ID Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2023-CS-104"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institution / Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    placeholder="e.g. EMP-9921"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Assistant Professor"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>
              </>
            )}

          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Issue Details & Identity Upload */}
      {step === 3 && (
        <form onSubmit={handleStep3Next} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#0F172A]">Step 3: Issue Information & Verification</h2>
            <p className="text-xs text-slate-500">Detail your academic concern and upload ID proof.</p>
          </div>

          <div className="space-y-4 text-sm">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your issue clearly (e.g. Scholarship Disbursement Delay)"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:outline-none bg-white"
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. HEC Merit Scholarship"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specific Location / Department (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Admin Block, Room 102"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Issue Description *
                </label>
                <span className={`text-xs font-mono ${
                  description.length < 20 || description.length > 2000 ? 'text-amber-600 font-bold' : 'text-slate-500'
                }`}>
                  {description.length} / 2000 chars (Min 20)
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide specific details about the issue..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
              />
            </div>

            {/* IDENTITY DOCUMENT UPLOAD BOX */}
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border-2 border-dashed border-indigo-200 space-y-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#4F46E5]" />
                <h4 className="font-bold text-[#0F172A]">
                  {submissionType === 'STUDENT' ? 'Student ID Card Upload *' : 'Employee / Institution ID Upload *'}
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Identity verification is required. Accepted formats: JPG, PNG, PDF. Max size: 5 MB.
              </p>

              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="idDoc"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="idDoc"
                  className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Choose File
                </label>
                <span className="text-xs text-slate-700 font-mono truncate max-w-xs">
                  {idFile ? idFile.name : 'No file selected'}
                </span>
              </div>

              {fileError && (
                <p className="text-xs text-rose-600 font-semibold">{fileError}</p>
              )}

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start space-x-2 text-xs text-slate-600">
                <ShieldAlert className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Privacy Guarantee:</strong> This uploaded document will be saved in private storage and will NEVER be publicly accessible or displayed on the website.
                </span>
              </div>
            </div>

            {/* ANONYMOUS DISPLAY TOGGLE */}
            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 font-bold text-sm text-[#0F172A]">
                  {isAnonymous ? <EyeOff className="w-4 h-4 text-[#4F46E5]" /> : <Eye className="w-4 h-4 text-[#10B981]" />}
                  <span>Display my name publicly</span>
                </div>
                <p className="text-xs text-slate-500">
                  {isAnonymous
                    ? 'Default: OFF. Shown as "Anonymous Student" or "Anonymous Institution Representative".'
                    : 'ON: Your submitted full name will appear on the public issue card.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  isAnonymous ? 'bg-slate-300' : 'bg-[#4F46E5]'
                }`}
              >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  isAnonymous ? 'translate-x-0' : 'translate-x-6'
                }`} />
              </button>
            </div>

          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              Review Issue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Review Screen */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#0F172A]">Step 4: Review Your Issue</h2>
            <p className="text-xs text-slate-500">Please review all information prior to final submission.</p>
          </div>

          <div className="space-y-4 text-sm bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Submission Type</span>
                <span className="font-semibold text-[#0F172A]">{submissionType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Public Display Name</span>
                <span className="font-semibold text-[#0F172A]">
                  {isAnonymous ? (submissionType === 'STUDENT' ? 'Anonymous Student' : 'Anonymous Institution Representative') : fullName}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Institution</span>
                <span className="font-semibold text-[#0F172A]">{institutionName} ({city}, {province})</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Identity Document</span>
                <span className="font-semibold text-emerald-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-[#10B981]" />
                  {idFile?.name} (Private Upload)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Issue Title</span>
              <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
              
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-[#0F172A] font-bold">
                  {category}
                </span>
                {subcategory && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {subcategory}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Description</span>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm bg-white p-4 rounded-xl border border-slate-200">
                {description}
              </p>
            </div>

          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Edit Details
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitFinal}
              className="inline-flex items-center px-8 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-lg disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Success Screen */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 mx-auto flex items-center justify-center">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#0F172A]">Your voice has been recorded.</h2>
            <p className="text-sm text-slate-600">Your issue is now visible on NexVoice.</p>
          </div>

          <div className="bg-[#F8FAFC] max-w-md mx-auto p-6 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#0F172A] font-bold">Issue Reference Number</span>
            <div className="text-3xl font-black font-mono text-[#4F46E5] select-all">
              {createdIssueNumber}
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Please save this reference code for future tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(`/issues/${createdIssueId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-md transition-colors"
            >
              View Published Issue
            </button>

            <button
              onClick={() => navigate('/issues')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-sm border border-slate-300 transition-colors"
            >
              Explore Issues
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
