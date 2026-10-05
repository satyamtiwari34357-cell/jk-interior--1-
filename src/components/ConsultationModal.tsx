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

  const [formData, setFormData] = useState({
    // Step 1: About You
    name: "",
    customerType: "Homeowner",

    // Step 2: Your Space
    projectType: "Residential Interior",
    propertyType: "Apartment",
    location: "Worli / Prabhadevi",
    carpetAreaRange: "1,500–2,500 sq. ft.",
    carpetAreaSqFt: "",
    bhk: "3 BHK",
    projectStatus: "Ready Property",

    // Step 3: Your Requirement
    requirements: ["Interior Design", "Turnkey Execution"] as string[],
    budgetRange: "₹40–75 Lakhs",
    timeline: "1–3 months",

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

  useEffect(() => {
    if (isOpen) {
      trackEvent("consultation_form_started");
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
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setErrorMsg("Please enter your full name to proceed.");
        return;
      }
      trackEvent("consultation_step_completed", { step: 1 });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.location.trim()) {
        setErrorMsg(
          "Please select or specify your property location in Mumbai.",
        );
        return;
      }
      trackEvent("consultation_step_completed", { step: 2 });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      trackEvent("consultation_step_completed", { step: 3 });
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!formData.phone.trim()) {
        setErrorMsg(
          "Please provide a mobile number so Kishorilal Sharma’s desk can reach you.",
        );
        return;
      }
      trackEvent("consultation_step_completed", { step: 4 });
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
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
        trackEvent("consultation_form_completed", {
          projectType: formData.projectType,
          location: formData.location,
        });
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

  const whatsappMessage = encodeURIComponent(
    `Hello JK Interior,\n\nI submitted a consultation request for my ${formData.projectType} in ${formData.location}.\n\nName: ${formData.name || "Client"}\nScale: ${formData.carpetAreaSqFt ? `${formData.carpetAreaSqFt} sq.ft` : formData.carpetAreaRange}\nBudget: ${formData.budgetRange}\nNote: ${formData.message || "Looking forward to discussing plans."}`,
  );

  const isResidential = [
    "Residential Interior",
    "Luxury Home",
    "Apartment",
    "Villa",
  ].includes(formData.projectType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121319] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-[#ede9e1] animate-in fade-in zoom-in-95 duration-200">
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
            <div className="w-16 h-16 rounded-full bg-[#B7653F]/20 text-[#c5a880] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#fbf9f5]">
                Thank You
              </h3>
              <p className="text-sm text-[#b8b4a7] max-w-md mx-auto leading-relaxed">
                Thank you for sharing your project details. Our team has
                received your enquiry and will contact you.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/919820123456?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_clicked")}
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/15 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Us</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
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
                <span className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
                  Private Studio Consultation
                </span>
                <span className="text-xs font-mono text-[#8e8a7f]">
                  Step {currentStep} of 5
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#fbf9f5]">
                Initiate Your Turnkey Residence
              </h3>

              {/* Progress Steps Indicators */}
              <div className="grid grid-cols-5 gap-1.5 mt-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (s < currentStep) {
                        setErrorMsg(null);
                        setCurrentStep(s as any);
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s <= currentStep ? "bg-[#B7653F]" : "bg-white/10"
                    } ${s < currentStep ? "cursor-pointer hover:bg-[#d4b88f]" : "cursor-default"}`}
                    title={`Step ${s}`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
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
                  <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                    Step 1 — About You
                  </h4>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Rajiv Singhania"
                      className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#B7653F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-2">
                      I am a:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        "Homeowner",
                        "Business Owner",
                        "Architect / Developer",
                        "Corporate Representative",
                        "Other",
                      ].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() =>
                            setFormData({ ...formData, customerType: type })
                          }
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            formData.customerType === type
                              ? "border-[#B7653F] bg-[#B7653F]/15 text-white font-medium"
                              : "border-white/10 bg-[#161720] text-[#cfc9be] hover:border-white/20"
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
                  <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                    Step 2 — Your Space
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectType: e.target.value,
                          })
                        }
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                      >
                        <option value="Residential Interior">
                          Residential Interior
                        </option>
                        <option value="Luxury Home">Luxury Home</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Commercial Interior">
                          Commercial Interior
                        </option>
                        <option value="Office">Office</option>
                        <option value="Turnkey Interior">
                          Turnkey Interior
                        </option>
                        <option value="Custom Furniture">
                          Custom Furniture
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Property Type
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyType: e.target.value,
                          })
                        }
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Duplex / Penthouse">
                          Duplex / Penthouse
                        </option>
                        <option value="Villa / Bungalow">
                          Villa / Bungalow
                        </option>
                        <option value="Corporate Office">
                          Corporate Office
                        </option>
                        <option value="Retail / Boutique">
                          Retail / Boutique
                        </option>
                        <option value="Restaurant / Hospitality">
                          Restaurant / Hospitality
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                      Property Location (Mumbai Precinct) *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                    >
                      <option value="Worli / Prabhadevi">
                        Worli / Prabhadevi
                      </option>
                      <option value="Bandra West / Pali Hill">
                        Bandra West / Pali Hill
                      </option>
                      <option value="South Mumbai (Altamount / Malabar Hill / Marine Drive)">
                        South Mumbai (Altamount / Malabar Hill / Marine Drive)
                      </option>
                      <option value="Juhu / Versova">Juhu / Versova</option>
                      <option value="BKC / Santacruz">BKC / Santacruz</option>
                      <option value="Powai / Hiranandani">
                        Powai / Hiranandani
                      </option>
                      <option value="Alibaug / Lonavala Estate">
                        Alibaug / Lonavala Estate
                      </option>
                      <option value="Other Mumbai Location">
                        Other Mumbai Location
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Carpet Area Range
                      </label>
                      <select
                        value={formData.carpetAreaRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            carpetAreaRange: e.target.value,
                          })
                        }
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                      >
                        <option value="Below 500 sq. ft.">
                          Below 500 sq. ft.
                        </option>
                        <option value="500–1,000 sq. ft.">
                          500–1,000 sq. ft.
                        </option>
                        <option value="1,000–1,500 sq. ft.">
                          1,000–1,500 sq. ft.
                        </option>
                        <option value="1,500–2,500 sq. ft.">
                          1,500–2,500 sq. ft.
                        </option>
                        <option value="2,500–4,000 sq. ft.">
                          2,500–4,000 sq. ft.
                        </option>
                        <option value="4,000+ sq. ft.">4,000+ sq. ft.</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Exact Sq. Ft. (Optional)
                      </label>
                      <input
                        type="number"
                        value={formData.carpetAreaSqFt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            carpetAreaSqFt: e.target.value,
                          })
                        }
                        placeholder="e.g. 2400"
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#B7653F] focus:outline-none"
                      />
                    </div>
                  </div>

                  {isResidential && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                          Configuration (BHK)
                        </label>
                        <select
                          value={formData.bhk}
                          onChange={(e) =>
                            setFormData({ ...formData, bhk: e.target.value })
                          }
                          className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                        >
                          <option value="Studio">Studio</option>
                          <option value="1 BHK">1 BHK</option>
                          <option value="2 BHK">2 BHK</option>
                          <option value="3 BHK">3 BHK</option>
                          <option value="4 BHK">4 BHK</option>
                          <option value="5+ BHK">5+ BHK</option>
                          <option value="Not applicable">Not applicable</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                          Current Project Status
                        </label>
                        <select
                          value={formData.projectStatus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              projectStatus: e.target.value,
                            })
                          }
                          className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                        >
                          <option value="Ready Property">
                            Ready Property (Bare-shell or Handover)
                          </option>
                          <option value="Under Construction">
                            Under Construction
                          </option>
                          <option value="Renovation">
                            Complete Renovation
                          </option>
                          <option value="Commercial Property">
                            Commercial Property
                          </option>
                          <option value="Not Sure">Not Sure</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Your Requirement */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                    Step 3 — Your Requirements
                  </h4>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-2">
                      Disciplines Needed (Select all that apply):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        "Interior Design",
                        "Space Planning",
                        "Turnkey Execution",
                        "Furniture",
                        "Custom Furniture",
                        "Renovation",
                        "Lighting",
                        "Other",
                      ].map((item) => {
                        const isSelected = formData.requirements.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleRequirement(item)}
                            className={`p-2 rounded-lg border text-left text-[11px] transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-[#B7653F] bg-[#B7653F]/15 text-white font-medium"
                                : "border-white/10 bg-[#161720] text-[#cfc9be] hover:border-white/20"
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B7653F]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Anticipated Budget Band *
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budgetRange: e.target.value,
                          })
                        }
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                      >
                        <option value="Under ₹10 Lakhs">Under ₹10 Lakhs</option>
                        <option value="₹10–20 Lakhs">₹10–20 Lakhs</option>
                        <option value="₹20–40 Lakhs">₹20–40 Lakhs</option>
                        <option value="₹40–75 Lakhs">₹40–75 Lakhs</option>
                        <option value="₹75 Lakhs–₹1 Crore">
                          ₹75 Lakhs–₹1 Crore
                        </option>
                        <option value="₹1 Crore+">₹1 Crore+</option>
                        <option value="Not decided yet">Not decided yet</option>
                      </select>
                      <span className="text-[10px] text-[#706c62] block mt-1">
                        Enquiry category only; not a formal quote.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Expected Execution Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: e.target.value })
                        }
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="Within 1 month">Within 1 month</option>
                        <option value="1–3 months">1–3 months</option>
                        <option value="3–6 months">3–6 months</option>
                        <option value="6+ months">6+ months</option>
                        <option value="Just exploring">Just exploring</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Contact Details */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                    Step 4 — Contact Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91 98200 00000"
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#B7653F] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        WhatsApp Number (If different)
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        placeholder="+91 98200 00000"
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#B7653F] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="client@domain.com"
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#B7653F] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                        Preferred Contact Method
                      </label>
                      <select
                        value={formData.preferredContactMethod}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredContactMethod: e.target.value,
                          })
                        }
                        className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#B7653F] focus:outline-none"
                      >
                        <option value="Phone Call">Phone Call</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9f9b90] mb-1">
                      Tell us about your project & vision
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Share details regarding your layout, timeline, or bespoke joinery aspirations..."
                      className="w-full bg-[#181a22] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-[#B7653F] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Confirm */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                      Step 5 — Review Your Consultation Inquiry
                    </h4>
                    <span className="text-[10px] text-[#8e8a7f]">
                      Please verify details
                    </span>
                  </div>

                  <div className="space-y-3 text-xs bg-[#161720] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] uppercase text-[#8e8a7f] block">
                          Client Name & Profile
                        </span>
                        <strong className="text-white text-sm">
                          {formData.name}
                        </strong>{" "}
                        ({formData.customerType})
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#c5a880] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] uppercase text-[#8e8a7f] block">
                          Project & Location
                        </span>
                        <strong className="text-white">
                          {formData.projectType}
                        </strong>{" "}
                        · {formData.propertyType} in{" "}
                        <strong className="text-white">
                          {formData.location}
                        </strong>
                        <div className="text-[#a09c91] text-[11px] mt-0.5">
                          {formData.carpetAreaSqFt
                            ? `${formData.carpetAreaSqFt} sq.ft`
                            : formData.carpetAreaRange}
                          {isResidential && ` · ${formData.bhk}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[#c5a880] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[10px] uppercase text-[#8e8a7f] block">
                          Budget & Scope
                        </span>
                        <span className="text-[#c5a880] font-medium">
                          {formData.budgetRange}
                        </span>{" "}
                        · Timeline: {formData.timeline}
                        <div className="text-[11px] text-[#a09c91] mt-0.5">
                          {formData.requirements.join(", ")}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[#c5a880] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-[#8e8a7f] block">
                          Contact Channels
                        </span>
                        <span className="text-white font-mono">
                          {formData.phone}
                        </span>
                        {formData.email && (
                          <span className="text-[#a09c91]">
                            {" "}
                            · {formData.email}
                          </span>
                        )}
                        <span className="text-[11px] text-[#c5a880] block mt-0.5">
                          Prefers: {formData.preferredContactMethod}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-[#c5a880] hover:underline flex items-center gap-1 text-[11px]"
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
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg flex items-center gap-1.5 transition-colors"
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
                    className="px-6 py-2.5 bg-[#B7653F] hover:bg-[#a15532] text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-md shadow-[#B7653F]/15"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3 bg-[#B7653F] hover:bg-[#a15532] text-white text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors shadow-xl shadow-[#B7653F]/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Consultation Request</span>
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
