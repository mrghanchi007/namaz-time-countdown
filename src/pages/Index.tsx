import { useState, useEffect } from "react";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CitySelector } from "@/components/CitySelector";
import { IslamicDateDisplay } from "@/components/IslamicDateDisplay";
import { Settings } from "@/components/Settings";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import islamicHeroBg from "@/assets/islamic-hero-bg.jpg";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("Karachi");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { prayerTimes, nextPrayer } = usePrayerTimes(selectedCity);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Show install popup after 10 seconds
  useEffect(() => {
    if (deferredPrompt) {
      const timer = setTimeout(() => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
        if (!isInstalled && deferredPrompt) {
          // Show install popup
          const installPopup = document.createElement('div');
          installPopup.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-width: 300px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: hsl(var(--foreground)); font-size: 14px; font-weight: 600;">Install Prayer Times App</h3>
                <button id="close-install" style="background: none; border: none; color: hsl(var(--muted-foreground)); cursor: pointer; font-size: 18px;">&times;</button>
              </div>
              <p style="margin: 0 0 12px 0; color: hsl(var(--muted-foreground)); font-size: 12px;">Get quick access to prayer times</p>
              <button id="install-app" style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; width: 100%;">Install App</button>
            </div>
          `;
          document.body.appendChild(installPopup);
          
          document.getElementById('install-app')?.addEventListener('click', () => {
            handleInstallApp();
            document.body.removeChild(installPopup);
          });
          
          document.getElementById('close-install')?.addEventListener('click', () => {
            document.body.removeChild(installPopup);
          });
        }
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt]);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${islamicHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-islamic-deep-blue/80 to-islamic-deep-blue/60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
            Prayer Times
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-4">
            Islamic Prayer Schedule for Pakistan
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <CitySelector 
              selectedCity={selectedCity} 
              onCityChange={setSelectedCity} 
            />
            <Settings />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Prayer Times */}
          <div className="lg:col-span-2">
            <PrayerTimesCard prayerTimes={prayerTimes} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 SM:space-y-6">
            {/* Countdown Timer */}
            {nextPrayer && (
              <CountdownTimer 
                targetTime={nextPrayer.time} 
                prayerName={nextPrayer.name} 
              />
            )}

            {/* Date Display */}
            <IslamicDateDisplay currentDate={currentTime} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 py-6 border-t border-border/50">
          <p className="text-muted-foreground text-sm mb-2">
            🕌 May Allah accept your prayers
          </p>
          <p className="text-muted-foreground text-xs">
            Design by Account4Web Inc
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
