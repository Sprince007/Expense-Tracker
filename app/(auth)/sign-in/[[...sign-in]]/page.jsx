"use client"; // This marks the file as a Client Component

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side navigation
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard'); // Redirect to the dashboard page
    }
  }, [isSignedIn, isLoaded, router]);

  // Don't render the SignIn component if the user is already signed in
  if (!isLoaded || isSignedIn) {
    return null; // or you can return a loading spinner or something
  }

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://plus.unsplash.com/premium_photo-1681760172620-98a67f93b08a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome!
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Tired of losing track of where your money goes? Let's embark on an exciting expedition to uncover the secrets of your spending and unlock a future of financial freedom!
            </p>
          </div>
        </section>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
               
              </a>

              <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome!
              </h2>

              <p className="mt-4 leading-relaxed text-gray-500">
                Tired of losing track of where your money goes? Let's embark on an exciting expedition to uncover the secrets of your spending and unlock a future of financial freedom!
              </p>
            </div>

            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>
        </main>
      </div>
    </section>
  );
}
