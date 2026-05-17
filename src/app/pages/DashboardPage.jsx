import { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, getDoc, doc } from 'firebase/firestore'
import Logo from '../../components/Logo.jsx'
import { db } from '../../lib/firebase.js'

const SAMPLE_JOBS = [
  { id: 1, title: 'Barista / Cashier', company: 'Café de Naga', location: 'Magsaysay Ave, Naga City', pay: '₱500/day', type: 'Food & Beverage', schedule: 'Weekends', posted: '2 hours ago', tags: ['Part-time', 'No Experience'], logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-cdn.9gag.com%2Fphoto%2FaR00XBA_700b.jpg&f=1&nofb=1&ipt=a2828cdb9ffa87f389900c493671524024c47c97664bd4893b181f024d9694ab' },
  { id: 2, title: 'Sales Associate', company: 'SM City Naga', location: 'Panganiban, Naga City', pay: '₱450/day', type: 'Retail', schedule: 'Flexible', posted: '5 hours ago', tags: ['Part-time', 'Commission'], logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nagacityguide.com%2Fwordpress%2Fwp-content%2Fuploads%2F2016%2F05%2F398319_367966473247391_703545245_n.jpg&f=1&nofb=1&ipt=87c2832a83e16402d2134f0762bd2b76c538b9e88e9d743ba8f6d977583aa685' },
  { id: 3, title: 'Data Encoder', company: 'Bicolandia BPO', location: 'Triangulo, Naga City', pay: '₱400/day', type: 'Office / Admin', schedule: 'Mon–Fri (AM shift)', posted: '1 day ago', tags: ['Part-time', 'WFH option'], logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.-QmSsMfcDgDXW9hfB-Sq2AAAAA%3Fpid%3DApi&f=1&ipt=a37a705cb9a32ad9d11f9c96fc3abcbe416525be5c6af982bee61753ae7e8da5' },
  { id: 4, title: 'Food Delivery Rider', company: 'FoodPanda', location: 'Naga City (roving)', pay: '₱600/day + tips', type: 'Delivery', schedule: 'Flexible', posted: '1 day ago', tags: ['Part-time', 'With motorcycle'], logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.coconuts.co%2Fcoconuts%2Fwp-content%2Fuploads%2F2016%2F11%2F1_vhong.jpg&f=1&nofb=1&ipt=2fa2826842c8ced6a07f9d664234615fede5e117d169ef3eebfcb6ce318f8e8e'},
  { id: 5, title: 'Event Staff / Usher', company: 'Naga Events Hub', location: 'Various venues, Naga City', pay: '₱550/event', type: 'Events', schedule: 'Weekends', posted: '2 days ago', tags: ['Part-time', 'Casual'], logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww2.naga.gov.ph%2Fwp-content%2Fuploads%2F2022%2F05%2Fika-ako-kita-naga-1536x1536.png&f=1&nofb=1&ipt=3717e13391b9d3dac4e98968c224661d357501f63a7ac724e236b3eb67e947ee'},
  { id: 6, title: 'Online Tutor (Math/Science)', company: 'StudyBuddy PH', location: 'Remote', pay: '₱300/hr', type: 'Education', schedule: 'Flexible', posted: '3 days ago', tags: ['Part-time', 'Remote', 'College students'], logo: 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/669565571_1557188709744637_6114279130776364363_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFPyGDiceRQbicHCWIiv4lUL03-exvkoLovTf57G-SguvsJTk_VDHl0eV6ruos-F6nZ8srEoko3IHFtfgfftJHi&_nc_ohc=BRrMpomN8E0Q7kNvwEdzXxa&_nc_oc=AdofZ7ToDMr61VCW-0soqti434V8fK3i7cmd58QG6rWUd2zRaIGMqs9-Izh47JY9cZM&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=Ksa6_QUTuTXDnd6LwjiEWQ&_nc_ss=7b2a8&oh=00_Af2umUYdTVAp3cmOzrgYFwoV1Rj5HNMoxEXFiViyHu67Cw&oe=69F91393' },
];

const EMPLOYER_APPLICANTS = [
  { id: 1, name: 'Christian Josef Ace', role: 'Barista / Cashier', status: 'New', avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.W1CewKcwPGmaoOT7tPaZCgHaHk%3Fpid%3DApi&f=1&ipt=f6ec4e18e5398e21759c2bfab0ba70beaf8493fa1181fca8c2fd38b91e07dccc', date: 'Today' },
  { id: 2, name: 'Luigi Lames Josa', role: 'Sales Associate', status: 'Reviewed', avatar: 'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-1/442479206_25524224803887633_653630418968899630_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHYCVQEowSTvbSMB4v79B7avT_EItIfaE29P8Qi0h9oTX2cVAHPuYvxMmVisBsazuZqy3qU0bUoBwHuI7chLiTy&_nc_ohc=GhZnptQgB5UQ7kNvwHLi8Re&_nc_oc=AdoF9PRmncLRfQfAObd9X-sdc7htYTIPbLPAEM5aF3EObjF-n_uqUxiiNDJIw7o5k5U&_nc_zt=24&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=6R4ilvfpndaa7wiAJc_guA&_nc_ss=7b2a8&oh=00_Af2Nu75XhyJNJQL5kAAA8A0I7TEHDAd_zVW7YzvSl6fB4g&oe=69F8ED8C', date: 'Yesterday' },
  { id: 3, name: 'Sir Dominic of Libmanan', role: 'Data Encoder', status: 'Interview', avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Fsad-bart-simpsons-vector-art-20zh2qckgympc6fy.jpg&f=1&nofb=1&ipt=000f454e90fadd355444e9b7c34718e6c0fd61ac5f9b878c4411419b980ee7d0', date: '2 days ago' },
]

const NAV_ITEMS_JOBSEEKER = [
  { id: 'browse', label: 'Browse Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { id: 'applied', label: 'My Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

const NAV_ITEMS_EMPLOYER = [
  { id: 'post', label: 'Post a Job', icon: 'M12 4v16m8-8H4' },
  { id: 'applicants', label: 'Applicants', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'profile', label: 'Company Profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
]

const TYPE_COLORS = {
  'Food & Beverage': 'bg-orange-100 text-orange-700',
  'Retail': 'bg-blue-100 text-blue-700',
  'Office / Admin': 'bg-purple-100 text-purple-700',
  'Delivery': 'bg-green-100 text-green-700',
  'Events': 'bg-pink-100 text-pink-700',
  'Education': 'bg-yellow-100 text-yellow-700',
}

export default function DashboardPage({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState(user?.type === 'employer' ? 'applicants' : 'browse')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState([])
  const [search, setSearch] = useState('')
  const [liveJobs, setLiveJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [posting, setPosting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [postSuccess, setPostSuccess] = useState('')
  const [postError, setPostError] = useState('')
  const [jobForm, setJobForm] = useState({
    title: '',
    pay: '',
    schedule: '',
    location: '',
    description: '',
    imageUrl: '',
  })
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [loadingApplicant, setLoadingApplicant] = useState(false)

  useEffect(() => {
    if (user?.type === 'employer' && activeNav === 'browse') {
      setActiveNav('applicants')
    } else if (user?.type === 'jobseeker' && activeNav === 'applicants') {
      setActiveNav('browse')
    }
  }, [user?.type])

  useEffect(() => {
    if (!user?.uid) return

    const isEmployer = user?.type === 'employer'
    const jobsQuery = isEmployer
      ? query(collection(db, 'jobs'), 
          where('employerUid', '==', user.uid),
          orderBy('createdAt', 'desc'))
      : query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(jobsQuery, (snapshot) => {
      setLiveJobs(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      )
    })

    return unsubscribe
  }, [user?.uid, user?.type])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'applications'), (snapshot) => {
      setApplications(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      )
    })

    return unsubscribe
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6ff] text-gray-600">
        Signing out...
      </div>
    )
  }

  const isEmployer = user?.type === 'employer'
  const navItems = isEmployer ? NAV_ITEMS_EMPLOYER : NAV_ITEMS_JOBSEEKER
  const userApplications = applications.filter(app => app.applicantUid === user.uid)
  const appliedJobIds = new Set([
    ...appliedJobs,
    ...userApplications.map(app => app.jobId),
  ])

  const allJobs = [
    ...liveJobs.map(job => ({
      id: String(job.id),
      title: job.title || 'Untitled Job',
      company: job.employerName || 'Employer',
      location: job.location || '',
      pay: job.pay || '',
      type: job.jobCategory || 'Hiring',
      schedule: job.schedule || '',
      posted: 'Just now',
      tags: ['Part-time'],
      logo: job.imageUrl || 'https://via.placeholder.com/80?text=Job',
      description: job.description || '',
      employerUid: job.employerUid,
    })),
    ...SAMPLE_JOBS.map(s => ({ ...s, id: String(s.id) })),
  ]

  const filteredJobs = allJobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.type.toLowerCase().includes(search.toLowerCase())
  )

  const employerJobs = liveJobs.filter(job => job.employerUid === user.uid)
  const employerApplicants = applications.filter(app => app.employerUid === user.uid)
  const employerApplicantsSorted = employerApplicants.slice().sort((a, b) => {
    const ta = a?.createdAt?.toMillis ? a.createdAt.toMillis() : (a?.createdAt || 0)
    const tb = b?.createdAt?.toMillis ? b.createdAt.toMillis() : (b?.createdAt || 0)
    return tb - ta
  })

  const updateJobForm = (field, value) => {
    setJobForm(prev => ({ ...prev, [field]: value }))
    setPostError('')
    setPostSuccess('')
  }

  const fetchAndOpenApplicant = async (app) => {
    setLoadingApplicant(true)
    try {
      const uid = app.applicantUid || app.applicantId || app.applicant || null
      let profile = {}
      if (uid) {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) profile = userDoc.data()
      }
      setSelectedApplicant({ ...app, ...profile })
    } catch (err) {
      console.error('Failed to fetch applicant profile', err)
      setSelectedApplicant(app)
    } finally {
      setLoadingApplicant(false)
    }
  }

  const handleJobImageChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    setPostError('')
    setPostSuccess('')
    setUploadingImage(true)

    if (!cloudName || !uploadPreset) {
      setUploadingImage(false)
      setPostError('Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local first.')
      event.target.value = ''
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'partimed/jobs')

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error?.message || 'Image upload failed.')
      }

      setJobForm(prev => ({
        ...prev,
        imageUrl: result.secure_url,
      }))
    } catch {
      setJobForm(prev => ({
        ...prev,
        imageUrl: '',
      }))
      setPostError(error?.message || 'Could not upload the image.')
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const handleApply = async (job) => {
    const jobId = String(job.id)
    if (appliedJobIds.has(jobId)) return

    setAppliedJobs(prev => [...prev, jobId])

    try {
      await addDoc(collection(db, 'applications'), {
        jobId,
        jobTitle: job.title,
        company: job.company,
        employerUid: job.employerUid || null,
        applicantUid: user.uid,
        applicantName: user.name || 'Applicant',
        applicantEmail: user.email || '',
        status: 'New',
        createdAt: serverTimestamp(),
      })
    } catch {
      setAppliedJobs(prev => prev.filter(id => id !== job.id))
    }
  }

  const handlePostJob = async () => {
    if (!jobForm.title.trim() || !jobForm.pay.trim() || !jobForm.schedule.trim() || !jobForm.location.trim() || !jobForm.description.trim()) {
      setPostError('Please complete all job fields before posting.')
      return
    }

    setPosting(true)
    setPostError('')
    setPostSuccess('')

    try {
      await addDoc(collection(db, 'jobs'), {
        title: jobForm.title.trim(),
        pay: jobForm.pay.trim(),
        schedule: jobForm.schedule.trim(),
        location: jobForm.location.trim(),
        description: jobForm.description.trim(),
        imageUrl: jobForm.imageUrl || '',
        employerUid: user.uid,
        employerName: user.name || 'Employer',
        employerEmail: user.email || '',
        status: 'open',
        createdAt: serverTimestamp(),
      })

      setJobForm({
        title: '',
        pay: '',
        schedule: '',
        location: '',
        description: '',
        imageUrl: '',
      })
      setPostSuccess('Hiring posted successfully.')
    } catch {
      setPostError(error?.message || 'Could not post the job right now.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f6ff] via-[#f3f0ff] to-[#f8f7ff] flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur border-r border-violet-100 z-30 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-violet-100">
          <Logo size={32} textSize="text-xl" />
        </div>

        {/* User info */}
        <div className="p-4 mx-3 my-3 bg-violet-50 border border-violet-100 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {((user?.name ?? 'User').split(' ').map(n => n[0]).join('').slice(0,2))}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-indigo-950 text-sm truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-violet-600 capitalize">{user?.type ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
              className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left ${activeNav === item.id ? 'active' : 'text-gray-600'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-violet-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur border-b border-violet-100 px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-extrabold tracking-tight text-indigo-950 text-xl">
              {activeNav === 'browse' && 'Browse Jobs'}
              {activeNav === 'applied' && 'My Applications'}
              {activeNav === 'profile' && 'My Profile'}
              {activeNav === 'post' && 'Post a Job'}
              {activeNav === 'applicants' && 'Applicants'}
            </h1>
          </div>
          <div className="text-xs text-violet-600 hidden sm:block font-semibold">Naga City, PH</div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">

          {/* BROWSE JOBS */}
          {activeNav === 'browse' && (
            <div className="animate-fade-in-up">
              {/* Search */}
              <div className="relative mb-6 max-w-lg">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field w-full pl-9 pr-4 py-3 border border-violet-100 rounded-xl text-sm bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-5 flex flex-col gap-3 hover:shadow-[0_12px_32px_rgba(84,23,215,0.14)] transition-shadow">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2"> 
                          <img 
                            src={job.logo} 
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0" 
                          />
                          <div>
                            <p className="font-semibold text-sm text-indigo-950">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.company}</p>
                          </div>
                        </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-600'}`}>
                        {job.type}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.schedule}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                      <span className="font-extrabold text-violet-700 text-sm">{job.pay}</span>
                      <span className="text-xs text-gray-400">{job.posted}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full border border-violet-100">{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedJob(job)}
                      disabled={appliedJobIds.has(job.id)}
                      className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                        appliedJobIds.has(job.id)
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'btn-primary text-white'
                      }`}
                    >
                      {appliedJobIds.has(job.id) ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                ))}
                {filteredJobs.length === 0 && (
                  <div className="col-span-full text-center py-16 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="font-medium">No jobs found for "{search}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MY APPLICATIONS */}
          {activeNav === 'applied' && (
            <div className="animate-fade-in-up max-w-2xl">
              {userApplications.length === 0 ? (
                  <div className="bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-12 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium">No applications yet</p>
                  <p className="text-sm mt-1">Browse jobs and hit Apply Now to get started!</p>
                  <button onClick={() => setActiveNav('browse')} className="btn-primary mt-4 px-6 py-2 rounded-xl text-white text-sm font-semibold">
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userApplications.map(app => {
                    const job = allJobs.find(j => String(j.id) === String(app.jobId))
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedJob(job || { id: app.jobId, title: app.jobTitle, company: app.company, description: app.description || 'No description available.' })}
                        className="bg-white cursor-pointer hover:shadow-md border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.04)] p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-violet-50 flex items-center justify-center text-violet-700 font-bold text-xs">
                            {app.company ? app.company.slice(0, 2).toUpperCase() : 'JB'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-indigo-950 text-sm truncate">{app.jobTitle || 'Hiring'}</p>
                            <p className="text-xs text-gray-500 truncate">{app.company || 'Employer'} · {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Recently applied'}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium flex-shrink-0">{app.status || 'Under Review'}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Job detail modal for selected application */}
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedJob(null)} />
              <div className="relative z-10 max-w-2xl w-full p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-extrabold text-lg text-indigo-950">{selectedJob.title}</h2>
                    <p className="text-sm text-gray-500">{selectedJob.company}</p>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700">Close</button>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  <p>{selectedJob.description || 'No description available.'}</p>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-violet-700">{selectedJob.pay || ''}</span>
                </div>
              </div>
            </div>
          )}

          {/* APPLICANTS (employer) */}
          {activeNav === 'applicants' && (
            <div className="animate-fade-in-up max-w-2xl">
              {employerApplicants.length === 0 ? (
                <div className="bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-8 text-center text-gray-500">
                  No applicants yet. Once someone applies, they will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {employerApplicantsSorted.map(app => (
                    <button
                      key={app.id}
                      onClick={() => fetchAndOpenApplicant(app)}
                      className="w-full text-left bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                        <span>{(app.applicantName || 'A').split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-indigo-950 text-sm">{app.applicantName || 'Applicant'}</p>
                        <p className="text-xs text-gray-500">Applied for: {app.jobTitle || 'Hiring'} · {app.applicantEmail || ''}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                        app.status === 'New' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {app.status || 'New'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* POST A JOB (employer) */}
          {activeNav === 'post' && (
            <div className="animate-fade-in-up max-w-xl">
              <div className="bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-6 space-y-4">
                <h2 className="font-extrabold tracking-tight text-indigo-950 text-xl">Post a New Job</h2>
                {[
                  { label: 'Job Title', key: 'title', placeholder: 'e.g. Barista, Sales Associate' },
                  { label: 'Pay / Rate', key: 'pay', placeholder: 'e.g. ₱500/day' },
                  { label: 'Schedule', key: 'schedule', placeholder: 'e.g. Weekends, Flexible' },
                  { label: 'Location', key: 'location', placeholder: 'e.g. Magsaysay Ave, Naga City' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-indigo-950 mb-1">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={jobForm[f.key]}
                      onChange={e => updateJobForm(f.key, e.target.value)}
                      className="input-field w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-indigo-950 mb-1">Job Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the role, requirements, and responsibilities..."
                    value={jobForm.description}
                    onChange={e => updateJobForm('description', e.target.value)}
                    className="input-field w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-950 mb-1">Job Image</label>
                  <div className="rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 p-4 space-y-3">
                    {jobForm.imageUrl ? (
                      <img src={jobForm.imageUrl} alt="Job preview" className="w-full h-40 object-cover rounded-xl border border-violet-100" />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-sm text-gray-500 rounded-xl bg-white border border-gray-100">
                        No image uploaded yet.
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleJobImageChange}
                      className="block w-full text-sm text-gray-600"
                    />
                    <p className="text-xs text-gray-500">Upload a hiring poster or image. It will be stored in Cloudinary and shown to applicants.</p>
                    {uploadingImage && <p className="text-xs font-medium text-violet-600">Uploading image...</p>}
                  </div>
                </div>
                {postError && <p className="text-sm text-red-500">{postError}</p>}
                {postSuccess && <p className="text-sm text-green-600">{postSuccess}</p>}
                <button
                  onClick={handlePostJob}
                  disabled={posting || uploadingImage}
                  className="btn-primary w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-70"
                >
                  {posting ? 'Posting...' : uploadingImage ? 'Uploading image...' : 'Post Job'}
                </button>
              </div>

              <div className="mt-4 bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-5">
                <h3 className="font-bold text-indigo-950 mb-3">Your recent postings</h3>
                {/* DEBUG: show current user uid and employerUid on jobs to help trace issues */}
                <div className="mb-3 text-xs text-gray-400">
                  <div>Current user uid: <span className="font-mono text-[11px] text-violet-700">{user?.uid || 'n/a'}</span></div>
                </div>
                {employerJobs.length === 0 ? (
                  <p className="text-sm text-gray-500">No hirings posted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {employerJobs.map(job => (
                      <div key={job.id} className="rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                        <img src={job.imageUrl || 'https://via.placeholder.com/64?text=Job'} alt={job.title} className="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-indigo-950 truncate">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.location} · {job.pay}</p>
                          <p className="text-xs text-gray-400 mt-1">job.id: <span className="font-mono">{job.id}</span> • employerUid: <span className="font-mono">{job.employerUid || 'null'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeNav === 'profile' && (
            <div className="animate-fade-in-up max-w-md">
              <div className="bg-white border border-violet-100 rounded-2xl shadow-[0_8px_24px_rgba(84,23,215,0.08)] p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <h2 className="font-bold text-indigo-950 text-lg">{user.name}</h2>
                <p className="text-violet-600 text-sm capitalize mb-1">{user.type}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs">
                  Profile editing coming soon!
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Job detail modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedJob(null)} />
          <div className="relative z-10 max-w-2xl w-full p-6 bg-white rounded-2xl shadow-lg mx-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-lg text-indigo-950">{selectedJob.title}</h2>
                <p className="text-sm text-gray-500">{selectedJob.company}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="mt-4 text-sm text-gray-700 space-y-3">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Description</p>
                <p>{selectedJob.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Schedule</p>
                  <p className="font-medium">{selectedJob.schedule}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pay</p>
                  <p className="font-medium text-violet-700">{selectedJob.pay}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={() => setSelectedJob(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { handleApply(selectedJob); setSelectedJob(null); }} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">Apply Now</button>
            </div>
          </div>
        </div>
      )}
      {/* Applicant detail modal (employer) */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedApplicant(null)} />
          <div className="relative z-10 max-w-lg w-full p-6 bg-white rounded-2xl shadow-lg mx-4">
            {loadingApplicant ? (
              <div className="flex items-center justify-center p-8">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-violet-50 border border-gray-100 flex items-center justify-center">
                      {selectedApplicant.photoURL || selectedApplicant.avatar ? (
                        <img src={selectedApplicant.photoURL || selectedApplicant.avatar} alt={selectedApplicant.applicantName || 'Applicant'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-violet-700 font-bold">{(selectedApplicant.applicantName || 'A').split(' ').map(n => n[0]).join('').slice(0,2)}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-lg text-indigo-950">{selectedApplicant.applicantName || 'Applicant'}</h2>
                      <p className="text-sm text-gray-500">{selectedApplicant.applicantEmail || ''}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedApplicant(null)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
                </div>

                <div className="mt-4 text-sm text-gray-700 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Applied for</p>
                      <p className="font-medium">{selectedApplicant.jobTitle || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Applied at</p>
                      <p className="font-medium">{selectedApplicant.createdAt?.toDate ? selectedApplicant.createdAt.toDate().toLocaleString() : String(selectedApplicant.createdAt || '')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Message</p>
                    <p className="font-medium text-sm">{selectedApplicant.message || 'No message provided.'}</p>
                  </div>

                  {selectedApplicant.phone && (
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium"><a href={`tel:${selectedApplicant.phone}`} className="text-violet-700">{selectedApplicant.phone}</a></p>
                    </div>
                  )}

                  {selectedApplicant.bio && (
                    <div>
                      <p className="text-xs text-gray-500">About</p>
                      <p className="font-medium text-sm">{selectedApplicant.bio}</p>
                    </div>
                  )}

                  {selectedApplicant.resumeUrl && (
                    <div>
                      <p className="text-xs text-gray-500">Resume</p>
                      <p className="font-medium"><a href={selectedApplicant.resumeUrl} target="_blank" rel="noreferrer" className="text-violet-700">View resume</a></p>
                    </div>
                  )}

                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <a href={`mailto:${selectedApplicant.applicantEmail || ''}`} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Email</a>
                  <button onClick={() => setSelectedApplicant(null)} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
