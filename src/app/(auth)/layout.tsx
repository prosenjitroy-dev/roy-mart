import { LayoutProps } from "@/lib/types";

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
};

export default AuthLayout;
