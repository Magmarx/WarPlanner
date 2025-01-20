'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import Tesseract, { ImageLike } from 'tesseract.js';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import champList from '../assets/champList.json';

interface Champion {
    Profile: string;
    fullChampionProfile: string;
    Champion: string;
    ReleaseDate: string;
    Class: string;
}

const extractChampionsFromText = (text: string, champList: Champion[]): Champion[] => {
    /**
     * List of champs that known to not be recognized (Will be a good idea for a suggestion feature)
     * Spider-Ham
     * 
     * Another found issue is that sometimes it duplicates entries with
     * similar named champs
     * Omega Sentinel -> Sentinel
     * Man-Thing -> Thing
     * Guillotine 2099 -> Guillotine
     * 
     * With Using Tesseract this might be unavoidable
     */
    const UpperCaseText = text.toUpperCase();
    return champList.filter(champion => 
        UpperCaseText.includes(champion.Champion.toUpperCase())
    );
};

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [foundChampions, setFoundChampions] = useState<Champion[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const storeChampionsInFirebase = async (champions: Champion[]) => {
        try {
            const warData = {
                champions: champions,
                timestamp: Timestamp.now(),
                imageProcessed: true
            };
            
            const docRef = await addDoc(collection(db, 'wars'), warData);
            console.log('War data stored with ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error storing war data: ', error);
            throw error;
        }
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        setIsProcessing(true);
        setError(null);
        
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as ImageLike;
                const { data: { text } } = await Tesseract.recognize(
                    base64,
                    'eng',
                    {
                        logger: info => console.log(info)
                    }
                );
                
                const champions = extractChampionsFromText(text, champList.champList);
                setFoundChampions(champions);
                
                if (champions.length > 0) {
                    await storeChampionsInFirebase(champions);
                }
                
                setIsProcessing(false);
            };
            
            reader.onerror = () => {
                setError('Error reading file');
                setIsProcessing(false);
            };
            
            reader.readAsDataURL(file);
            setImage(file);
        } catch (error) {
            setError('Error processing image');
            setIsProcessing(false);
            console.error('Error:', error);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <nav className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-black">War Planner</h1>
                    <Link href="/champions" className="text-blue-500 hover:underline">
                        View All Champions →
                    </Link>
                </nav>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-black">Upload Screenshot</h2>
                    <div className="mb-6">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            disabled={isProcessing}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                disabled:opacity-50"
                        />
                    </div>

                    {isProcessing && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Processing image...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {foundChampions.length > 0 && !isProcessing && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3 text-black">Found Champions:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {foundChampions.map((champion, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                        <div className="relative w-8 h-8">
                                            <Image 
                                                src={champion.Profile}
                                                alt={champion.Champion}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <span className="text-black">{champion.Champion}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
