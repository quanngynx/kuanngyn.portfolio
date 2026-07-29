export default function ArticleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen px-container pt-16 pb-24 md:pt-24 md:pb-36">
      {children}
    </main>
  );
}
