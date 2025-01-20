'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    const [nameFilter, setNameFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get unique classes for the dropdown
    const uniqueClasses = useMemo(() => {
        const classes = new Set(champList.champList.map(champ => champ.Class));
        return Array.from(classes).sort();
    }, []);

    // Filter champions based on name and class
    const filteredChampions = useMemo(() => {
        return (champList.champList as Champion[]).filter(champion => {
            const nameMatch = champion.Champion.toLowerCase().includes(nameFilter.toLowerCase());
            const classMatch = !classFilter || champion.Class === classFilter;
            return nameMatch && classMatch;
        });
    }, [nameFilter, classFilter]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
            </div>
            <h1 className="text-2xl font-bold mb-6">Champions List</h1>
            
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700 mb-1">
                        Search by Name
                    </label>
                    <input
                        type="text"
                        id="nameFilter"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        placeholder="Search champions..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Class
                    </label>
                    <select
                        id="classFilter"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Classes</option>
                        {uniqueClasses.map(className => (
                            <option key={className} value={className}>
                                {className}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredChampions.length} champions
            </div>

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
                        {filteredChampions.map((champion, index) => (
                            <tr key={`${champion.Champion}-${index}`} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b">
                                    <div className="flex items-center text-black">
                                        <div className="relative w-8 h-8 mr-3">
                                            <Image 
                                                src={cleanImageUrl(champion.Profile)}
                                                alt={champion.Champion}
                                                fill
                                                className="rounded-full object-cover"
                                                unoptimized
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
