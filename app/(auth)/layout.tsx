import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create an account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient blob */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-200/50 dark:bg-orange-500/10 rounded-full blur-3xl" />
        {/* Top right gradient blob */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-100/60 dark:bg-orange-500/5 rounded-full blur-3xl" />
        {/* Bottom left gradient blob */}
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-orange-100/50 dark:bg-orange-500/5 rounded-full blur-3xl" />
        {/* Bottom right gradient blob */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-200/40 dark:bg-orange-500/10 rounded-full blur-3xl" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 dark:bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Auth pages layout - with header offset for fixed header */}
      <main
        id="main-content"
        role="main"
        className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28"
      >
        {children}
      </main>
    </div>
  );
}
