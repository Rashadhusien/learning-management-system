// import Image from "next/image";
import Image from "next/image";
import React, { ReactNode } from "react";

// import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen relative items-center justify-center  bg-cover bg-center bg-no-repeat px-4 py-10">
      <section className=" min-w-full rounded-[10px]  px-4 py-10  sm:min-w-[520px] sm:px-8">
        {/* <div className="flex-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900">
              Join Dev<span className="text-primary-500">Flow</span>
            </h1>
            <p className="paragraph-regular text-dark500_light400">
              To get your questions answerd
            </p>
          </div>
           <Image
            src={"/images/site-logo.svg"}
            alt="DevFlow Logo"
            width={50}
            height={50}
            className="object-contain"
          /> 
        </div> */}
        <Image
          src={"/images/auth-background.png"}
          alt="Auth Background"
          fill
          objectFit="cover"
          objectPosition="center"
          quality={75}
          className="object-cover  absolute top-0 left-0 -z-20"
        />
        {/* dark layer */}
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-black opacity-70"></div>
        {children}
        {/* <div className="border mt-4 border-white dark:border-dark-400 relative">
          <span className="absolute top-1/2 left-1/2 transform -translate-1/2 p-2 background-light800_dark200 rounded-full">
            or
          </span>
        </div> */}
        {/* <SocialAuthForm /> */}
      </section>
    </main>
  );
};

export default AuthLayout;
