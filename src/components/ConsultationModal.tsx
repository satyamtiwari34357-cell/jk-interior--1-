import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  Home,
  ChevronRight,
  ChevronLeft,
  Edit2,
} from "lucide-react";
import { trackEvent } from "../lib/analytics.ts";
import { usePublicSiteSettings, whatsappHref } from "../lib/publicSiteSettings.ts";
import { CONSULTATION_OPTIONS } from "../data/customerExperience.ts";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    projectName?: string;
    propertyType?: string;
    carpetArea?: string;
    tier?: string;
    budget?: string;
    timeline?: string;
    materials?: string[];
  };
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefillData,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const stepLabels = ["About You", "Your Space", "Requirements", "Contact", "Review"] as const;
  const settings = usePublicSiteSettings();
  const successWhatsApp = whatsappHref(settings.whatsapp, "Hello JK Interior, I would like to discuss my interior project.");

  const [formData, setFormData] = useState({
    // Step 1: About You
    name: "",
    customerType: "Homeowner",

    // Step 2: Your Space
    projectType: "Residential Interior",
    propertyType: "Apartment",
    location: "",
    carpetAreaRange: "Not sure",
    carpetAreaSqFt: "",
    bhk: "3 BHK",
    projectStatus: "Ready Property",

    // Step 3: Your Requirement
    requirements: [] as string[],
    budgetRange: "Not decided yet",
    timeline: "Just exploring",

    // Step 4: Contact Details
    phone: "",
    whatsapp: "",
    email: "",
    preferredContactMethod: "Phone Call",
    message: "",

    // Anti-spam trap
    website_url_trap: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      trackEvent("consultation_started");
      setCurrentStep(1);
      setSubmitted(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        projectType: prefillData.projectName
          ? `Inquiry for ${prefillData.projectName}`
          : prev.projectType,
        propertyType: prefillData.propertyType || prev.propertyType,
        carpetAreaRange: prefillData.carpetArea || prev.carpetAreaRange,
        budgetRange: prefillData.budget || prev.budgetRange,
        message: prefillData.projectName
          ? `Inquiring regarding aesthetic and scope similar to: ${prefillData.projectName}`
          : prefillData.materials && prefillData.materials.length > 0
            ? `Selected Material Atelier Swatches: ${prefillData.materials.join(", ")}`
            : prev.message,
      }));
    }
  }, [prefillData]);

  if (!isOpen) return null;

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStepError(null);

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setStepError("Enter your name to continue.");
        return;
      }
      trackEvent("consultation_step_completed", { step: 1 });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.location.trim()) {
        setStepError("Enter the city or area of your property.");
        return;
      }
      trackEvent("consultation_step_completed", { step: 2 });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      trackEvent("consultation_step_completed", { step: 3 });
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!formData.phone.trim()) {
        setStepError("Enter a phone number so our team can contact you.");
        return;
      }
      trackEvent("consultation_step_completed", { step: 4 });
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const toggleRequirement = (req: string) => {
    setFormData((prev) => {
      const exists = prev.requirements.includes(req);
      if (exists) {
        return {
          ...prev,
          requirements: prev.requirements.filter((r) => r !== req),
        };
      } else {
        return { ...prev, requirements: [...prev.requirements, req] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.join(", "),
        carpetAreaSqFt: formData.carpetAreaSqFt
          ? parseInt(formData.carpetAreaSqFt, 10)
          : undefined,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
        trackEvent("consultation_completed");
      } else {
        setErrorMsg(
          json.message ||
            "Validation error. Please verify your contact information.",
        );
        trackEvent("consultation_form_failed");
      }
    } catch (err) {
      console.warn("Network issue submitting lead:", err);
      setErrorMsg(
        "We could not confirm your request was received. Please try again.",
      );
      trackEvent("consultation_form_failed");
    } finally {
      setLoading(false);
    }
  };

  const isResidential = [
    "Residential Interior",
    "Luxury Home",
    "Apartment",
    "Villa",
  ].includes(formData.projectType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div role="dialog" aria-modal="true" aria-labelledby="consultation-title" className="relative w-full max-w-2xl bg-graphite border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-porcelain animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* SUCCESS SCREEN (Phase 6 & Master Spec) */
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-terracotta/20 text-gold-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory-soft">Thank you.</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                We’ve received your project details. Our team will contact you about your enquiry.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {successWhatsApp && <a
                href={successWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_clicked")}
                className="w-full sm:w-auto px-6 py-3 bg-whatsapp hover:bg-whatsapp-deep text-black text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-whatsapp/15 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Us</span>
              </a>}

              <button
                onClick={() => {
                    setSubmitted(false);
                    onClose();
                    if (window.location.pathname !== "/" || window.location.hash) {
                      window.history.pushState(null, "", "/");
                      window.dispatchEvent(new PopStateEvent("popstate"));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">
                  Private Studio Consultation
                </span>
                <span className="text-xs font-mono text-stone-700" aria-live="polite">
                  Step {currentStep} of 5 · {stepLabels[currentStep - 1]}
                </span>
              </div>
              <h3 id="consultation-title" className="text-2xl sm:text-3xl font-serif text-ivory-soft">
                {currentStep === 5 ? "Check your details" : "Tell us about your project."}
              </h3>

              {/* Progress Steps Indicators */}
              <div className="grid grid-cols-5 gap-1.5 mt-4" aria-label="Consultation progress">
                {stepLabels.map((label, index) => {
                  const s = index + 1;
                  return (
                  <button
                    key={s}
                    type="button"
                    aria-label={`Step ${s} of 5: ${label}${s < currentStep ? ", return to this step" : ""}`}
                    aria-current={s === currentStep ? "step" : undefined}
                    disabled={s >= currentStep}
                    onClick={() => {
                      if (s < currentStep) {
                        setErrorMsg(null);
                        setStepError(null);
                        setCurrentStep(s as 1 | 2 | 3 | 4 | 5);
                      }
                    }}
                    className={`h-1.5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                      s < currentStep ? "bg-terracotta" : s === currentStep ? "bg-gold-400" : "bg-white/10"
                    } ${s < currentStep ? "cursor-pointer hover:bg-gold-400" : "cursor-default"}`}
                    title={`Step ${s}`}
                  />
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div role="alert" className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              onSubmit={currentStep === 5 ? handleSubmit : handleNextStep}
              className="space-y-6"
            >
              {/* Anti-spam honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_url_trap"
                  tabIndex={-1}
                  value={formData.website_url_trap}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      website_url_trap: e.target.value,
                    })
                  }
                />
              </div>

              {/* STEP 1: About You */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs uppercase tracking-wider text-gold-500 font-semibold">About You</h4>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      aria-label="Full name"
                      aria-invalid={Boolean(stepError && currentStep === 1)}
                      aria-describedby={stepError && currentStep === 1 ? "consultation-name-error" : undefined}
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setStepError(null);
                      }}
                      placeholder="e.g. Rajiv Singhania"
                      className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none"
                    />
                    {stepError && currentStep === 1 && <p id="consultation-name-error" role="alert" className="mt-1 text-xs text-red-300">{stepError}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-2">
                      I am a:
                    </label>
                    <div role="group" aria-label="Customer type" className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {CONSULTATION_OPTIONS.customerTypes.map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() =>
                            setFormData({ ...formData, customerType: type })
                          }
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            formData.customerType === type
                              ? "border-terracotta bg-terracotta/15 text-white font-medium"
                              : "border-white/10 bg-graphite-deep text-taupe hover:border-white/20"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Your Space */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-xs uppercase tracking-wider text-gold-500 font-semibold">Your Space</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Project Type
                      </label>
                      <select
                        aria-label="Project type"
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectType: e.target.value,
                          })
                        }
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                      >
                        {CONSULTATION_OPTIONS.projectTypes.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Property Type
                      </label>
                      <select
                        aria-label="Property type"
                        value={formData.propertyType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyType: e.target.value,
                          })
                        }
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                      >
                        {CONSULTATION_OPTIONS.propertyTypes.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="consultation-location" className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Where is your property? *</label>
                    <input id="consultation-location" type="text" required aria-invalid={Boolean(stepError && currentStep === 2)} aria-describedby={stepError && currentStep === 2 ? "consultation-location-error" : undefined} value={formData.location} onChange={(e) => { setFormData({ ...formData, location: e.target.value }); setStepError(null); }} placeholder="City or area" className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none" />
                    {stepError && currentStep === 2 && <p id="consultation-location-error" role="alert" className="mt-1 text-xs text-red-300">{stepError}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">How big is the space?</label>
                      <select
                        aria-label="Approximate carpet area"
                        value={formData.carpetAreaRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            carpetAreaRange: e.target.value,
                          })
                        }
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                      >
                        {CONSULTATION_OPTIONS.carpetAreas.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Exact Sq. Ft. (Optional)
                      </label>
                      <input
                        aria-label="Exact carpet area in square feet"
                        type="number"
                        value={formData.carpetAreaSqFt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            carpetAreaSqFt: e.target.value,
                          })
                        }
                        placeholder="e.g. 2400"
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>

                  {isResidential && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                          Configuration (BHK)
                        </label>
                        <select
                          aria-label="Bedrooms and hall configuration"
                          value={formData.bhk}
                          onChange={(e) =>
                            setFormData({ ...formData, bhk: e.target.value })
                          }
                          className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                        >
                          {CONSULTATION_OPTIONS.bhk.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                          Current Project Status
                        </label>
                        <select
                          aria-label="Project status"
                          value={formData.projectStatus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              projectStatus: e.target.value,
                            })
                          }
                          className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                        >
                          {CONSULTATION_OPTIONS.projectStatuses.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Your Requirement */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="text-xs uppercase tracking-wider text-gold-500 font-semibold">Your Requirement</h4>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-2">
                      Disciplines Needed (Select all that apply):
                    </label>
                    <div role="group" aria-label="What do you need help with?" className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {CONSULTATION_OPTIONS.requirements.map((item) => {
                        const isSelected = formData.requirements.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleRequirement(item)}
                            className={`p-2 rounded-lg border text-left text-[11px] transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-terracotta bg-terracotta/15 text-white font-medium"
                                : "border-white/10 bg-graphite-deep text-taupe hover:border-white/20"
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-terracotta" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Anticipated Budget Band *
                      </label>
                      <select
                        aria-label="Approximate budget"
                        value={formData.budgetRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budgetRange: e.target.value,
                          })
                        }
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                      >
                        {CONSULTATION_OPTIONS.budgets.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                      <span className="text-[10px] text-[#706c62] block mt-1">
                        Planning range only, not a quote.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Expected Execution Timeline
                      </label>
                      <select
                        aria-label="Expected start date"
                        value={formData.timeline}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: e.target.value })
                        }
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                      >
                        {CONSULTATION_OPTIONS.timelines.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Contact Details */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs uppercase tracking-wider text-gold-500 font-semibold">
                    Your Contact
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        aria-label="Phone number"
                        aria-invalid={Boolean(stepError && currentStep === 4)}
                        aria-describedby={stepError && currentStep === 4 ? "consultation-phone-error" : undefined}
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setStepError(null);
                        }}
                        placeholder="+91 98200 00000"
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none"
                      />
                      {stepError && currentStep === 4 && <p id="consultation-phone-error" role="alert" className="mt-1 text-xs text-red-300">{stepError}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        WhatsApp Number (If different)
                      </label>
                      <input
                        aria-label="WhatsApp number if different"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        placeholder="+91 98200 00000"
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Email Address
                      </label>
                      <input
                        aria-label="Email address"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="client@domain.com"
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                        Preferred Contact Method
                      </label>
                      <select
                        aria-label="Preferred contact method"
                        value={formData.preferredContactMethod}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredContactMethod: e.target.value,
                          })
                        }
                        className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-terracotta focus:outline-none"
                      >
                        {CONSULTATION_OPTIONS.contactMethods.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                      Tell us about your project & vision
                    </label>
                    <textarea
                      aria-label="Tell us about your project"
                      rows={2}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Share details regarding your layout, timeline, or bespoke joinery aspirations..."
                      className="w-full bg-graphite-deep border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Confirm */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs uppercase tracking-wider text-gold-500 font-semibold">Check your details</h4>
                    <span className="text-[10px] text-stone-700">
                      Please verify details
                    </span>
                  </div>

                  <div className="space-y-3 text-xs bg-graphite-deep border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] uppercase text-stone-700 block">
                          Client Name & Profile
                        </span>
                        <strong className="text-white text-sm">
                          {formData.name}
                        </strong>{" "}
                        ({formData.customerType})
                      </div>
                      <button
                        type="button"
                        aria-label="Edit your name and customer type"
                        onClick={() => setCurrentStep(1)}
                        className="min-h-11 px-2 text-gold-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] uppercase text-stone-700 block">
                          Project & Location
                        </span>
                        <strong className="text-white">
                          {formData.projectType}
                        </strong>{" "}
                        · {formData.propertyType} in{" "}
                        <strong className="text-white">
                          {formData.location}
                        </strong>
                        <div className="text-stone-600 text-[11px] mt-0.5">
                          {formData.carpetAreaSqFt
                            ? `${formData.carpetAreaSqFt} sq.ft`
                            : formData.carpetAreaRange}
                          {isResidential && ` · ${formData.bhk}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Edit project and location"
                        onClick={() => setCurrentStep(2)}
                        className="min-h-11 px-2 text-gold-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] uppercase text-stone-700 block">
                          Budget & Scope
                        </span>
                        <span className="text-gold-500 font-medium">
                          {formData.budgetRange}
                        </span>{" "}
                        · Timeline: {formData.timeline}
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          {formData.requirements.join(", ")}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Edit requirements and budget"
                        onClick={() => setCurrentStep(3)}
                        className="min-h-11 px-2 text-gold-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-stone-700 block">
                          Contact Channels
                        </span>
                        <span className="text-white font-mono">
                          {formData.phone}
                        </span>
                        {formData.email && (
                          <span className="text-stone-600">
                            {" "}
                            · {formData.email}
                          </span>
                        )}
                        <span className="text-[11px] text-gold-500 block mt-0.5">
                          Prefers: {formData.preferredContactMethod}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Edit contact details"
                        onClick={() => setCurrentStep(4)}
                        className="min-h-11 px-2 text-gold-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#706c62] leading-relaxed">
                    By submitting this form, you agree that JK Interior may
                    contact you about your enquiry.
                  </p>
                </div>
              )}

              {/* Navigation Button Controls */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="min-h-11 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="group min-h-11 px-6 py-2.5 bg-terracotta hover:bg-terracotta-deep active:scale-[0.99] text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-transform shadow-md shadow-terracotta/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="min-h-11 px-7 py-3 bg-terracotta hover:bg-terracotta-deep active:scale-[0.99] text-white text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-transform shadow-xl shadow-terracotta/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
