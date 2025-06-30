import { atom } from 'jotai';
import { getKoreanTime } from '@/utils/timeZoneUtils';

export const currentDateAtom = atom<Date>(getKoreanTime());