import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <div className="w-full max-w-md p-8">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
              footerActionLink: "text-indigo-600 hover:text-indigo-700",
            },
          }}
        />
      </div>
    </div>
  );
}
