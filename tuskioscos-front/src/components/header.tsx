"use client"
import { User } from '@/types'
import React, { useState } from 'react'
import { ProfileImage } from "./profileImage";
import { HeaderUser } from "./headerUser"

interface UserProps{
    user: User;
}

export default function Header({ user }: UserProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className='bg-gray-custom shadow-sm'>
            <div className='max-w-full mx-auto py-4 px-6'>
                <div className='flex items-center justify-end' onClick={toggleMenu}>
                    <ProfileImage name={user.name} />
                </div>
                {isMenuOpen && (
                <div className='absolute right-6 top-16'>
                    <HeaderUser name={user.name} />
                </div>
                )}
            </div>
        </div>
    )
}
