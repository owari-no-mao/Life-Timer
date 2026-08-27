export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm (defaults to 12:00)
  targetAge: number; // e.g. 85
  sleepHoursPerDay: number; // e.g. 7.5
}

export interface LifeCalculations {
  exactAgeYears: number;
  daysLived: number;
  daysRemaining: number;
  totalDays: number;
  
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;

  hoursLived: number;
  hoursRemaining: number;
  totalHours: number;

  minutesRemaining: number;
  secondsRemaining: number;

  percentageLived: number;
  percentageRemaining: number;

  // Conscious waking time (without sleep)
  wakingHoursRemaining: number;
  wakingDaysRemaining: number;
  sleepHoursRemaining: number;
  
  // Real-time micro fractions
  todayProgressPercentage: number;
  yearProgressPercentage: number;
}
