import { Metadata } from "next";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Roy Mart",
  description: "Sign in to your Roy Mart account",
};

const page = () => {
  return (
    <section className="grid h-dvh place-items-center">
      <LoginForm />
    </section>
  );
};

export default page;
