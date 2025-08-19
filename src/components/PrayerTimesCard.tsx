import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PrayerTime {
  name: string;
  time: string;
  isActive: boolean;
  isPassed: boolean;
  isProhibited?: boolean;
  jamatTime?: string;
}

interface PrayerTimesCardProps {
  prayerTimes: PrayerTime[];
}

export const PrayerTimesCard = ({ prayerTimes }: PrayerTimesCardProps) => {
  return (
    <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
          Prayer Times
        </h3>
        <div className="space-y-3">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
                prayer.isProhibited
                  ? "bg-destructive/20 border border-destructive/50 shadow-md"
                  : prayer.isActive
                  ? "bg-gradient-primary shadow-prayer border border-primary/30"
                  : prayer.isPassed
                  ? "bg-muted/30 opacity-60"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    prayer.isProhibited
                      ? "bg-destructive animate-pulse"
                      : prayer.isActive
                      ? "bg-islamic-gold animate-pulse"
                      : prayer.isPassed
                      ? "bg-muted-foreground/50"
                      : "bg-primary/70"
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    prayer.isActive
                      ? "text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {prayer.name}
                </span>
                {prayer.isProhibited && (
                  <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/50">
                    No Prayer
                  </Badge>
                )}
                {prayer.isActive && !prayer.isProhibited && (
                  <Badge variant="secondary" className="bg-islamic-gold/20 text-islamic-gold border-islamic-gold/30">
                    Current
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "font-mono text-lg block",
                    prayer.isProhibited
                      ? "text-destructive font-semibold"
                      : prayer.isActive
                      ? "text-primary-foreground font-semibold"
                      : "text-foreground"
                  )}
                >
                  {prayer.time}
                </span>
                {prayer.jamatTime && !prayer.isProhibited && (
                  <span className="text-xs text-islamic-gold font-mono">
                    Jamat: {prayer.jamatTime}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};