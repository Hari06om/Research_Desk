function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.75)]">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">404 / Page not found</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">That page does not exist.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">Return to the research workspace to continue.</p>
      </div>
    </div>
  );
}

export default NotFoundPage;
