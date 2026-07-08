import Navbar from '../components/Navbar.jsx';

function ContactPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Navbar currentPath="/contact" onNavigate={onNavigate} />

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Contact
          </div>
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Get in touch for product feedback, partnership ideas, or support.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            This page can be connected to your email, contact form, or CRM later. For now it acts as a polished landing point for the contact section.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300">
            <p className="font-semibold text-white">Email</p>
            <p className="mt-2">hello@researchdesk.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
