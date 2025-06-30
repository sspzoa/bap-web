import { getKoreanDate } from '@/utils/timeZoneUtils';
import { atom } from 'jotai';

export const currentDateAtom = atom<Date>(getKoreanDate());
