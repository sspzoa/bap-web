import { atom } from "jotai";
import { getKoreanDate } from "@/shared/utils/timeZoneUtils";

export const currentDateAtom = atom<Date>(getKoreanDate());
