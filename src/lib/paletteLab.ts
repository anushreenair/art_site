import type { ReferenceStudy } from '../types/content';
import { getPracticeGuidance } from './practiceStudy';

export type PaletteReading = { name: string; hex: string; mix: string[]; bias: string; lighter: string; darker: string; saturated: string; muted: string };

const mixSuggestions = [
  ['Yellow Ochre', 'Burnt Sienna', 'Titanium White', 'Small amount of Ultramarine'],
  ['Ultramarine', 'Burnt Sienna', 'Titanium White', 'A touch of Yellow Ochre'],
  ['Burnt Sienna', 'Alizarin Crimson', 'Titanium White', 'A trace of Ultramarine'],
  ['Yellow Ochre', 'Ultramarine', 'Titanium White', 'Small amount of Burnt Sienna'],
];
const portraitNames = ['Warm medium skin tone', 'Cool window shadow', 'Soft rose transition', 'Blue reflected light'];
const biases = ['Warm leaning · keep the blue restrained', 'Cool leaning · let warmth sit beside it', 'Warm neutral · avoid making it pink too soon', 'Cool neutral · preserve the quiet grey'];

function blend(hex: string, target: string, amount: number) {
  const source = hex.slice(1);
  const targetValue = target.slice(1);
  const channel = (index: number) => Math.round(parseInt(source.slice(index, index + 2), 16) * (1 - amount) + parseInt(targetValue.slice(index, index + 2), 16) * amount).toString(16).padStart(2, '0');
  return `#${channel(0)}${channel(2)}${channel(4)}`;
}

export function getPaletteReadings(study: ReferenceStudy): PaletteReading[] {
  return getPracticeGuidance(study).palette.map((colour, index) => ({ name: study.subject === 'Portrait' ? portraitNames[index] : `${colour.name} note`, hex: colour.hex, mix: mixSuggestions[index], bias: biases[index], lighter: blend(colour.hex, '#fff6e5', 0.36), darker: blend(colour.hex, '#161817', 0.42), saturated: blend(colour.hex, index % 2 ? '#345dc2' : '#d55c42', 0.22), muted: blend(colour.hex, '#8b8a80', 0.42) }));
}
