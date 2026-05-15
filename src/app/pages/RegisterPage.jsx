import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import Logo from '../../components/Logo.jsx'
import { auth, db } from '../../lib/firebase.js'

const STEPS = [
  { id: 1, title: 'Account Type' },
  { id: 2, title: 'Basic Info' },
  { id: 3, title: 'ID Verification' },
  { id: 4, title: 'Business Info' },
  { id: 5, title: 'Privacy & Submit' },
]

const ACCEPTED_IDS = [
  'Valid School ID (Current Semester)',
  'PhilID (National ID)',
  "Voter's ID / Certification",
  "Driver's License",
  'UMID',
  'Postal ID',
  'Barangay Certificate of Residency',
]

export default function RegisterPage({ onBack, onSuccess }) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    accountType: '',
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    idType: '',
    idFrontFile: null,
    idSelfieFile: null,
    businessName: '',
    businessNature: '',
    proofFile: null,
    privacyAgreed: false,
  })

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateStep = () => {
    const newErrors = {}
    if (step === 1 && !form.accountType) newErrors.accountType = 'Please select an account type.'
    if (step === 2) {
      if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.'
      if (!form.email.trim()) newErrors.email = 'Email is required.'
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address.'
      if (!form.password.trim()) newErrors.password = 'Password is required.'
      else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.'
      if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required.'
      if (!form.address.trim()) newErrors.address = 'Residential address is required.'
    }
    if (step === 3) {
      if (!form.idType) newErrors.idType = 'Please select an ID type.'
      if (!form.idFrontFile) newErrors.idFrontFile = 'Please upload front of your ID.'
      if (!form.idSelfieFile) newErrors.idSelfieFile = 'Please upload a selfie with your ID.'
    }
    if (step === 4 && form.accountType === 'employer') {
      if (!form.businessName.trim()) newErrors.businessName = 'Business name is required.'
      if (!form.businessNature.trim()) newErrors.businessNature = 'Nature of business is required.'
      if (!form.proofFile) newErrors.proofFile = 'Please upload proof of operation.'
    }
    if (step === 5 && !form.privacyAgreed) newErrors.privacyAgreed = 'You must agree to the privacy policy.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep()) return
    // Skip step 4 if job seeker
    if (step === 3 && form.accountType === 'jobseeker') {
      setStep(5)
    } else {
      setStep(s => Math.min(s + 1, 5))
    }
  }

  const prevStep = () => {
    if (step === 5 && form.accountType === 'jobseeker') {
      setStep(3)
    } else {
      setStep(s => Math.max(s - 1, 1))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setSubmitting(true)

    try {
      const account = await createUserWithEmailAndPassword(auth, form.email, form.password)

      await updateProfile(account.user, {
        displayName: form.fullName,
      })

      await setDoc(doc(db, 'users', account.user.uid), {
        uid: account.user.uid,
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        accountType: form.accountType,
        idType: form.idType,
        idFrontFileName: form.idFrontFile?.name ?? null,
        idSelfieFileName: form.idSelfieFile?.name ?? null,
        businessName: form.businessName || '',
        businessNature: form.businessNature || '',
        proofFileName: form.proofFile?.name ?? null,
        privacyAgreed: form.privacyAgreed,
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (submitError) {
      if (submitError.code === 'auth/email-already-in-use') {
        setErrors(prev => ({ ...prev, email: 'That email is already in use.' }))
      } else if (submitError.code === 'auth/weak-password') {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters.' }))
      } else {
        setErrors(prev => ({ ...prev, submit: 'Could not create your account right now.' }))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const activeSteps = form.accountType === 'jobseeker'
    ? STEPS.filter(s => s.id !== 4)
    : STEPS

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Logo size={36} textSize="text-2xl" />
          <h2 className="text-2xl font-bold text-indigo-950 mt-4 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you, <strong>{form.fullName}</strong>! Your account is under review. We'll send a confirmation to <strong>{form.email}</strong> within 24–48 hours.
          </p>
          <button
            onClick={onSuccess}
            className="btn-primary w-full py-3 rounded-full text-white font-semibold text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Logo size={32} textSize="text-xl" />
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-violet-700 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-indigo-950">Account Creation & Identity Verification</h1>
            <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">
              Welcome to PARTimed! To ensure a safe and reliable community for both job seekers and local businesses in Naga City, we require a one-time identity verification.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8 animate-fade-in-up animate-delay-100">
            {activeSteps.map((s, idx) => {
              const isActive = s.id === step
              const isDone = step > s.id || (step === 5 && s.id < 5)
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${isActive ? 'step-active' : isDone ? 'step-done' : 'step-inactive'}`}>
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : idx + 1}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block ${isActive ? 'text-violet-700' : 'text-gray-400'}`}>
                      {s.title}
                    </span>
                  </div>
                  {idx < activeSteps.length - 1 && (
                    <div className={`h-0.5 w-8 sm:w-16 mx-1 mb-4 transition-all ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-8 animate-fade-in-up animate-delay-200">

            {/* STEP 1: Account Type */}
            {step === 1 && (
              <div>
                <StepHeader number={1} title="Account Type" subtitle="Please select how you'll use PARTimed." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {[
                    {
                      value: 'jobseeker',
                      title: 'Job Seeker',
                      desc: 'Student, part-time worker, or individual looking for extra income',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ),
                    },
                    {
                      value: 'employer',
                      title: 'Employer',
                      desc: 'Small business owner, entrepreneur, or hiring manager',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ),
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('accountType', opt.value)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${form.accountType === opt.value ? 'border-violet-600 bg-violet-50 shadow-sm' : 'border-gray-200 hover:border-violet-300 bg-white'}`}
                    >
                      <div className={`mb-3 ${form.accountType === opt.value ? 'text-violet-700' : 'text-gray-400'}`}>
                        {opt.icon}
                      </div>
                      <p className={`font-bold text-base ${form.accountType === opt.value ? 'text-violet-900' : 'text-indigo-950'}`}>{opt.title}</p>
                      <p className="text-gray-500 text-sm mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <FieldError error={errors.accountType} />
              </div>
            )}

            {/* STEP 2: Basic Info */}
            {step === 2 && (
              <div>
                <StepHeader number={2} title="Basic Information" subtitle="Please provide your personal details." />
                <div className="space-y-5 mt-6">
                  <FormField label="Full Name" note="As it appears on your legal ID" error={errors.fullName}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={e => update('fullName', e.target.value)}
                      placeholder="e.g. Juan dela Cruz"
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    />
                  </FormField>
                  <FormField label="Email Address" note="For account notifications and security" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    />
                  </FormField>
                  <FormField label="Password" note="Use at least 6 characters" error={errors.password}>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="Create a password"
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    />
                  </FormField>
                  <FormField label="Mobile Number" note="Required for real-time job alerts via SMS" error={errors.mobile}>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={e => update('mobile', e.target.value)}
                      placeholder="e.g. 09XX XXX XXXX"
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    />
                  </FormField>
                  <FormField label="Residential Address" note="Must be within Naga City or neighboring municipalities" error={errors.address}>
                    <textarea
                      value={form.address}
                      onChange={e => update('address', e.target.value)}
                      placeholder="Street, Barangay, City/Municipality"
                      rows={3}
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white resize-none"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* STEP 3: ID Verification */}
            {step === 3 && (
              <div>
                <StepHeader number={3} title="Identity Validation" subtitle="Secure & Confidential — to prevent fraudulent accounts and ensure you get paid securely." />
                <div className="space-y-5 mt-6">
                  <FormField label="Select ID Type" error={errors.idType}>
                    <select
                      value={form.idType}
                      onChange={e => update('idType', e.target.value)}
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    >
                      <option value="">-- Choose a valid ID --</option>
                      {form.accountType === 'jobseeker' && (
                        <option value="school_id">Valid School ID (Current Semester)</option>
                      )}
                      {ACCEPTED_IDS.filter(id => id !== 'Valid School ID (Current Semester)').map(id => (
                        <option key={id} value={id.toLowerCase().replace(/\s+/g, '_')}>{id}</option>
                      ))}
                    </select>
                  </FormField>

                  <UploadField
                    label="Front of ID"
                    note="Ensure all text and your photo are clearly visible."
                    value={form.idFrontFile}
                    onChange={f => update('idFrontFile', f)}
                    error={errors.idFrontFile}
                  />
                  <UploadField
                    label="Selfie with ID"
                    note="Hold your ID next to your face to confirm ownership."
                    value={form.idSelfieFile}
                    onChange={f => update('idSelfieFile', f)}
                    error={errors.idSelfieFile}
                  />

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-blue-700 text-xs font-semibold mb-1">Your data is secure</p>
                    <p className="text-blue-600 text-xs">
                      Your ID data is encrypted and used solely for account verification. We will never share your documents with third parties without your explicit consent.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Business Credentials (Employers only) */}
            {step === 4 && form.accountType === 'employer' && (
              <div>
                <StepHeader number={4} title="Business Credentials" subtitle="Employers only — help us verify your business." />
                <div className="space-y-5 mt-6">
                  <FormField label="Business Name" error={errors.businessName}>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={e => update('businessName', e.target.value)}
                      placeholder="e.g. Santos Bakery"
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    />
                  </FormField>
                  <FormField label="Nature of Business" note="e.g. Retail, Food Service, Construction, etc." error={errors.businessNature}>
                    <input
                      type="text"
                      value={form.businessNature}
                      onChange={e => update('businessNature', e.target.value)}
                      placeholder="e.g. Food Service"
                      className="input-field w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:bg-white"
                    />
                  </FormField>
                  <UploadField
                    label="Proof of Operation"
                    note="Upload DTI Permit, Mayor's Permit, or Barangay Business Clearance."
                    value={form.proofFile}
                    onChange={f => update('proofFile', f)}
                    error={errors.proofFile}
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Privacy & Submit */}
            {step === 5 && (
              <div>
                <StepHeader number={5} title="Privacy Agreement" subtitle="Almost done! Please review and accept our privacy policy." />

                <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3 text-sm text-gray-600">
                  <p className="font-semibold text-indigo-950">Summary of Your Application:</p>
                  <InfoRow label="Account Type" value={form.accountType === 'jobseeker' ? '👤 Job Seeker' : '🏢 Employer'} />
                  <InfoRow label="Full Name" value={form.fullName} />
                  <InfoRow label="Email" value={form.email} />
                  <InfoRow label="Mobile" value={form.mobile} />
                  <InfoRow label="Address" value={form.address} />
                  <InfoRow label="ID Type" value={form.idType || '—'} />
                  {form.accountType === 'employer' && (
                    <>
                      <InfoRow label="Business Name" value={form.businessName} />
                      <InfoRow label="Nature of Business" value={form.businessNature} />
                    </>
                  )}
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                  <p className="font-semibold mb-1">Note on Privacy</p>
                  <p>Your ID data is encrypted and used solely for account verification to maintain the integrity of the PARTimed platform. We will never share your personal documents with third parties without your explicit consent.</p>
                </div>

                <div className="mt-5 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={form.privacyAgreed}
                    onChange={e => update('privacyAgreed', e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-violet-700 cursor-pointer"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                    I have read and agree to the PARTimed Privacy Policy and Terms of Service. I understand my ID data will be encrypted and used only for account verification.
                  </label>
                </div>
                <FieldError error={errors.privacyAgreed} />
                <FieldError error={errors.submit} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 transition-all"
                >
                  ← Back
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex-1 py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary flex-1 py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : '✓ Submit for Verification'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Helper sub-components ---

function StepHeader({ number, title, subtitle }) {
  return (
    <div className="border-b border-gray-100 pb-4 mb-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">{number}</span>
        <h3 className="font-bold text-indigo-950 text-lg">{title}</h3>
      </div>
      {subtitle && <p className="text-gray-400 text-sm ml-8">{subtitle}</p>}
    </div>
  )
}

function FormField({ label, note, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-indigo-950 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-2">{note}</p>}
      {children}
      <FieldError error={error} />
    </div>
  )
}

function FieldError({ error }) {
  if (!error) return null
  return <p className="text-red-500 text-xs mt-1">{error}</p>
}

function UploadField({ label, note, value, onChange, error }) {
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onChange(file)
  }

  const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div>
      <label className="block text-sm font-semibold text-indigo-950 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-2">{note}</p>}
      <label
        htmlFor={inputId}
        className="upload-zone flex flex-col items-center justify-center rounded-xl p-5 cursor-pointer"
      >
        {value ? (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{value.name}</span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500 font-medium">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or PDF — max 10MB</p>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleChange}
        />
      </label>
      <FieldError error={error} />
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-400 text-xs min-w-[120px] shrink-0">{label}</span>
      <span className="text-gray-700 text-xs font-medium text-right break-all">{value || '—'}</span>
    </div>
  )
}
