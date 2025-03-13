import { User } from '@/types'
import React from 'react'
import ProfileImage from "./profileImage";

interface UserProps{
    user: User;
}

export default async function Header({ user }: UserProps) {
    return (
        <div className='bg-gray-custom shadow-sm'>
            <div className='max-w-full mx-auto py-4 px-6'>
                <div className='flex items-center justify-end'>
                    <ProfileImage name={user.name} />
                </div>
            </div>
        </div>
    )
}
