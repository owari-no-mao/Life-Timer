import { UserProfile, LifeCalculations } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'あなた',
  birthDate: '2001-10-14',
  birthTime: '12:00',
  targetAge: 85,
  sleepHoursPerDay: 7.5,
  workHoursPerDay: 8,
  workDaysPerWeek: 5,
  parentBirthYear: 1975,
  parentAge: 51,
  parentVisitsPerYear: 3,
  booksPerYear: 12,
  favoriteSeason: 'summer',
};

export const LIFE_ERAS = [
  { startAge: 0, endAge: 6, name: '幼少期', labelEn: 'Early Childhood', color: 'text-amber-400', bgClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { startAge: 6, endAge: 12, name: '小学校時代', labelEn: 'Elementary School', color: 'text-emerald-400', bgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { startAge: 12, endAge: 18, name: '中高・青春期', labelEn: 'Adolescence & Youth', color: 'text-sky-400', bgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  { startAge: 18, endAge: 25, name: '探求と自立期', labelEn: 'Early Adulthood', color: 'text-indigo-400', bgClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { startAge: 25, endAge: 40, name: 'キャリア・挑戦期', labelEn: 'Career & Family Build', color: 'text-purple-400', bgClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { startAge: 40, endAge: 60, name: '円熟・マスタリー期', labelEn: 'Mastery & Fulfillment', color: 'text-rose-400', bgClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { startAge: 60, endAge: 75, name: '自由・探求期', labelEn: 'Wisdom & Freedom', color: 'text-yellow-400', bgClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  { startAge: 75, endAge: 100, name: '黄金・余暇期', labelEn: 'Golden Years', color: 'text-stone-300', bgClass: 'bg-stone-500/20 text-stone-300 border-stone-500/40' },
];

export function getLifeEraForAge(age: number) {
  return LIFE_ERAS.find(era => age >= era.startAge && age < era.endAge) || LIFE_ERAS[LIFE_ERAS.length - 1];
}

export interface DetailedTimeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedString: string;
}

export function calculateDetailedAge(birthDateTime: Date, now: Date = new Date()): DetailedTimeBreakdown {
  if (birthDateTime > now) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, formattedString: '0年 0ヶ月 0日 0時間 0分 0秒' };
  }

  let years = now.getFullYear() - birthDateTime.getFullYear();
  let months = now.getMonth() - birthDateTime.getMonth();
  let days = now.getDate() - birthDateTime.getDate();
  let hours = now.getHours() - birthDateTime.getHours();
  let minutes = now.getMinutes() - birthDateTime.getMinutes();
  let seconds = now.getSeconds() - birthDateTime.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const formattedString = `${years}年 ${months}ヶ月 ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
  return { years, months, days, hours, minutes, seconds, formattedString };
}

export function calculateDetailedRemaining(targetDate: Date, now: Date = new Date()): DetailedTimeBreakdown {
  if (now >= targetDate) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, formattedString: '0年 0ヶ月 0日 0時間 0分 0秒' };
  }

  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();
  let hours = targetDate.getHours() - now.getHours();
  let minutes = targetDate.getMinutes() - now.getMinutes();
  let seconds = targetDate.getSeconds() - now.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const formattedString = `${years}年 ${months}ヶ月 ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
  return { years, months, days, hours, minutes, seconds, formattedString };
}

export function calculateLifeMetrics(profile: UserProfile, now: Date = new Date()): LifeCalculations {
  const birthDateTimeStr = `${profile.birthDate}T${profile.birthTime || '12:00'}:00`;
  const birthDate = new Date(birthDateTimeStr);
  
  // If birthdate is invalid fallback to 2001-10-14
  const validBirthDate = isNaN(birthDate.getTime()) ? new Date('2001-10-14T12:00:00') : birthDate;
  
  const targetAge = Math.max(profile.targetAge || 85, 1);
  
  // Calculate target end date
  const endDate = new Date(validBirthDate.getTime());
  endDate.setFullYear(validBirthDate.getFullYear() + targetAge);

  const msLived = Math.max(0, now.getTime() - validBirthDate.getTime());
  const msTotal = Math.max(msLived, endDate.getTime() - validBirthDate.getTime());
  const msRemaining = Math.max(0, endDate.getTime() - now.getTime());

  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerYear = msPerDay * 365.2425;

  const exactAgeYears = msLived / msPerYear;
  const daysLived = msLived / msPerDay;
  const totalDays = msTotal / msPerDay;
  const daysRemaining = msRemaining / msPerDay;

  const weeksLived = daysLived / 7;
  const totalWeeks = totalDays / 7;
  const weeksRemaining = daysRemaining / 7;

  const hoursLived = msLived / (1000 * 60 * 60);
  const totalHours = msTotal / (1000 * 60 * 60);
  const hoursRemaining = msRemaining / (1000 * 60 * 60);

  const minutesRemaining = msRemaining / (1000 * 60);
  const secondsRemaining = msRemaining / 1000;

  const percentageLived = Math.min(100, Math.max(0, (msLived / msTotal) * 100));
  const percentageRemaining = Math.max(0, 100 - percentageLived);

  // Conscious waking hours calculation
  const sleepRatio = Math.min(24, Math.max(0, profile.sleepHoursPerDay || 7.5)) / 24;
  const wakingRatio = 1 - sleepRatio;
  const wakingHoursRemaining = hoursRemaining * wakingRatio;
  const wakingDaysRemaining = wakingHoursRemaining / 24;
  const sleepHoursRemaining = hoursRemaining * sleepRatio;

  // Free time calculation
  const workHoursPerWeek = (profile.workHoursPerDay || 8) * (profile.workDaysPerWeek || 5);
  const workRatioPerWeek = Math.min(1 - sleepRatio, (workHoursPerWeek) / (24 * 7));
  const yearsUntilRetirement = Math.max(0, 65 - exactAgeYears);
  const remainingWorkingHours = yearsUntilRetirement * 52 * workHoursPerWeek;
  const freeHoursRemaining = Math.max(0, wakingHoursRemaining - remainingWorkingHours);

  // Progress metrics for today, year, decade
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const msToday = now.getTime() - startOfDay;
  const todayProgressPercentage = (msToday / msPerDay) * 100;

  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1).getTime();
  const yearProgressPercentage = ((now.getTime() - startOfYear) / (endOfYear - startOfYear)) * 100;

  const currentDecadeStart = Math.floor(now.getFullYear() / 10) * 10;
  const startOfDecade = new Date(currentDecadeStart, 0, 1).getTime();
  const endOfDecade = new Date(currentDecadeStart + 10, 0, 1).getTime();
  const decadeProgressPercentage = ((now.getTime() - startOfDecade) / (endOfDecade - startOfDecade)) * 100;

  // Perspective calculations
  const weekendsRemaining = Math.floor(weeksRemaining);
  const yearsRemaining = Math.max(0, targetAge - exactAgeYears);
  
  const summersRemaining = Math.floor(yearsRemaining);
  const springsRemaining = Math.floor(yearsRemaining);
  const autumnsRemaining = Math.floor(yearsRemaining);
  const wintersRemaining = Math.floor(yearsRemaining);

  const worldCupsRemaining = Math.floor(yearsRemaining / 4);
  const olympicsRemaining = Math.floor(yearsRemaining / 2); // summer + winter cycles
  const fullMoonsRemaining = Math.floor(daysRemaining / 29.53);

  // Parent time calculation based on birth year (1975) or custom age
  const calculatedParentAge = profile.parentBirthYear 
    ? Math.max(0, now.getFullYear() - profile.parentBirthYear) 
    : (profile.parentAge ?? 51);
  const parentRemainingYears = Math.max(0, 85 - calculatedParentAge);
  const parentVisitsPerYear = profile.parentVisitsPerYear ?? 3;
  const parentVisitsRemaining = Math.floor(parentRemainingYears * parentVisitsPerYear);

  const booksPerYear = profile.booksPerYear ?? 12;
  const booksRemainingToRead = Math.floor(yearsRemaining * booksPerYear);

  return {
    exactAgeYears,
    daysLived,
    daysRemaining,
    totalDays,
    weeksLived,
    weeksRemaining,
    totalWeeks,
    hoursLived,
    hoursRemaining,
    totalHours,
    minutesRemaining,
    secondsRemaining,
    percentageLived,
    percentageRemaining,
    wakingHoursRemaining,
    wakingDaysRemaining,
    sleepHoursRemaining,
    freeHoursRemaining,
    todayProgressPercentage,
    yearProgressPercentage,
    decadeProgressPercentage,
    weekendsRemaining,
    summersRemaining,
    springsRemaining,
    autumnsRemaining,
    wintersRemaining,
    worldCupsRemaining,
    olympicsRemaining,
    fullMoonsRemaining,
    parentVisitsRemaining,
    booksRemainingToRead,
  };
}

export function formatLargeNumber(num: number, decimals: number = 0): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
