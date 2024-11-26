export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">About Sideline</h1>

        <div className="space-y-6 text-muted-foreground">
          <p>
            Sideline was created with a simple mission: to make dining safer and
            more comfortable for everyone, regardless of their dietary
            requirements or language barriers.
          </p>

          <p>
            Our platform bridges the communication gap between diners with
            specific dietary needs and food service providers worldwide. By
            leveraging technology, we ensure that your dietary requirements are
            clearly communicated and understood, no matter where you are.
          </p>

          <p>
            We believe that everyone deserves to enjoy dining out with
            confidence, knowing their dietary needs will be properly understood
            and respected. Through innovation and dedication to user privacy,
            we&apos;re making this vision a reality.
          </p>
        </div>
      </div>
    </main>
  );
}
