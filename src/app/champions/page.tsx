'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import champList from '../../assets/champList.json';
import { cleanImageUrl } from '../../utils/imageUtils';

interface Champion {
    Champion: string;
    Class: string;
    Profile: string;
    fullChampionProfile: string;
    ReleaseDate: string;
}

export default function ChampionsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
            </div>
            <h1 className="text-2xl font-bold mb-6">Champions List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b text-left text-black">Champion</th>
                            <th className="px-6 py-3 border-b text-left text-black">Class</th>
                            <th className="px-6 py-3 border-b text-left text-black">Release Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(champList.champList as Champion[]).map((champion, index) => (
                            <tr key={`${champion.Champion}-${index}`} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b">
                                    <div className="flex items-center text-black">
                                        <div className="relative w-8 h-8 mr-3">
                                            <Image 
                                                src={cleanImageUrl(champion.Profile)}
                                                alt={champion.Champion}
                                                fill
                                                className="rounded-full object-cover"
                                                sizes="(max-width: 32px) 100vw, 32px"
                                            />
                                        </div>
                                        {champion.Champion}
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b text-black">{champion.Class}</td>
                                <td className="px-6 py-4 border-b text-black">{champion.ReleaseDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
