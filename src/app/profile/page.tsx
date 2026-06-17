"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRoundPen } from "lucide-react";
import DigitalPassport from "@/components/profile/DigitalPassport";
import MyRadar from "@/components/profile/MyRadar";
import SettingsModal from "@/components/profile/SettingsModal";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import Header from "@/components/Header";
import EventSubmission from "@/components/EventSubmission";
import { useAuth } from "@/components/AuthContext";

export default function ProfilePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeEditField, setActiveEditField] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [showLoadTrouble, setShowLoadTrouble] = useState(false);
  const [activeModal, setActiveModal] = useState<"event" | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => setShowLoadTrouble(true), 6000);
      return () => {
        clearTimeout(t);
        setShowLoadTrouble(false);
      };
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative pb-24 md:pb-12 pt-[96px] flex items-center justify-center">
        <div className="w-full max-w-xl px-6 text-center">
          <div className="w-full h-64 rounded-[2rem] bg-white/5 border border-white/10 animate-pulse" />
          {showLoadTrouble && (
            <div className="mt-6 text-white/40 font-mono text-xs uppercase tracking-[0.25em]">
              Still loading your session…
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const displayName =
    user?.display_name ||
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Member";

  const handle =
    (user?.username && `@${user.username}`) ||
    (user?.email ? `@${user.email.split("@")[0]}` : "@milo");

  const city = user?.city || user?.location || "Your city";

  return (
    <div className="min-h-screen relative pb-24 md:pb-12 pt-[96px]" style={{ background: "var(--background)" }}>
      <Header
        onProfileClick={() => router.push("/auth")}
        onEventClick={() => setActiveModal("event")}
        onNotificationsClick={() => {}}
        isSidebarOpen={false}
      />
      <EventSubmission
        isOpen={activeModal === "event"}
        onClose={() => setActiveModal(null)}
        onAuthRedirect={() => router.push("/auth")}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] overflow-hidden">
          <div className="relative h-40 md:h-48">
            {user?.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <Image src={user.cover_url} alt="" fill className="absolute inset-0 object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.55),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(16,185,129,0.35),transparent_60%),radial-gradient(circle_at_60%_90%,rgba(236,72,153,0.35),transparent_55%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] border border-white/15 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                  {user?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image src={user.avatar_url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-white font-black uppercase tracking-tight text-2xl md:text-3xl truncate">
                    {displayName}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-white/70 text-[11px] uppercase tracking-[0.24em] font-mono">
                    <span className="truncate">{handle}</span>
                    <span className="text-white/30">•</span>
                    <span className="truncate">{city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-full text-white/85 transition-colors cursor-pointer"
                >
                  <UserRoundPen size={16} />
                  <span className="hidden md:inline font-black uppercase text-[11px] tracking-[0.22em]">Edit</span>
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-full text-white/85 transition-colors group cursor-pointer"
                >
                  <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                  <span className="hidden md:inline font-black uppercase text-[11px] tracking-[0.22em]">Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline font-black uppercase text-[11px] tracking-[0.22em]">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8">
          <div className="lg:sticky lg:top-[112px] h-fit">
            <DigitalPassport onEditProfile={() => setIsEditOpen(true)} />
          </div>
          <div className="min-w-0">
            <MyRadar />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onEditProfile={(fieldId) => {
          setActiveEditField(fieldId ?? null);
          setIsEditOpen(true);
        }}
      />
      
      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setActiveEditField(null); }}
        activeField={activeEditField}
      />
    </div>
  );
}
