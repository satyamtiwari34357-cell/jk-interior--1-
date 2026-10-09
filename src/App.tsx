import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { DesignInspiration } from './components/DesignInspiration.tsx';
import { ProjectShowcase } from './components/ProjectShowcase.tsx';
import { ProjectDetailView } from './components/ProjectDetailView.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ServiceDetailView } from './components/ServiceDetailView.tsx';
import { MaterialAtelier } from './components/MaterialAtelier.tsx';
import { MoodboardDrawer } from './components/MoodboardDrawer.tsx';
import { FounderStory } from './components/FounderStory.tsx';
import { Testimonials } from './components/Testimonials.tsx';
import { DarkCTA } from './components/DarkCTA.tsx';
import { ConsultationModal } from './components/ConsultationModal.tsx';
import { Footer } from './components/Footer.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { AdminPortal } from './admin/AdminPortal.tsx';
import { MaterialSwatch } from './types.ts';
import { MATERIALS } from './data/materials.ts';
import { updatePageSeo } from './lib/seo.ts';
import { initAnalytics, trackEvent } from './lib/analytics.ts';
import { BeforeWeSpeak, BudgetGuidance, MobileContactBar, ProcessSection, QuickProjectPath, StyleQuiz, WhyJK } from './components/CustomerDiscovery.tsx';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#admin')
    );
  });

  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(() => {
    const p = window.location.pathname;
    if (p.startsWith('/projects/') && p.length > 10) {
      return p.replace('/projects/', '').replace(/\/$/, '');
    }
    const h = window.location.hash;
    if (h.startsWith('#project/')) {
      return h.replace('#project/', '');
    }
    return null;
  });

  const [activeServiceSlug, setActiveServiceSlug] = useState<string | null>(() => {
    const p = window.location.pathname;
    if (p.startsWith('/services/') && p.length > 10) {
      return p.replace('/services/', '').replace(/\/$/, '');
    }
    const h = window.location.hash;
    if (h.startsWith('#service/')) {
      return h.replace('#service/', '');
    }
    return null;
  });

  const [consultationOpen, setConsultationOpen] = useState(false);
  const [moodboardOpen, setMoodboardOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialSwatch[]>([
    MATERIALS[0], // Calacatta Oro
    MATERIALS[1], // Smoked European Oak
  ]);
  const [prefillData, setPrefillData] = useState<{
    projectName?: string;
    propertyType?: string;
    carpetArea?: string;
    tier?: string;
    budget?: string;
    timeline?: string;
    materials?: string[];
  }>({});

  // Initialize analytics and dynamic SEO on mount & route change
  useEffect(() => {
    initAnalytics();

    const handleUrlChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      const isNowAdmin = (
        pathname.startsWith('/admin') ||
        hash.startsWith('#admin')
      );
      setIsAdminMode(isNowAdmin);

      // Check project route
      if (pathname.startsWith('/projects/') && pathname.length > 10) {
        const slug = pathname.replace('/projects/', '').replace(/\/$/, '');
        setActiveProjectSlug(slug);
        setActiveServiceSlug(null);
        return;
      } else if (hash.startsWith('#project/')) {
        const slug = hash.replace('#project/', '');
        setActiveProjectSlug(slug);
        setActiveServiceSlug(null);
        return;
      } else {
        setActiveProjectSlug(null);
      }

      // Check service route
      if (pathname.startsWith('/services/') && pathname.length > 10) {
        const slug = pathname.replace('/services/', '').replace(/\/$/, '');
        setActiveServiceSlug(slug);
        setActiveProjectSlug(null);
        return;
      } else if (hash.startsWith('#service/')) {
        const slug = hash.replace('#service/', '');
        setActiveServiceSlug(slug);
        setActiveProjectSlug(null);
        return;
      } else {
        setActiveServiceSlug(null);
      }

      // Handle standard section and route SEO
      if (!isNowAdmin) {
        if (hash === '#projects' || pathname === '/projects') {
          updatePageSeo({
            title: 'Projects | JK Interior',
            description: 'Browse residential and commercial interior projects by JK Interior in Mumbai.',
            canonicalPath: '/projects',
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Projects', url: '/projects' }
            ]
          });
          trackEvent('page_view', { page: 'projects' });
        } else if (hash === '#services' || pathname === '/services') {
          updatePageSeo({
            title: 'Interior Design Services | JK Interior',
            description: 'Explore residential, commercial, office, luxury home, turnkey, and custom furniture services.',
            canonicalPath: '/services',
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Services', url: '/services' }
            ]
          });
          trackEvent('page_view', { page: 'services' });
        } else if (hash === '#inspiration' || pathname === '/inspiration') {
          updatePageSeo({
            title: 'Interior Design Inspiration | JK Interior',
            description: 'Explore design ideas for homes, offices, and commercial spaces.',
            canonicalPath: '/inspiration',
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Inspiration', url: '/inspiration' }
            ]
          });
          trackEvent('page_view', { page: 'inspiration' });
        } else if (hash === '#founder' || pathname === '/studio') {
          updatePageSeo({
            title: 'Studio | JK Interior',
            description: 'Meet JK Interior and Kishorilal Sharma, a Mumbai interior design studio with 20+ years of experience.',
            canonicalPath: '/studio',
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Studio', url: '/studio' }
            ]
          });
          trackEvent('page_view', { page: 'studio' });
        } else if (hash === '#craftsmanship' || pathname === '/process') {
          updatePageSeo({
            title: 'Our Process | JK Interior',
            description: 'See how JK Interior discovers, plans, designs, executes, and delivers interior projects.',
            canonicalPath: '/process',
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Process', url: '/process' }
            ]
          });
          trackEvent('page_view', { page: 'process' });
        } else if (hash === '#contact' || pathname === '/contact') {
          updatePageSeo({
            title: 'Contact JK Interior | Book a Consultation',
            description: 'Contact JK Interior to discuss a residential or commercial interior project in Mumbai.',
            canonicalPath: '/contact',
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Contact', url: '/contact' }
            ]
          });
          trackEvent('page_view', { page: 'contact' });
        } else {
          updatePageSeo({
            title: 'JK Interior | Interior Design Studio in Mumbai',
            description: 'JK Interior creates residential and commercial interiors across Mumbai.',
            canonicalPath: '/'
          });
          trackEvent('page_view', { page: 'home' });
        }
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleToggleMaterial = (mat: MaterialSwatch) => {
    setSelectedMaterials(prev => {
      const exists = prev.some(m => m.id === mat.id);
      if (exists) {
        return prev.filter(m => m.id !== mat.id);
      } else {
        return [...prev, mat];
      }
    });
  };

  const handleRemoveMaterial = (id: string) => {
    setSelectedMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleClearMoodboard = () => {
    setSelectedMaterials([]);
  };

  const handleInquireProject = (projectName: string) => {
    setPrefillData({
      projectName,
      propertyType: 'Turnkey Luxury Residence'
    });
    setConsultationOpen(true);
  };

  const handleRequestSampleKit = (materialNames: string[]) => {
    setPrefillData({
      materials: materialNames
    });
    setConsultationOpen(true);
  };

  const handleOpenConsultationWithInspiration = (conceptTitle: string) => {
    setPrefillData({
      projectName: conceptTitle,
      propertyType: 'Inspiration Reference Execution'
    });
    setConsultationOpen(true);
  };

  const handleOpenConsultationWithService = (serviceName: string) => {
    setPrefillData({
      propertyType: serviceName
    });
    setConsultationOpen(true);
  };

  // If in admin mode, render exclusively the protected Admin Portal (No public header or footer)
  if (isAdminMode) {
    return (
      <AdminPortal
        onExitAdmin={() => {
          if (window.location.hash.startsWith('#admin')) {
            window.location.hash = '';
          }
          if (window.location.pathname.startsWith('/admin')) {
            window.history.pushState(null, '', '/');
          }
          setIsAdminMode(false);
        }}
      />
    );
  }

  // If viewing a dedicated project detail route (/projects/:slug)
  if (activeProjectSlug) {
    return (
      <div className="min-h-screen bg-ivory text-charcoal">
        <ScrollProgress />
        <Navbar
          onOpenConsultation={() => {
            setPrefillData({ projectName: activeProjectSlug });
            setConsultationOpen(true);
          }}
          onOpenMoodboard={() => setMoodboardOpen(true)}
          moodboardCount={selectedMaterials.length}
        />
        <ProjectDetailView
          slug={activeProjectSlug}
          onBack={() => {
            setActiveProjectSlug(null);
            window.history.pushState(null, '', '/#projects');
          }}
          onOpenConsultationWithProject={handleInquireProject}
          onSelectProjectBySlug={(s) => {
            window.history.pushState(null, '', `/projects/${s}`);
            setActiveProjectSlug(s);
          }}
        />
        <Footer
          onOpenConsultation={() => {
            setPrefillData({});
            setConsultationOpen(true);
          }}
        />
        <ConsultationModal
          isOpen={consultationOpen}
          onClose={() => setConsultationOpen(false)}
          prefillData={prefillData}
        />
        <MobileContactBar onOpenConsultation={() => setConsultationOpen(true)} />
      </div>
    );
  }

  const isProjectsRoute = typeof window !== 'undefined' && window.location.pathname === '/projects';

  if (isProjectsRoute) {
    return (
      <div className="min-h-screen bg-dark-800 text-ivory">
        <ScrollProgress />
        <Navbar
          onOpenConsultation={() => {
            setPrefillData({});
            setConsultationOpen(true);
          }}
          onOpenMoodboard={() => setMoodboardOpen(true)}
          moodboardCount={selectedMaterials.length}
        />
        <main>
          <ProjectShowcase
            onInquireProject={handleInquireProject}
            onOpenConsultation={() => {
              setPrefillData({});
              setConsultationOpen(true);
            }}
          />
        </main>
        <Footer
          onOpenConsultation={() => {
            setPrefillData({});
            setConsultationOpen(true);
          }}
        />
        <ConsultationModal
          isOpen={consultationOpen}
          onClose={() => setConsultationOpen(false)}
          prefillData={prefillData}
        />
        <MobileContactBar onOpenConsultation={() => setConsultationOpen(true)} />
      </div>
    );
  }

  if (window.location.pathname === '/inspiration') {
    return (
      <div className="min-h-screen bg-obsidian text-porcelain">
        <ScrollProgress />
        <Navbar
          onOpenConsultation={() => setConsultationOpen(true)}
          onOpenMoodboard={() => setMoodboardOpen(true)}
          moodboardCount={selectedMaterials.length}
        />
        <main className="pt-24">
          <header className="bg-ivory px-6 py-12 text-charcoal md:px-10">
            <div className="mx-auto max-w-7xl">
              <h1 className="font-serif text-4xl sm:text-5xl">Design Inspiration</h1>
              <p className="mt-3 text-sm text-warm-grey">Explore ideas for homes, offices and commercial spaces. These images are inspiration, not JK Interior project photography.</p>
            </div>
          </header>
          <DesignInspiration onOpenConsultationWithInspiration={handleOpenConsultationWithInspiration} />
        </main>
        <Footer onOpenConsultation={() => setConsultationOpen(true)} />
        <MoodboardDrawer
          isOpen={moodboardOpen}
          onClose={() => setMoodboardOpen(false)}
          selectedMaterials={selectedMaterials}
          onRemoveMaterial={handleRemoveMaterial}
          onClearAll={handleClearMoodboard}
          onRequestSampleKit={handleRequestSampleKit}
        />
        <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} prefillData={prefillData} />
        <MobileContactBar onOpenConsultation={() => setConsultationOpen(true)} />
      </div>
    );
  }

  // If viewing a dedicated service detail route (/services/:slug)
  if (activeServiceSlug) {
    return (
      <div className="min-h-screen bg-ivory text-charcoal">
        <ScrollProgress />
        <Navbar
          onOpenConsultation={() => {
            setPrefillData({ propertyType: activeServiceSlug });
            setConsultationOpen(true);
          }}
          onOpenMoodboard={() => setMoodboardOpen(true)}
          moodboardCount={selectedMaterials.length}
        />
        <ServiceDetailView
          slug={activeServiceSlug}
          onBack={() => {
            setActiveServiceSlug(null);
            window.history.pushState(null, '', '/#services');
          }}
          onOpenConsultationWithService={handleOpenConsultationWithService}
          onSelectServiceBySlug={(s) => {
            window.history.pushState(null, '', `/services/${s}`);
            setActiveServiceSlug(s);
          }}
        />
        <Footer
          onOpenConsultation={() => {
            setPrefillData({});
            setConsultationOpen(true);
          }}
        />
        <ConsultationModal
          isOpen={consultationOpen}
          onClose={() => setConsultationOpen(false)}
          prefillData={prefillData}
        />
        <MobileContactBar onOpenConsultation={() => setConsultationOpen(true)} />
      </div>
    );
  }

  // Full Public Marketing Website
  return (
    <div className="min-h-screen bg-obsidian text-porcelain selection:bg-terracotta selection:text-white">
      {/* Architectural Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Navigation Header */}
      <Navbar
        onOpenConsultation={() => {
          setPrefillData({});
          setConsultationOpen(true);
        }}
        onOpenMoodboard={() => setMoodboardOpen(true)}
        moodboardCount={selectedMaterials.length}
      />

      <main>
        {/* Hero */}
        <Hero
          onOpenConsultation={() => {
            setPrefillData({});
            setConsultationOpen(true);
          }}
        />

        <QuickProjectPath />

        {/* Real JK Interior Projects Showcase (Strict Separation & Portfolio In Preparation notice) */}
        <ProjectShowcase
          onInquireProject={handleInquireProject}
        />

        {/* Six Confirmed Architectural Services (Residential, Commercial, Office, Luxury, Turnkey, Furniture) */}
        <ServicesSection
          onOpenConsultationWithService={handleOpenConsultationWithService}
        />

        <WhyJK />

        {/* Virtual Material Atelier & Moodboard */}
        <MaterialAtelier
          selectedMaterialIds={selectedMaterials.map(m => m.id)}
          onToggleMaterial={handleToggleMaterial}
          onOpenMoodboard={() => setMoodboardOpen(true)}
        />

        {/* Studio introduction */}
        <FounderStory />

        <ProcessSection />

        <DesignInspiration
          onOpenConsultationWithInspiration={handleOpenConsultationWithInspiration}
        />

        {/* Testimonials */}
        <Testimonials />

        <StyleQuiz onOpenConsultation={() => setConsultationOpen(true)} />
        <BeforeWeSpeak onOpenConsultation={() => setConsultationOpen(true)} />
        <BudgetGuidance onOpenConsultation={() => setConsultationOpen(true)} />
      </main>

      {/* Signature Dark CTA */}
      <DarkCTA
        onOpenConsultation={() => {
          setPrefillData({});
          setConsultationOpen(true);
        }}
      />

      {/* Studio Footer */}
      <Footer
        onOpenConsultation={() => {
          setPrefillData({});
          setConsultationOpen(true);
        }}
      />

      {/* Interactive Moodboard Drawer */}
      <MoodboardDrawer
        isOpen={moodboardOpen}
        onClose={() => setMoodboardOpen(false)}
        selectedMaterials={selectedMaterials}
        onRemoveMaterial={handleRemoveMaterial}
        onClearAll={handleClearMoodboard}
        onRequestSampleKit={handleRequestSampleKit}
      />

      {/* Private 5-Step Consultation & WhatsApp Concierge Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        prefillData={prefillData}
      />
      <MobileContactBar onOpenConsultation={() => setConsultationOpen(true)} />
    </div>
  );
}
