import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[40%_60%]">
      <div className="flex flex-col justify-center px-8 lg:px-20 bg-white">
        {children}
      </div>

      <div className="hidden lg:block relative">
        <Image
          src="/JES_CoverImage.png"
          alt="JES Cover"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
