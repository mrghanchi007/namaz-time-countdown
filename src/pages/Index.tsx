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
            <div className="flex gap-2">
              <Settings />
              {deferredPrompt && (
                <Button 
                  onClick={handleInstallApp}
                  variant="outline" 
                  size="sm"
                  className="bg-secondary/50 border-border/50 hover:bg-secondary/70"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
              )}
            </div>
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
            🕌 May Allah accept your prayers • Prayer times calculated using Karachi method
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
