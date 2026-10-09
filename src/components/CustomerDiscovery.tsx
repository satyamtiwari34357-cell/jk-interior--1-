import React, { useState } from "react";
import { ArrowRight, Check, MessageSquare, Phone } from "lucide-react";
import { PROCESS_STEPS, QUICK_PATHS, STYLE_QUIZ_OPTIONS } from "../data/customerExperience.ts";
import { trackEvent } from "../lib/analytics.ts";
import { phoneHref, usePublicSiteSettings, whatsappHref } from "../lib/publicSiteSettings.ts";

interface CustomerDiscoveryProps {
  onOpenConsultation: () => void;
}

function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export const QuickProjectPath: React.FC = () => (
  <section className="bg-ivory text-charcoal py-14 px-6 md:px-10">
    <div className="max-w-7xl mx-auto">
      <h2 className="font-serif text-3xl sm:text-4xl">What are you planning?</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-taupe">
        {QUICK_PATHS.map((path) => (
          <button
            key={path.service}
            type="button"
            onClick={() => navigate(`/services/${path.service}`)}
            className="min-h-16 border-b border-r border-taupe px-4 py-5 text-left font-serif text-xl hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <span>{path.label}</span>
            <ArrowRight className="ml-2 inline h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  </section>
);

export const StyleQuiz: React.FC<CustomerDiscoveryProps> = ({ onOpenConsultation }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const steps = [
    { title: "Which look do you like?", options: STYLE_QUIZ_OPTIONS.look },
    { title: "What space are you designing?", options: STYLE_QUIZ_OPTIONS.space },
    { title: "What matters most?", options: STYLE_QUIZ_OPTIONS.priority },
  ];
  const complete = step >= steps.length;
  const activeStep = steps[Math.min(step, steps.length - 1)];

  const choose = (answer: string) => {
    if (step === 0) trackEvent("style_quiz_started");
    const nextAnswers = [...answers];
    nextAnswers[step] = answer;
    setAnswers(nextAnswers);
    if (step === steps.length - 1) {
      setStep(steps.length);
      trackEvent("style_quiz_completed", { look: nextAnswers[0], space: nextAnswers[1] });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <section className="bg-ivory text-charcoal py-20 px-6 md:px-10">
      <div className="mx-auto max-w-5xl border-y border-taupe py-10">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta">A little inspiration</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Find Your Style</h2>
          <p className="mt-2 text-sm text-warm-grey">Choose what feels right. This is inspiration, not a professional design recommendation.</p>
        </div>
        {!complete ? (
          <div className="mt-8" aria-live="polite">
            <p className="font-serif text-xl" id="style-question">{activeStep.title}</p>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-labelledby="style-question">
              {activeStep.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  className="min-h-11 border border-taupe px-4 py-2 text-sm hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  {option}<ArrowRight className="ml-2 inline h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-warm-grey">Step {step + 1} of {steps.length}</p>
          </div>
        ) : (
          <div className="mt-8" aria-live="polite">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-terracotta"><Check className="h-4 w-4" /> Inspiration direction</p>
            <p className="mt-2 font-serif text-2xl">Your direction: {answers[0]} + {answers[1]}</p>
            <p className="mt-1 text-sm text-warm-grey">For a {answers[2].toLowerCase()}-focused {answers[1].toLowerCase()}.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate("/inspiration")} className="min-h-11 bg-terracotta px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white">Explore Inspiration</button>
              <button type="button" onClick={onOpenConsultation} className="min-h-11 border border-taupe px-5 py-3 text-xs font-semibold uppercase tracking-wider">Book a Consultation</button>
              <button type="button" onClick={() => { setAnswers([]); setStep(0); }} className="min-h-11 px-4 py-3 text-sm underline">Start again</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const WhyJK: React.FC = () => (
  <section className="bg-dark-800 px-6 py-16 text-ivory md:px-10">
    <div className="mx-auto max-w-7xl">
      <h2 className="font-serif text-3xl sm:text-4xl">Why JK Interior</h2>
      <p className="mt-3 max-w-2xl text-sm text-ivory-muted">A Mumbai interior design studio for residential and commercial spaces.</p>
      <div className="mt-8 grid grid-cols-2 gap-6 border-y border-white/15 py-7 md:grid-cols-5">
        {["20+ Years of Experience", "300+ Projects", "About 30-Person Team", "Residential + Commercial", "Mumbai"].map((fact) => (
          <p key={fact} className="font-serif text-lg sm:text-xl">{fact}</p>
        ))}
      </div>
    </div>
  </section>
);

export const ProcessSection: React.FC = () => (
  <section id="craftsmanship" className="scroll-mt-20 bg-obsidian px-6 py-20 text-ivory md:px-10">
    <div className="mx-auto max-w-7xl">
      <span className="text-xs uppercase tracking-[0.2em] text-terracotta">How we work</span>
      <h2 className="mt-2 font-serif text-3xl sm:text-4xl">A clear process, from first talk to handover.</h2>
      <div className="mt-8 grid grid-cols-1 gap-0 border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
        {PROCESS_STEPS.map((item) => (
          <article key={item.number} className="border-b border-r border-white/15 py-5 pr-5">
            <p className="text-sm text-terracotta">{item.number}</p>
            <h3 className="mt-2 font-serif text-xl">{item.title}</h3>
            <p className="mt-2 text-sm text-ivory-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const BeforeWeSpeak: React.FC<CustomerDiscoveryProps> = ({ onOpenConsultation }) => (
  <section className="bg-ivory px-6 py-16 text-charcoal md:px-10">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-taupe pt-8 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-terracotta">Before we speak</span>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">A few details can help us prepare.</h2>
        <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-warm-grey sm:grid-cols-2 lg:grid-cols-3">
          {["Property location", "Approximate carpet area", "Floor plan, if available", "Photos or videos of the space", "Preferred style", "Approximate budget", "Expected start date"].map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <button type="button" onClick={onOpenConsultation} className="min-h-11 shrink-0 bg-terracotta px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white">Book a Consultation</button>
    </div>
  </section>
);

export const BudgetGuidance: React.FC<CustomerDiscoveryProps> = ({ onOpenConsultation }) => (
  <section id="estimator" className="scroll-mt-20 bg-ink-soft px-6 py-16 text-ivory md:px-10">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 border-y border-white/15 py-8 md:flex-row md:items-center md:justify-between">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-terracotta">Budget guidance</span>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Not sure about your budget?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ivory-muted">Your interior cost depends on the size, design, materials, furniture and scope of work. Share your requirements and our team can understand your project.</p>
      </div>
      <button type="button" onClick={onOpenConsultation} className="min-h-11 shrink-0 bg-terracotta px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white">Discuss My Project</button>
    </div>
  </section>
);

export const MobileContactBar: React.FC<CustomerDiscoveryProps> = ({ onOpenConsultation }) => {
  const settings = usePublicSiteSettings();
  const callUrl = phoneHref(settings.phone);
  const whatsappUrl = whatsappHref(settings.whatsapp, "Hello JK Interior, I would like to discuss my interior project.");

  if (!callUrl && !whatsappUrl) return null;

  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-taupe bg-ivory px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-charcoal shadow-2xl md:hidden">
      {callUrl && <a href={callUrl} onClick={() => trackEvent("phone_clicked")} className="flex min-h-11 items-center justify-center gap-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"><Phone className="h-4 w-4" />Call</a>}
      {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_clicked", { source: "mobile_bar" })} className="flex min-h-11 items-center justify-center gap-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"><MessageSquare className="h-4 w-4" />WhatsApp</a>}
      <button type="button" onClick={onOpenConsultation} className="min-h-11 bg-terracotta text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta">Enquire</button>
    </nav>
  );
};
