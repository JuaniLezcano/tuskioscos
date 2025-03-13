import { User } from '@/types'
import React from 'react'

interface UserProps{
    user: User;
}

export default async function Header({ user }: UserProps) {
    return (
        <div>Header</div>
    )
}
