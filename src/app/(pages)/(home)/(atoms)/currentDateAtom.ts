import { atom } from "jotai";
import { getMealDisplayDate } from "@/shared/utils/dateUtils";

export const currentDateAtom = atom<Date>(getMealDisplayDate());
