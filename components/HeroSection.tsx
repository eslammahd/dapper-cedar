export default function HeroSection() {
  return (
    <header className="bg-teal-700 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-teal-500 flex items-center justify-center text-5xl font-bold shadow-lg">
            S
          </div>
        </div>
        <div>
          <p className="text-teal-200 text-sm font-medium uppercase tracking-widest mb-1">Psychiatrist & Psychotherapist</p>
          <h1 className="text-4xl font-bold mb-3">Dr. Saad El Mahdy</h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-xl">
            Offering individual therapy sessions in a safe, confidential environment.
            Book your slot below — no account needed.
          </p>
          <a
            href="#slots"
            className="mt-6 inline-block bg-white text-teal-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-teal-50 transition"
          >
            View Available Slots →
          </a>
        </div>
      </div>
    </header>
  );
}
