import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  AlertTriangle,
  Loader2,
  Save,
  Globe,
} from "lucide-react";

interface ProjectImageItem {
  id?: string;
  url: string;
  secureUrl?: string;
  publicId?: string;
  filename?: string;
  alt: string;
  caption?: string;
  sortOrder: number;
  isCover: boolean;
  source: "JK_INTERIOR" | "INSPIRATION" | "CONCEPT";
  isConcept: boolean;
}

interface AdminProjectFormProps {
  initialData?: any;
  onSave: (projectData: any) => Promise<void>;
  onCancel: () => void;
  token: string;
}

export const AdminProjectForm: React.FC<AdminProjectFormProps> = ({
  initialData,
  onSave,
  onCancel,
  token,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [propertyType, setPropertyType] = useState(initialData?.propertyType || "");
  const [year, setYear] = useState(initialData?.year || "");
  const [area, setArea] = useState(initialData?.area || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || "",
  );
  const [fullDescription, setFullDescription] = useState(
    initialData?.fullDescription || "",
  );
  const [concept, setConcept] = useState(initialData?.concept || "");
  const [scopeOfWork, setScopeOfWork] = useState(
    initialData?.scopeOfWork || "",
  );
  const [materials, setMaterials] = useState<string>(
    Array.isArray(initialData?.materials)
      ? initialData.materials.join(", ")
      : "",
  );
  const [featured, setFeatured] = useState<boolean>(
    Boolean(initialData?.featured),
  );
  const [isConcept, setIsConcept] = useState<boolean>(
    Boolean(initialData?.isConcept),
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialData?.status || "DRAFT",
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seoDescription || "",
  );

  // Gallery
  const [images, setImages] = useState<ProjectImageItem[]>(
    initialData?.images && Array.isArray(initialData.images)
      ? initialData.images.map((img: any, idx: number) => ({
          ...img,
          sortOrder: img.sortOrder ?? idx,
          isCover: Boolean(img.isCover || idx === 0),
          source: img.source || "INSPIRATION",
          isConcept: img.isConcept === true || img.source !== "JK_INTERIOR",
        }))
      : [],
  );

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData?.id) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    const newImg: ProjectImageItem = {
      url: urlInput.trim(),
      alt: `${title || "Project"} interior view`,
      caption: "",
      sortOrder: images.length,
      isCover: images.length === 0,
      source: "INSPIRATION",
      isConcept: true,
    };
    setImages((prev) => [...prev, newImg]);
    setUrlInput("");
  };

  // Cloudinary / File Picker upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    const invalidFile = Array.from(files).find((file) => !allowedTypes.has(file.type) || file.size > 25 * 1024 * 1024);
    if (invalidFile) {
      setErrorMsg("Choose a JPEG, PNG, WebP, or AVIF image up to 25 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress(`Preparing ${files.length} file(s)...`);

    try {
      // 1. Request signature from server
      const sigRes = await fetch("/api/sign-cloudinary-params", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          folder: `jk-interior/projects/${slug || "new"}`,
        }),
      });
      if (!sigRes.ok) throw new Error("Unable to prepare Cloudinary upload.");
      const sigData = await sigRes.json();
      if (!sigData.configured) {
        throw new Error(
          "Cloudinary is not configured. Uploaded files cannot be saved yet.",
        );
      }

      const newUploadedImages: ProjectImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(
          `Uploading ${i + 1} of ${files.length}: ${file.name}`,
        );

        if (sigData.configured) {
          // Upload directly to Cloudinary using signed parameters
          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", sigData.apiKey);
          formData.append("timestamp", sigData.timestamp.toString());
          formData.append("signature", sigData.signature);
          formData.append("folder", sigData.folder);
          formData.append("allowed_formats", sigData.allowedFormats);

          const cRes = await fetch(
            `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
            { method: "POST", body: formData },
          );

          if (!cRes.ok) throw new Error(`Cloudinary rejected ${file.name}.`);
          const cJson = await cRes.json();
          const imageUrl = cJson.secure_url || cJson.url;
          if (!imageUrl)
            throw new Error(`Cloudinary returned no URL for ${file.name}.`);
          newUploadedImages.push({
            url: imageUrl,
            secureUrl: cJson.secure_url,
            publicId: cJson.public_id,
            filename: file.name,
            alt: `${title || "Project"} interior view`,
            sortOrder: images.length + newUploadedImages.length,
            isCover: images.length === 0 && newUploadedImages.length === 0,
            source: "INSPIRATION",
            isConcept: true,
          });
        }
      }

      setImages((prev) => [...prev, ...newUploadedImages]);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to complete image upload. Please try again.",
      );
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // Reordering & Cover controls
  const setAsCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index,
      })),
    );
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const arr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[targetIndex];
      arr[targetIndex] = temp;
      return arr.map((item, idx) => ({ ...item, sortOrder: idx }));
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const updateImageMeta = (
    index: number,
    field: keyof ProjectImageItem,
    val: any,
  ) => {
    setImages((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [field]: val };
      return arr;
    });
  };

  const updateImageSource = (index: number, source: ProjectImageItem["source"]) => {
    setImages((prev) => prev.map((image, imageIndex) => imageIndex === index
      ? { ...image, source, isConcept: source !== "JK_INTERIOR" }
      : image));
  };

  // Submit
  const handleSubmit = async (submitStatus: "DRAFT" | "PUBLISHED") => {
    if (!title.trim() || !location.trim()) {
      setErrorMsg("Title and location are required.");
      return;
    }

    // Safety Rule Warning: Never publish concept images as real projects!
    const hasConceptImages = images.some(
      (img) => img.isConcept || img.source !== "JK_INTERIOR",
    );
    if (submitStatus === "PUBLISHED" && (isConcept || hasConceptImages)) {
      const proceed = window.confirm(
        "Warning: This project is marked as a concept study or contains concept images. Concept visuals must NOT be published as completed JK Interior projects in the public portfolio. Would you like to save this project as a DRAFT instead?",
      );
      if (proceed) {
        submitStatus = "DRAFT";
      } else {
        return;
      }
    }

    setSaving(true);
    setErrorMsg(null);

    const materialsArray = materials
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    try {
      await onSave({
        title,
        slug,
        location,
        category,
        propertyType,
        year,
        area,
        shortDescription,
        fullDescription,
        concept,
        scopeOfWork,
        materials: materialsArray,
        featured,
        isConcept,
        status: submitStatus,
        seoTitle,
        seoDescription,
        images,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onCancel}
          className="text-xs text-stone-500 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-gold-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-gold-500/15"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>Publish Project</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Multi-Section Form */}
      <div className="space-y-6">
        {/* 1. Basic Information */}
        <div className="p-6 rounded-xl bg-graphite border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold border-b border-white/5 pb-2">
            1. Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Worli Seaface Penthouse"
                className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="worli-seaface-penthouse"
                className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 font-mono focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
                Location (Mumbai Precinct) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Worli Sea Face, Mumbai"
                className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none"
              >
                <option value="Penthouse">Penthouse</option>
                <option value="Seafront Villa">Seafront Villa</option>
                <option value="Bespoke Residence">Bespoke Residence</option>
                <option value="Commercial Atelier">Commercial Atelier</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
                Carpet Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="5,800 sq.ft"
                className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
                Year of Handover
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Narrative & Architectural Concept */}
        <div className="p-6 rounded-xl bg-graphite border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold border-b border-white/5 pb-2">
            2. Narrative & Architectural Concept
          </h3>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
              Short Description / Tagline
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A seamless panoramic duplex suspended over the Arabian Sea"
              className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
              Architectural Concept Narrative
            </label>
            <textarea
              rows={3}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Framing the sea without visual disturbance. Monolithic Statuario marble piers..."
              className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-medium">
              Materials Palette (Comma Separated)
            </label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Italian Statuario Marble, Smoked Oak, Champagne Brass, Fluted Glass"
              className="w-full bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. Cloudinary Upload & Image Gallery */}
        <div className="p-6 rounded-xl bg-graphite border border-white/5 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold">
                3. Project Imagery & Cloudinary Storage
              </h3>
              <p className="text-[11px] text-stone-700">
                Upload high-resolution photography. Set cover image and reorder
                gallery sequence.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              {images.length} Image(s)
            </span>
          </div>

          {/* Upload Area */}
          <div className="p-6 border-2 border-dashed border-white/15 rounded-xl hover:border-gold-500/50 transition-colors text-center space-y-3 bg-graphite-mid">
            <Upload className="w-8 h-8 text-gold-500 mx-auto" />
            <div className="text-xs text-taupe">
              <label className="text-gold-500 hover:underline cursor-pointer font-medium">
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span> or drag and drop files here</span>
            </div>
            <p className="text-[10px] text-[#7a766c]">
              Supported: JPEG, PNG, WebP, AVIF up to 25MB each
            </p>
          </div>

          {/* Direct URL input fallback */}
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Or paste external image URL..."
              className="flex-1 bg-graphite-deep border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-gold-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs rounded border border-white/10"
            >
              Add URL
            </button>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>{uploadProgress || "Processing upload..."}</span>
            </div>
          )}

          {/* Image List */}
          {images.length > 0 && (
            <div className="space-y-3 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex flex-col sm:flex-row items-center gap-4 transition-colors ${
                    img.isCover
                      ? "bg-graphite-dark border-gold-500"
                      : "bg-graphite-deep border-white/5"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-24 h-16 object-cover rounded bg-black/50 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-2 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      {img.isCover && (
                        <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-gold-500 text-black">
                          Cover Image
                        </span>
                      )}
                      <span className="text-[10px] text-stone-700 truncate">
                        Position {idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        aria-label={`Image ${idx + 1} source`}
                        value={img.source}
                        onChange={(e) => updateImageSource(idx, e.target.value as ProjectImageItem["source"])}
                        className="bg-ink border border-white/10 rounded px-2.5 py-1 text-[11px] text-white"
                      >
                        <option value="JK_INTERIOR">Verified JK Interior work</option>
                        <option value="INSPIRATION">External inspiration</option>
                        <option value="CONCEPT">Concept visual</option>
                      </select>
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) =>
                          updateImageMeta(idx, "alt", e.target.value)
                        }
                        placeholder="Alt text (for accessibility)"
                        className="bg-ink border border-white/10 rounded px-2.5 py-1 text-[11px] text-white"
                      />
                      <input
                        type="text"
                        value={img.caption || ""}
                        onChange={(e) =>
                          updateImageMeta(idx, "caption", e.target.value)
                        }
                        placeholder="Optional caption"
                        className="bg-ink border border-white/10 rounded px-2.5 py-1 text-[11px] text-white"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!img.isCover && (
                      <button
                        type="button"
                        onClick={() => setAsCover(idx)}
                        className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
                        title="Set as Cover"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, "up")}
                      className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, "down")}
                      className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Publishing & Concept Safety Options */}
        <div className="p-6 rounded-xl bg-graphite border border-white/5 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold border-b border-white/5 pb-2">
            4. Publishing Controls & Concept Safeguards
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#c5a880] rounded"
              />
              <span className="text-xs text-taupe">
                Feature this project prominently on the homepage
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isConcept}
                onChange={(e) => setIsConcept(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <div>
                <span className="text-xs text-amber-300 font-medium block">
                  Mark as Concept Study (isConcept = true)
                </span>
                <span className="text-[11px] text-stone-700">
                  Concept studies remain private or labeled "CONCEPT VISUAL" and
                  are never shown as real completed projects.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
