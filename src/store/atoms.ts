import { getKoreanDate } from '@/utils/date';
import { atom } from 'jotai';

export const currentDateAtom = atom<Date>(getKoreanDate());
