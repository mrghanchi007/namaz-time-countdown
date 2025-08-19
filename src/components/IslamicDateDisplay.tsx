import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface IslamicDateDisplayProps {
  currentDate: Date;
}

export const IslamicDateDisplay = ({ currentDate }: IslamicDateDisplayProps) => {
  const formatGregorianDate = (date: Date) => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm:ss a");
  };

  // Simple Islamic date approximation (this is basic - for production use proper Islamic calendar library)
  const getApproximateIslamicDate = (date: Date) => {
    const islamicMonths = [
      "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
      "Jumada al-awwal", "Jumada al-thani", "Rajab", "Sha'ban",
      "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    
    // This is a simplified approximation - real Islamic calendar calculation is more complex
    const islamicEpoch = new Date('622-07-16');
    const daysSinceEpoch = Math.floor((date.getTime() - islamicEpoch.getTime()) / (1000 * 60 * 60 * 24));
    const islamicYear = Math.floor(daysSinceEpoch / 354.37) + 1; // Islamic year is approximately 354.37 days
    const dayOfYear = Math.floor(daysSinceEpoch % 354.37);
    const islamicMonth = Math.floor(dayOfYear / 29.53); // Islamic month is approximately 29.53 days
    const dayOfMonth = Math.floor(dayOfYear % 29.53) + 1;
    
    return `${dayOfMonth} ${islamicMonths[islamicMonth] || 'Muharram'} ${islamicYear} AH`;
  };

  return (
    <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-islamic-gold" />
            <span className="text-lg font-semibold text-foreground">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-mono text-islamic-gold">
              {formatTime(currentDate)}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Gregorian Calendar</span>
            <p className="text-lg font-medium text-foreground">
              {formatGregorianDate(currentDate)}
            </p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Islamic Calendar (Approx.)</span>
            <p className="text-lg font-medium text-islamic-gold">
              {getApproximateIslamicDate(currentDate)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};