import { useState, useEffect } from "react";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CitySelector } from "@/components/CitySelector";
import { IslamicDateDisplay } from "@/components/IslamicDateDisplay";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import islamicHeroBg from "@/assets/islamic-hero-bg.jpg";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("Karachi");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { prayerTimes, nextPrayer } = usePrayerTimes(selectedCity);

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
          <div className="flex justify-center">
            <CitySelector 
              selectedCity={selectedCity} 
              onCityChange={setSelectedCity} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prayer Times */}
          <div className="lg:col-span-2">
            <PrayerTimesCard prayerTimes={prayerTimes} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
          <p className="text-muted-foreground text-sm">
            🕌 May Allah accept your prayers • Prayer times calculated using Karachi method
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
