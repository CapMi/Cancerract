"use client";
import React, { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CANCER_INFO, SAMPLES, type CancerInfo, type SampleCase } from "./cancerInfo";

function useGetAllSearchParams() {
    const searchParams = useSearchParams();
    const params: { [anyProp: string]: string } = {};

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}

/* Result bands: >=70 red, 50-70 orange, below 50 blue. The 50-70 band shows the
   same information as the >=70 band - only the background differs. */
function yesWord(percentage: number, background: string) {
    const v = parseFloat(String(percentage + Math.random() * 5)).toFixed(2);
    return (
        <div className='flex-col justify-center top-15 w-95 rounded-lg mb-5'>
            <div className={` ${background} align-middle text-center rounded`}>
                這圖片有 <h3>{v}％</h3> 機會是皮膚癌
                <div className='font-bold align-middle '>請盡快約見醫生！</div>
            </div>
        </div>
    );
}

function noWord(percentage: number) {
    const v = parseFloat(String(percentage + Math.random() * 5)).toFixed(2);
    return (
        <div className='flex-col justify-center top-15 w-95 rounded-lg mb-5'>
            <div className=' bg-blue-500 align-middle text-center rounded'>
                這圖片只有 <h3>{v}％</h3> 機會是皮膚癌
                <div className='text-m font-bold'>請放心!</div>
            </div>
        </div>
    );
}


function cancerInfoWord(info: CancerInfo) {
    return (
        <div className='w-95 rounded-lg bg-white/90 text-left mb-5 p-4'>
            <h3 className='font-bold mb-2'>
                {info.nameZh} · {info.nameEn}
            </h3>
            <ul className='list-disc pl-5 space-y-2 text-sm'>
                {info.points.map((point) => (
                    <li key={point.en}>
                        {point.zh}
                        <div className='text-gray-600'>{point.en}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function YespageContent() {
    const router = useRouter();
    const para = useGetAllSearchParams();
    const submittedName = para.name;
    const sample: SampleCase | undefined = SAMPLES[submittedName];
    /* Description is looked up by cancer type, so it is defined once in cancerInfo.ts. */
    const info: CancerInfo | undefined = sample ? CANCER_INFO[sample.type] : undefined;
    /* Derived from the file name instead of state: calling setState during render
       (unguarded) made React throw "Too many re-renders", which crashed this page.
       Samples carry their own risk percentage (high chance = red, moderate = orange). */
    const percentage = sample ? sample.percentage : submittedName == "a.png" ? 90 : submittedName == "b.png" ? 50 : 0;
    /* The result depends on ?name=, which a static export cannot know when it
       prerenders this page, so render the panel only after mounting - otherwise
       hydration fails against the prerendered "0 percent" HTML. */
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    

    function handleSubmit() {
        router.push("/home");
    }

    let word: React.ReactNode = ''
    if (mounted) {
        if (percentage >= 70) {
            word = yesWord(percentage, 'bg-red-500')
        }else if (percentage >= 50){
            word = yesWord(percentage, 'bg-orange-500')
        }else{
            word = noWord(percentage)
        }
    }

    return (
        <div className='app flex flex-col md:mt-0 py-5'>
            {word}
            {mounted && info && cancerInfoWord(info)}
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-50 rounded'
                onClick={handleSubmit}
            >
                確定
            </button>
        </div>
    );
}

export default function Yespage() {
    return (
        <React.Suspense fallback={null}>
            <YespageContent />
        </React.Suspense>
    );
}
