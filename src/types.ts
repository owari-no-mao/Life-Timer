export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm (defaults to 12:00)
  targetAge: number; // e.g. 85
  sleepHoursPerDay: number; // e.g. 7.5
  workHoursPerDay: number; // e.g. 8
  workDaysPerWeek: number; // e.g. 5
  parentBirthYear?: number; // default 1975
  parentAge?: number; // calculated from birth year or custom
  parentVisitsPerYear?: number;
  booksPerYear?: number;
  favoriteSeason?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface CustomPerspectiveMetric {
  id: string;
  title: string;
  frequencyPerYear: number;
  unit: string;
  category: string;
  iconName: string;
  notes?: string;
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

  // True free time (without sleep & work until target retirement or life)
  freeHoursRemaining: number;
  
  // Real-time micro fractions for animation
  todayProgressPercentage: number;
  yearProgressPercentage: number;
  decadeProgressPercentage: number;

  // Perspective counts
  weekendsRemaining: number;
  summersRemaining: number;
  springsRemaining: number;
  autumnsRemaining: number;
  wintersRemaining: number;
  worldCupsRemaining: number;
  olympicsRemaining: number;
  fullMoonsRemaining: number;
  parentVisitsRemaining: number;
  booksRemainingToRead: number;
}

export type ActiveTab = 'dashboard' | 'grid4000' | 'perspectives';
