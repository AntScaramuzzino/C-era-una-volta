import { ReactNode } from 'react';

export interface CardData {
  title: string;
  desc: string;
  cat: string;
}

export interface Category {
  color: string;
  printColor: string;
  icon: ReactNode;
  label: string;
}

export interface IllustrationStyle {
  id: string;
  name: string;
  category: string;
  prompt: string;
}

export interface StoryLength {
  id: string;
  label: string;
  desc: string;
}
