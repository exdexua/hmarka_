// Cyrillic-to-Latin transliteration map
const CYR_TO_LAT: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye',
  'ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l',
  'м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
  'ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'',
  'ю':'yu','я':'ya','ё':'yo','ъ':'','э':'e','ы':'y',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(ch => CYR_TO_LAT[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const CATEGORIES = ['Windows', 'Linux', 'Docker', 'Network', 'General'] as const;
