
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is a fallback. Users should be navigated to the configuration page instead.
export default function MasterDataIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/configuration");
    }, [router]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <p>Redirecting to the Configuration page...</p>
        </div>
    );
}
