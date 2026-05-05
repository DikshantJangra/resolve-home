import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
          <div className="relative h-9 w-[102px]">
            <Image
              src="/resolve_home.svg"
              alt="Resolve Home"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          <Link href="/" className="text-[15px] font-semibold text-blue-700">
            Home
          </Link>
          <Link href="#services" className="text-[15px] font-medium text-zinc-600 transition-colors hover:text-zinc-900">
            Services
          </Link>
          <Link href="#how-it-works" className="text-[15px] font-medium text-zinc-600 transition-colors hover:text-zinc-900">
            How It Works
          </Link>
          <Link href="#membership" className="text-[15px] font-medium text-zinc-600 transition-colors hover:text-zinc-900">
            Membership
          </Link>
          <Link href="#faq" className="text-[15px] font-medium text-zinc-600 transition-colors hover:text-zinc-900">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="#faq">
            <button className="h-[42px] rounded-[12px] border border-blue-700 bg-transparent px-6 text-[14px] font-semibold text-blue-700 transition-colors hover:bg-blue-50">
              Log In
            </button>
          </Link>
          <Link href="#membership">
            <button className="h-[42px] rounded-[12px] bg-blue-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

