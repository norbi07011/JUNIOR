import { asset } from './fx/core';

export const galleryImages: Record<string, string[]> = {
  windows: [
    'projekt-okna-1.jpeg', 'projekt-okna-11.jpeg', 'projekt-okna-111-b.jpeg', 'projekt-okna-111.jpeg',
    'projekt-okna-1111.jpeg', 'projekt-okna-11111.jpeg', 'projekt-okna11111.jpeg',
  ].map(asset),
  doors: ['drzwi1.jpeg', 'drzwi2.jpeg', 'drzwi3.jpeg', 'drzwi4.jpeg', 'drzwi5.jpeg', 'drzwi6.jpeg'].map(asset),
  hst: ['hst.jpeg'].map(asset),
  roof: [
    'okna-dachowe.jpeg', 'okna-dachowe1.jpeg', 'okna-dachowe2.jpeg', 'okna-dachowe3.jpeg',
    'okna-dachowe4.jpeg', 'okna-dachowe5.jpeg', 'okna-dachowe55.jpeg', 'okna-dachowe555.jpeg',
  ].map(asset),
  cladding: [
    'elewacje.jpeg', 'elewacje1.jpeg', 'elewacje2.jpeg', 'elewacje3.jpeg', 'elewacje4.jpeg',
    'elewacje5.jpeg', 'elewacje6.jpeg', 'elewacje7.jpeg', 'elewacie-77.jpeg', 'elewacje8.jpeg',
  ].map(asset),
  repair: ['projekt-reperacje-w-drewnie-1.jpeg', 'projekt-reperacje-w-drewnie-11.jpeg'].map(asset),
};

/** One photo per service, in the same order as translations.services.items. */
export const serviceImages = [
  'projekt-okna-11.jpeg',   // ramen
  'drzwi1.jpeg',            // deuren
  'hst.jpeg',               // HST
  'okna-dachowe.jpeg',      // dakramen
  'projekt-okna-1111.jpeg', // binnenafwerking
  'projekt-okna-111.jpeg',  // vensterbanken
  'elewacje.jpeg',          // keralit
].map(asset);

export const CONTACT = {
  phone: '+31 6 19740942',
  phoneHref: 'tel:+31619740942',
  email: 'juniorjob.onderhoud@interia.eu',
  whatsapp: '31619740942',
  address: 'Engelandlaan 474, 2711EB Zoetermeer',
};
