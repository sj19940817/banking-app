import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const formSchema = z.object({
  amount: z.coerce.number().min(0).max(10000),
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
