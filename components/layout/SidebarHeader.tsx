'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Home, PenLine, Calendar, MessageSquare, BarChart, Plus , LogOut,} from 'lucide-react';
import { PostComposer } from '@/components/ui/PostComposer/PostComposer';
  

const navItems = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Create', href: '/create', icon: PenLine },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Posts', href: '/posts', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
];

const dropdownItems = [
    { name: 'New Post', href: '/create/post' },
    { name: 'New Schedule', href: '/schedule' },
];

export default function SidebarHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNewPost = () => {
        setIsOpen(false);
        setIsComposerOpen(true);
    };

    return (
        <header className="flex flex-col gap-4 p-4 border-b border-gray-200">

            <div className="flex items-center justify-between">

                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                    >
                        <Plus size={16} strokeWidth={2.2} />
                        New
                    </button>

                    {isOpen && (
                        <div className="absolute left-0 mt-2 w-48 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                                <button
                                    onClick={handleNewPost}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >

                                    <Plus size={16} strokeWidth={2.2} />
                                    New Post
                                </button>
                                {dropdownItems.slice(1).map(({ name, href }) => (
                                    <Link
                                        key={name}
                                        href={href}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Calendar size={16} strokeWidth={2.2} />
                                        {name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <nav>
                <ul className="space-y-1">
                    {navItems.map(({ name, href, icon: Icon }) => (
                        <li key={name}>
                            <Link
                                href={href}
                                className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <Icon size={18} className="text-gray-500" />
                                <span>{name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <PostComposer isOpen={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
        </header>
    );
}