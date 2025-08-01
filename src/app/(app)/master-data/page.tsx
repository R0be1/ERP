
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated and its contents have been moved to the /configuration page.
// We are redirecting users to the new location.
export default function DeprecatedMasterDataPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/configuration");
    }, [router]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <p>Redirecting to the new Configuration page...</p>
        </div>
    );
}
