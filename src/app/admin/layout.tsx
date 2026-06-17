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
    <div className="w-full h-screen bg-black overflow-hidden font-[family-name:var(--font-lexend)]">
      {children}
    </div>
  );
}
