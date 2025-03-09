// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
      <div className="jeuwei-panel p-8">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "jeuwei-btn-primary",
              card: "bg-transparent shadow-none",
              headerTitle: "jeuwei-subheading text-center",
              headerSubtitle: "text-slate-400 text-center",
              socialButtonsBlockButton: "border border-blue-500/30 hover:border-blue-400 text-slate-300",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-blue-950/20 border-blue-900/30 text-slate-300",
              footer: "text-slate-400",
              footerActionLink: "text-blue-400 hover:text-blue-300"
            }
          }}
        />
      </div>
    </div>
  );
}