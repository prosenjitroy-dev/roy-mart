"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { toast } from "react-toastify";

import { Button, buttonVariants } from "@/components/shadcnui/button";
import { signOut, useSession } from "@/lib/auth-client";

const SessionPanel = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return null;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}>
          Sign in
        </Link>
        <Link href="/sign-up" className={buttonVariants()}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{session.user.email}</span>
      </p>
      <Button
        variant="outline"
        onClick={async () => {
          await signOut();
          toast.success("Signed out");
          router.push("/");
          router.refresh();
        }}>
        <HiOutlineArrowRightOnRectangle
          data-icon="inline-start"
          aria-hidden="true"
        />
        Sign out
      </Button>
    </div>
  );
};

export default SessionPanel;
