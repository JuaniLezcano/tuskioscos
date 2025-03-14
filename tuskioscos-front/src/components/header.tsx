"use client";
import { User } from '@/types';
import React, { useState } from 'react';
import { ProfileImage } from "./profileImage";
import { HeaderUser } from "./headerUser";
import { FiHome } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';

interface UserProps {
  user: User;
}

export default function Header({ user }: UserProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className='bg-gray-custom shadow-sm'>
      <div className='max-w-full mx-auto py-4 px-6 flex items-center justify-between'>
        <div className="flex items-center">
          {pathname !== '/dashboard' && (
            <button onClick={navigateToDashboard} className="mr-4">
              <FiHome className="text-2xl" />
            </button>
          )}
        </div>
        <div className='flex items-center justify-end' onClick={toggleMenu}>
          <ProfileImage name={user.name} />
        </div>
      </div>
      {isMenuOpen && (
        <div className='absolute right-6 top-16'>
          <HeaderUser name={user.name} />
        </div>
      )}
    </div>
  );
}