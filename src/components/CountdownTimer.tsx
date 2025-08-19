import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetTime: Date;
  prayerName: string;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetTime, prayerName }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-primary rounded-lg p-4 shadow-prayer border border-primary/30 min-w-[80px]">
        <div className="text-2xl md:text-3xl font-bold text-primary-foreground font-mono text-center">
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      <span className="text-sm text-muted-foreground mt-2 font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="p-6 text-center">
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Time until</span>
          <h2 className="text-2xl font-semibold text-islamic-gold">
            {prayerName}
          </h2>
        </div>
        
        <div className="flex justify-center gap-4 md:gap-6">
          <TimeBlock value={timeRemaining.hours} label="Hours" />
          <div className="flex flex-col justify-center">
            <span className="text-2xl text-primary font-bold">:</span>
          </div>
          <TimeBlock value={timeRemaining.minutes} label="Minutes" />
          <div className="flex flex-col justify-center">
            <span className="text-2xl text-primary font-bold">:</span>
          </div>
          <TimeBlock value={timeRemaining.seconds} label="Seconds" />
        </div>
        
        {timeRemaining.hours === 0 && timeRemaining.minutes < 30 && (
          <div className="mt-4 p-3 bg-islamic-gold/10 rounded-lg border border-islamic-gold/30">
            <p className="text-islamic-gold text-sm font-medium">
              🕌 Prayer time approaching
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};