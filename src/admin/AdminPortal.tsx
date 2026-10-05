import React, { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout.tsx";
import { AdminLogin } from "./AdminLogin.tsx";
import { AdminDashboard } from "./AdminDashboard.tsx";
import { AdminProjects } from "./AdminProjects.tsx";
import { AdminServices } from "./AdminServices.tsx";
import { AdminLeads } from "./AdminLeads.tsx";
import { AdminTestimonials } from "./AdminTestimonials.tsx";
import { AdminMedia } from "./AdminMedia.tsx";
import { AdminSettings } from "./AdminSettings.tsx";
import { AdminTab } from "./types.ts";

interface AdminPortalProps {
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitAdmin }) => {
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const [currentTab, setCurrentTab] = useState<AdminTab>("dashboard");
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);
  const [loadingMe, setLoadingMe] = useState(true);

  // Verify session on mount
  useEffect(() => {
    let isMounted = true;
    const verifyUser = async () => {
      if (!token) {
        if (isMounted) setLoadingMe(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAdminUser(data.user);
          }
        } else {
          if (isMounted) setToken(null);
        }
      } catch (err) {
        console.warn("Session verification error:", err);
      } finally {
        if (isMounted) setLoadingMe(false);
      }
    };

    verifyUser();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Fetch new inquiries count for sidebar badge
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.leads?.newEnquiries) {
          setNewLeadsCount(data.leads.newEnquiries);
        }
      })
      .catch(() => {});
  }, [token, currentTab]);

  const handleLoginSuccess = (
    newToken: string,
    user: { email: string; name: string; role: string },
  ) => {
    setToken(newToken);
    setAdminUser(user);
    setCurrentTab("dashboard");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
    } catch (e) {}
    setToken(null);
    setAdminUser(null);
  };

  // If not logged in, show secure login page
  if (!token || !adminUser) {
    return (
      <AdminLogin onLoginSuccess={handleLoginSuccess} onCancel={onExitAdmin} />
    );
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      adminUser={adminUser}
      onLogout={handleLogout}
      onViewPublicSite={onExitAdmin}
      newLeadsCount={newLeadsCount}
    >
      {currentTab === "dashboard" && (
        <AdminDashboard onNavigate={setCurrentTab} token={token} />
      )}
      {(currentTab === "projects" ||
        currentTab === "project-new" ||
        currentTab === "project-edit") && <AdminProjects token={token} />}
      {currentTab === "services" && <AdminServices token={token} />}
      {currentTab === "leads" && <AdminLeads token={token} />}
      {currentTab === "testimonials" && <AdminTestimonials token={token} />}
      {currentTab === "media" && <AdminMedia token={token} />}
      {currentTab === "settings" && <AdminSettings token={token} />}
    </AdminLayout>
  );
};
