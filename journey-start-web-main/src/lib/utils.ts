import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomUsername() {
  const animals = ["lion", "tiger", "bear", "wolf", "fox", "eagle", "shark", "panda", "koala", "otter"];
  const adjectives = ["brave", "happy", "fast", "clever", "calm", "wild", "gentle", "bold", "lucky", "smart"];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const number = Math.floor(Math.random() * 10000);
  return `${adjective}_${animal}_${number}`;
}
