import React, { useEffect, useState } from "react";
import { Quote } from "lucide-react";

type TestimonialRecord = {
  id: string;
  clientName: string;
  quote: string;
  projectName?: string | null;
  role?: string | null;
  image?: string | null;
};

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {
        setTestimonials([]);
      });
  }, []);

  if (testimonials.length === 0) {
    return (
      <section className="py-24 px-6 md:px-10 bg-ink-soft border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-500 block mb-2 font-medium">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-ivory-soft font-light">
              Client testimonials will be published here once approved.
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 md:px-10 bg-ink-soft border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-500 block mb-2 font-medium">
            Client Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-ivory-soft font-light">
            What clients say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-xl bg-graphite border border-white/5 flex flex-col justify-between space-y-6 hover:border-gold-500/30 transition-colors"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-gold-500/40" />
                <p className="text-sm font-serif italic text-[#ded9cf] leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                {t.image && (
                  <img
                    src={t.image}
                    alt={t.clientName}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                )}
                <div>
                  <h4 className="text-sm font-serif text-ivory-soft font-medium">
                    {t.clientName}
                  </h4>
                  <span className="text-[11px] text-stone-700 block">
                    {t.projectName || t.role || "Client"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
