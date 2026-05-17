import { Header } from './components/Header';
import { JobPost } from './components/Post';
import { Sidebar } from './components/Sidebar';
import './App.css'

export default function Hi(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto flex max-w-screen-2xl items-start justify-start gap-6 p-6">
        <div className="sticky top-24 hidden shrink-0 lg:block w-80"><Sidebar /></div>
        <section className="flex-1 max-w-4xl space-y-6">
        <JobPost 
          company="Ace Hardware"
          companyLogo='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F1000logos.net%2Fwp-content%2Fuploads%2F2021%2F05%2FACE-Hardware-logo.png&f=1&nofb=1&ipt=e201e27293527bde24453b33dc1b78cf9ca681e479d14af79061589151df9aa8 '
          jobTitle="Construction Worker"
          location="Naga, Camarines Sur"
          jobType="Part-time"
          salary="₱10,000 - ₱20,000"
          description="We are looking for a person who is passionate in hard labor, preferably someone with a strong build."
          postedTime="12h ago"
          applicants={12456}
          saves={234}
        />
        <JobPost 
          company="Tree Society"
          companyLogo='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D122150661794796607&f=1&nofb=1&ipt=476d69f9a9eb70530c8614d6585b2749e1e53b5d287ac1192189e110486d81c5'
          jobTitle="Banana Farmer"
          location="Baao, Camarines Sur"
          jobType="Full-time"
          salary="₱40,000 - ₱50,000"
          description="We want to hire people who love bananas."
          postedTime="1h ago"
          applicants={21}
          saves={5}
        />
        <JobPost 
          company="Chris' Pizza"
          companyLogo='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fcp-logo-design_1172241-6549.jpg&f=1&nofb=1&ipt=395d641d908a6780dfdcb3191cf17c156ddbdba54ae1819d0ddad5adfc60ad43'
          jobTitle="Waiter"
          location="Pamplona, Camarines Sur"
          jobType="Full-time"
          salary="₱67,000 - medyo"
          description="Hello fellow CP lovers! If you enjoy pizza, then you can now work in CP as a waiter. PM us your details and we'll help you out."
          postedTime="6h ago"
          applicants={777}
          saves={89}
        />
        </section>
        <div className="hidden xl:block w-72 shrink-0" />
      </main>
    </div>  
  );
}