import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

function ContactPage({ onNavigate, user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Navbar currentPath="/contact" onNavigate={onNavigate} user={user} onLogout={onLogout} />

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.75)]">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            Contact
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Get in touch for product feedback, partnership ideas, or support.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            This page can be connected to your email, contact form, or CRM later. For now it acts as a polished landing point for the contact section.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-950">Email</p>
              <p className="mt-2">hello@researchdesk.com</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-950">Support</p>
              <p className="mt-2">Research workflow and account help</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-950">Partnerships</p>
              <p className="mt-2">Data, advisory, and platform integrations</p>
            </div>
          </div>
        </section>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export default ContactPage;
