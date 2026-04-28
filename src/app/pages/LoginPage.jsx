import { useState } from 'react'
import Logo from '../../components/Logo.jsx'

// Demo credentials for testing
const DEMO_USERS = [
  { email: 'jobseeker@parttimed.ph', password: 'password123', name: 'Juan dela Cruz', type: 'jobseeker' },
  { email: 'employer@parttimed.ph', password: 'password123', name: 'Maria Santos', type: 'employer' },
]

export default function LoginPage({ onLogin, onRegister }) {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const user = DEMO_USERS.find(
        u => u.email === form.email && u.password === form.password
      )
      if (user) {
        onLogin(user)
      } else {
        setError('Invalid email or password. Try: jobseeker@parttimed.ph / password123')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col lg:flex-row">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl"></div>
        <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl"></div>
      </div>
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4b17bf] via-[#5417D7] to-[#3b0ca8] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 -left-24 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full"></div>
        </div>

        <Logo textSize="text-3xl" color="text-white" size={48} />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Find Part-Time Jobs<br />in Naga City
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Connecting local businesses with talented part-time workers across Naga City and neighboring municipalities.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: 'Active Jobs' },
              { value: '1,200+', label: 'Job Seekers' },
              { value: '150+', label: 'Employers' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-sm relative z-10">
          © 2025 PARTimed. Proudly serving Naga City.
        </p>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo size={36} textSize="text-2xl" />
        </div>

        <div className="w-full max-w-md animate-fade-in-up">
            <div className="bg-white rounded-2xl p-8 sm:p-9 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-indigo-950 mb-1">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Sign in to your PARTimed account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                  <label className="block text-sm font-semibold text-indigo-950 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input-field w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-indigo-950">Password</label>
                  <a href="#" className="text-xs text-violet-700 font-semibold hover:text-violet-900 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input-field w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full text-sm text-gray-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 accent-violet-700 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={onRegister}
                  className="text-violet-700 font-semibold hover:underline"
                >
                  Create an Account
                </button>
              </p>
            </div>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs text-center">
            <strong>Demo:</strong> jobseeker@parttimed.ph / password123
          </div>
        </div>
      </div>
    </div>
  )
}
