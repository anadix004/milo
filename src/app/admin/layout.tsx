import AdminGuard from "@/components/admin/AdminGuard";

export const metadata = {
  title: "MILO Admin",
  description: "Admin Portal for MILO",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="w-full h-screen bg-black overflow-hidden font-[family-name:var(--font-lexend)]">
        {children}
      </div>
    </AdminGuard>
  );
}
