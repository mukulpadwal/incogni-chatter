"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <header>
      <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">
            Incogni Chatter
          </a>
          {session ? (
            <div className="flex flex-row justify-center items-center space-x-4">
              <span className="mr-4 w-full">
                Welcome <strong>{user?.username || user?.email}</strong>
              </span>
              <Button className="w-full md:m-auto" onClick={() => signOut}>
                Logout
              </Button>{" "}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center space-x-4">
              <Link href={"/sign-in"}>
                <Button className="w-full md:m-auto">Login</Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button className="w-full md:m-auto">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
