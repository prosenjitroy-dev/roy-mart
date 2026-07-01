import { Metadata } from "next";
import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up | Roy Mart",
  description: "Create a new Roy Mart account",
};

const page = () => {
  return (
    <section className="grid h-dvh place-items-center">
      <RegisterForm />
    </section>
  );
};

export default page;
