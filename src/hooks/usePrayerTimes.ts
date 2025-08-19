import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
import { format } from "date-fns";
import { pakistaniCities } from "@/components/CitySelector";

interface PrayerTime {
  name: string;
  time: string;
  date: Date;
  isActive: boolean;
  isPassed: boolean;
}

export const usePrayerTimes = (cityName: string) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);

  useEffect(() => {
    const calculatePrayerTimes = () => {
      const city = pakistaniCities.find(c => c.name === cityName);
      if (!city) return;

      const coordinates = new Coordinates(
        city.coordinates.latitude,
        city.coordinates.longitude
      );
      
      const date = new Date();
      const params = CalculationMethod.Karachi(); // Use Karachi method for Pakistan
      const prayers = new PrayerTimes(coordinates, date, params);

      const prayerSchedule = [
        { name: "Fajr", time: prayers.fajr },
        { name: "Dhuhr", time: prayers.dhuhr },
        { name: "Asr", time: prayers.asr },
        { name: "Maghrib", time: prayers.maghrib },
        { name: "Isha", time: prayers.isha },
      ];

      const now = new Date();
      const currentPrayerIndex = prayerSchedule.findIndex((prayer, index) => {
        const nextPrayerTime = prayerSchedule[index + 1]?.time || 
          // If it's the last prayer, check against tomorrow's Fajr
          new Date(prayers.fajr.getTime() + 24 * 60 * 60 * 1000);
        return now >= prayer.time && now < nextPrayerTime;
      });

      const formattedPrayerTimes: PrayerTime[] = prayerSchedule.map((prayer, index) => ({
        name: prayer.name,
        time: format(prayer.time, "h:mm a"),
        date: prayer.time,
        isActive: index === currentPrayerIndex,
        isPassed: now > prayer.time && index !== currentPrayerIndex,
      }));

      setPrayerTimes(formattedPrayerTimes);

      // Find next prayer
      const nextPrayerIndex = prayerSchedule.findIndex(prayer => prayer.time > now);
      if (nextPrayerIndex !== -1) {
        setNextPrayer({
          name: prayerSchedule[nextPrayerIndex].name,
          time: prayerSchedule[nextPrayerIndex].time,
        });
      } else {
        // Next prayer is tomorrow's Fajr
        const tomorrowCoordinates = new Coordinates(
          city.coordinates.latitude,
          city.coordinates.longitude
        );
        const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowPrayers = new PrayerTimes(tomorrowCoordinates, tomorrow, params);
        
        setNextPrayer({
          name: "Fajr",
          time: tomorrowPrayers.fajr,
        });
      }
    };

    calculatePrayerTimes();
    const interval = setInterval(calculatePrayerTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [cityName]);

  return { prayerTimes, nextPrayer };
};