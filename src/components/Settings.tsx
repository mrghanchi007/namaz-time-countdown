import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  islamicDateOffset: number;
  fiqh: 'hanafi' | 'shafee';
  jamatTimes: {
    [key: string]: string;
  };
}

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    islamicDateOffset: 0,
    fiqh: 'hanafi',
    jamatTimes: {}
  });
  const { toast } = useToast();

  const prayerNames = ["Fajr", "Dhuhr", "Jummah", "Asr", "Maghrib", "Isha"];

  useEffect(() => {
    const savedSettings = localStorage.getItem('prayerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('prayerSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
    setIsOpen(false);
    // Reload page to apply changes
    window.location.reload();
  };

  const updateIslamicDateOffset = (offset: number) => {
    setSettings(prev => ({
      ...prev,
      islamicDateOffset: Math.max(-3, Math.min(3, offset))
    }));
  };

  const updateJamatTime = (prayer: string, time: string) => {
    setSettings(prev => ({
      ...prev,
      jamatTimes: {
        ...prev.jamatTimes,
        [prayer]: time
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-secondary/50 border-border/50 hover:bg-secondary/70">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-card border-border/50 max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-islamic-gold flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Prayer Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Fiqh Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Fiqh Method</Label>
            <p className="text-sm text-muted-foreground">
              Select your preferred fiqh for prayer time calculations
            </p>
            <Select value={settings.fiqh} onValueChange={(value: 'hanafi' | 'shafee') => setSettings(prev => ({ ...prev, fiqh: value }))}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select Fiqh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hanafi">Hanafi</SelectItem>
                <SelectItem value="shafee">Shafee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Islamic Date Offset */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Islamic Date Adjustment</Label>
            <p className="text-sm text-muted-foreground">
              Adjust Islamic date for Pakistan (+3 to -3 days)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateIslamicDateOffset(settings.islamicDateOffset - 1)}
                disabled={settings.islamicDateOffset <= -3}
                className="px-3"
              >
                -
              </Button>
              <div className="flex-1 text-center">
                <span className="text-lg font-mono text-islamic-gold">
                  {settings.islamicDateOffset > 0 ? '+' : ''}{settings.islamicDateOffset} days
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateIslamicDateOffset(settings.islamicDateOffset + 1)}
                disabled={settings.islamicDateOffset >= 3}
                className="px-3"
              >
                +
              </Button>
            </div>
          </div>

          {/* Jamat Times */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Jamat Times</Label>
            <p className="text-sm text-muted-foreground">
              Set congregation times for your nearby mosque
            </p>
            <div className="space-y-3">
              {prayerNames.map((prayer) => (
                <div key={prayer} className="flex items-center gap-3">
                  <Label className="w-16 text-sm">{prayer}</Label>
                  <Input
                    type="time"
                    value={settings.jamatTimes[prayer] || ""}
                    onChange={(e) => updateJamatTime(prayer, e.target.value)}
                    className="flex-1 bg-secondary/50 border-border/50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveSettings} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};