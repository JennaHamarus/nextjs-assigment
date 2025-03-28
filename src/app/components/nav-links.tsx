'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Today', href: '/thisday'},
  {name: 'Next Day', href: '/thisday/nextday'},
  { name: 'Search', href: '/thisday/search'},
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-black p-3 text-sm text-white border border-teal-100 font-medium hover:bg-teal-950 hover:text-white  md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-teal-950 text-black': pathname === link.href,
              },
            )}
          >
            <p className="block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
