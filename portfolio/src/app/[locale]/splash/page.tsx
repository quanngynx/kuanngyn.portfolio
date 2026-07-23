'use client';
import { SplashScreen } from '@/common/components/templates/splash-screen';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Splash() {
    const router = useRouter();
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? '';
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check if splash was already shown in this session
        const splashShown = sessionStorage.getItem("splashShown");
        
        if (splashShown === "true") {
            router.replace(`/${locale}`);
        } else {
            sessionStorage.setItem("splashShown", "true");
            setIsChecking(false);
            
            const timeoutId = setTimeout(() => {
                router.replace(`/${locale}`);
            }, 3000);

            return () => clearTimeout(timeoutId);
        }
    }, [router, locale]);

    if (isChecking) {
        // Return blank container with same background color to prevent flash
        return <div className="min-h-screen bg-[#15161a]" />;
    }

    return (
        <SplashScreen onComplete={() => {}} shouldShow={true} />
    );
}
