import Link from 'next/link';
import NavLinks from './nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-black border border-teal-100 p-4 md:h-40"
        href="/thisday"
>
        <div className="w-32 text-3xl text-white font-medium md:w-40 text-center">
          Stock Electricity
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col  md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-black border border-teal-100 md:block"></div>
      </div>
    </div>
  )};