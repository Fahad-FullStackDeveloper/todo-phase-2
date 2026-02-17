'use client';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          TodoFlow
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Premium Task Management Application
        </p>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Phase 1: Setup Complete
          </p>
          <p className="text-xs text-muted-foreground">
            Frontend initialized with Next.js 16.1.6
          </p>
        </div>
      </div>
    </main>
  );
}
