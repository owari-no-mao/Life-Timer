import { UserProfile, LifeCalculations } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '自分',
  birthDate: '2001-10-14',
  birthTime: '12:00',
  targetAge: 85,
  sleepHoursPerDay: 7.5,
};

export interface LifeEra {
  name: string;
  startAge: number;
  endAge: number;
  bgClass: string;
  textColor: string;
}

export const LIFE_ERAS: LifeEra[] = [
  { name: '幼少期・育成期', startAge: 0, endAge: 12, bgClass: 'bg-emerald-500/10 border-emerald-500/30', textColor: 'text-emerald-400' },
  { name: '青春・学生期', startAge: 12, endAge: 22, bgClass: 'bg-sky-500/10 border-sky-500/30', textColor: 'text-sky-400' },
  { name: '挑戦・確立期', startAge: 22, endAge: 35, bgClass: 'bg-indigo-500/10 border-indigo-500/30', textColor: 'text-indigo-400' },
  { name: '成熟・円熟期', startAge: 35, endAge: 50, bgClass: 'bg-purple-500/10 border-purple-500/30', textColor: 'text-purple-400' },
  { name: '指導・集大成期', startAge: 50, endAge: 65, bgClass: 'bg-amber-500/10 border-amber-500/30', textColor: 'text-amber-400' },
  { name: '黄金・悠々期', startAge: 65, endAge: 120, bgClass: 'bg-rose-500/10 border-rose-500/30', textColor: 'text-rose-400' },
];

export function getLifeEraForAge(age: number): LifeEra {
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

export function convertSecondsToTimeBreakdown(totalSeconds: number): DetailedTimeBreakdown {
  if (totalSeconds <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, formattedString: '0年 0ヶ月 0日 0時間 0分 0秒' };
  }

  const secondsPerYear = 365.2425 * 86400; // ~31,556,952 sec
  const secondsPerMonth = (365.2425 / 12) * 86400; // ~2,629,746 sec
  const secondsPerDay = 86400;
  const secondsPerHour = 3600;
  const secondsPerMinute = 60;

  let remaining = totalSeconds;

  const years = Math.floor(remaining / secondsPerYear);
  remaining -= years * secondsPerYear;

  const months = Math.floor(remaining / secondsPerMonth);
  remaining -= months * secondsPerMonth;

  const days = Math.floor(remaining / secondsPerDay);
  remaining -= days * secondsPerDay;

  const hours = Math.floor(remaining / secondsPerHour);
  remaining -= hours * secondsPerHour;

  const minutes = Math.floor(remaining / secondsPerMinute);
  remaining -= minutes * secondsPerMinute;

  const seconds = Math.floor(remaining);

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

  // Progress metrics for today, year
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const msToday = now.getTime() - startOfDay;
  const todayProgressPercentage = (msToday / msPerDay) * 100;

  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1).getTime();
  const yearProgressPercentage = ((now.getTime() - startOfYear) / (endOfYear - startOfYear)) * 100;

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
    todayProgressPercentage,
    yearProgressPercentage,
  };
}

export function formatLargeNumber(num: number): string {
  return Math.floor(num).toLocaleString('ja-JP');
}
