"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

function HomepageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedName, setSelectedName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(null);
            return;
        }

        const file = e.target.files[0];
        setSelectedFile(file);
        setSelectedName(file.name);
        // Additional validation logic
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    function handleSubmit() {
        // if (selectedName == "a.") {
        //     console.log("a");
        // }else{
        // }
        console.log("clicked");
        // const query = new URLSearchParams({
        // }).toString();
        // router.push("/yes");
        router.push(
            "/yes" + "?" + createQueryString("name", selectedName)
            // "/yes" + "?" + createQueryString("image", selectedFile) + "&" + createQueryString("name", selectedName)
        );
    }
    return (
        <div className='flex justify-center '>
            <div className='absolute flex-col justify-center top-15 w-95 rounded-lg bg-green-word'>
                <div className='file-upload'>
                    <h1 className="text-white"> {"按此上載你的圖片"}</h1>
                    <p>檔案最大 10mb</p>
                    <input type='file' onChange={handleFileChange} />
                </div>

                <div className='flex flex-col'>
                    <div className='m-3'>{selectedFile && <img src={URL.createObjectURL(selectedFile)} />}</div>
                    {selectedFile && (
                        <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                            onClick={handleSubmit}
                        >
                            確定
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Homepage() {
    return (
        <React.Suspense fallback={null}>
            <HomepageContent />
        </React.Suspense>
    );
}
