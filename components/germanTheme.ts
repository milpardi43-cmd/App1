import type { GermanSentenceLevelId } from '@/lib/languages/germanSentenceCourse';

/** A German-course palette built around forest green, warm ivory and brass. */
export const GermanPalette = {
  canvas: '#F3F5F0',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F8F4',
  ink: '#172923',
  text: '#4C6057',
  muted: '#78887F',
  border: '#DDE7DF',
  primary: '#216D59',
  primaryDark: '#17483D',
  primarySoft: '#E9F3ED',
  teal: '#2E8770',
  tealSoft: '#E8F4EF',
  success: '#427A53',
  successSoft: '#EAF3E9',
  warning: '#98703A',
  warningSoft: '#FBF2E3',
  danger: '#A9444B',
  dangerSoft: '#FFF1F0',
  gold: '#D7B46B',
  goldSoft: '#F6EDD9',
  forest: '#123A32',
  forestDeep: '#0D2D28',
} as const;

/** Level-specific shades stay within a single German-inspired forest/brass palette. */
export const GERMAN_LEVEL_GRADIENTS: Record<GermanSentenceLevelId, [string, string]> = {
  0: ['#367E69', '#1B5548'],
  1: ['#26745F', '#123F36'],
  2: ['#92703C', '#5D472A'],
  3: ['#64795E', '#2B463A'],
};
