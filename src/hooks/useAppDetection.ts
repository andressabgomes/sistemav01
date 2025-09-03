import { useState, useEffect } from 'react';

interface AppInfo {
  name: string;
  version: string;
  platform: string;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPWA: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
}

export const useAppDetection = (): AppInfo => {
  const [appInfo, setAppInfo] = useState<AppInfo>({
    name: 'StarPrint CRM',
    version: '1.0.0',
    platform: 'unknown',
    userAgent: navigator.userAgent,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPWA: false,
    isStandalone: false,
    isOnline: navigator.onLine,
  });

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
      const isTablet = /tablet|ipad/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;

      let platform = 'unknown';
      if (/windows/i.test(userAgent)) platform = 'Windows';
      else if (/macintosh|mac os x/i.test(userAgent)) platform = 'macOS';
      else if (/linux/i.test(userAgent)) platform = 'Linux';
      else if (/android/i.test(userAgent)) platform = 'Android';
      else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'iOS';

      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      const isStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone || false;

      setAppInfo(prev => ({
        ...prev,
        platform,
        isMobile,
        isTablet,
        isDesktop,
        isPWA,
        isStandalone,
      }));
    };

    const handleOnlineStatusChange = () => {
      setAppInfo(prev => ({
        ...prev,
        isOnline: navigator.onLine,
      }));
    };

    const detectNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
        if (connection) {
          setAppInfo(prev => ({
            ...prev,
            connectionType: connection.effectiveType,
            effectiveType: connection.effectiveType,
          }));
        }
      }
    };

    detectPlatform();
    detectNetworkInfo();

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return appInfo;
};