
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <div className="flex flex-col h-screen">
      {children}
    </div>
  );
}
