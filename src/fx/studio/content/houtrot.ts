import type { Language } from '../../../translations';
import type { StudioContent } from '../StudioView';

export const houtrotContent: Record<Language, StudioContent> = {
  nl: {
    kicker: 'Interactieve 3D-herstel · Houtrot',
    title: 'Zo herstellen wij houtrot',
    intro: 'Houtrot hoeft niet te betekenen dat het hele kozijn eruit moet. Zie in 7 stappen hoe wij aangetast hout verwijderen, de plek duurzaam vullen en het kozijn weer als nieuw afwerken.',
    chapters: [
      ['Inspectie', 'Met een priem prikken we in het hout: zakt hij weg, dan is het rot. De vochtmeter bevestigt het. Zo bepalen we precies hoe ver de aantasting gaat.'],
      ['Houtrot wegfrezen', 'Al het aangetaste hout frezen we weg tot we op gezond, hard hout uitkomen. Alleen zo stopt de rot echt.'],
      ['Drogen en primer', 'De plek moet droog zijn. Daarna zetten we het hout in met een houtrotprimer die diep intrekt en het gezonde hout versterkt.'],
      ['Vullen met 2K vuller', 'We vullen de holte met een tweecomponenten houtrotvuller op epoxybasis — iets te vol, zodat we hem straks strak kunnen schuren.'],
      ['Schuren', 'Na uitharding schuren we de vuller glad en vlak met de dorpel. Het herstel is daarna niet meer te zien.'],
      ['Gronden', 'Het herstel krijgt een laag grondverf, zodat de aflak goed hecht en het hout beschermd is.'],
      ['Aflakken', 'Tot slot lakken we het hele kozijn in twee lagen af. Het resultaat: een kozijn dat weer jaren mee kan, voor een fractie van de kosten van vervanging.'],
    ],
    labels: {},
  },
  en: {
    kicker: 'Interactive 3D repair · Wood rot',
    title: 'How we repair wood rot',
    intro: 'Wood rot does not have to mean replacing the whole frame. See in 7 steps how we remove affected wood, fill the spot durably and finish the frame like new.',
    chapters: [
      ['Inspection', 'We probe the wood with an awl: if it sinks in, it is rotten. A moisture meter confirms it, so we know exactly how far the damage goes.'],
      ['Mill out the rot', 'We mill away all affected wood until we reach sound, hard timber. Only then does the rot really stop.'],
      ['Dry and prime', 'The spot must be dry. Then we treat it with a wood-rot primer that soaks in deep and strengthens the sound wood.'],
      ['Fill with 2K filler', 'We fill the cavity with a two-component epoxy wood filler — slightly proud, so it can be sanded perfectly flush.'],
      ['Sand', 'Once cured we sand the filler smooth and flush with the sill. The repair becomes invisible.'],
      ['Prime coat', 'The repair gets a coat of primer so the topcoat adheres well and the wood is protected.'],
      ['Topcoat', 'Finally we paint the whole frame in two coats. The result: a frame good for years more, at a fraction of the cost of replacement.'],
    ],
    labels: {
      'Houtrot': 'Wood rot', '2K houtrotvuller (epoxy)': '2K wood filler (epoxy)', 'Priem zakt weg: zacht hout': 'Awl sinks in: soft wood',
      'Vochtmeter: 28 %': 'Moisture meter: 28 %', 'Freesmachine': 'Router', 'Alleen gezond hout blijft over': 'Only sound wood remains',
      'Houtrotprimer': 'Wood-rot primer', 'Plamuurmes': 'Putty knife', 'Schuurblok': 'Sanding block', 'Grondverf': 'Primer coat', 'Twee lagen aflak': 'Two topcoats',
    },
  },
  pl: {
    kicker: 'Interaktywna naprawa 3D · Zgnilizna drewna',
    title: 'Tak naprawiamy zgniłe drewno',
    intro: 'Zgnilizna nie zawsze oznacza wymianę całego okna. Zobacz w 7 krokach, jak usuwamy zniszczone drewno, trwale wypełniamy ubytek i wykańczamy ramę jak nową.',
    chapters: [
      ['Inspekcja', 'Szpikulcem sprawdzamy drewno: jeśli się zapada, jest zgniłe. Wilgotnościomierz to potwierdza i wiemy dokładnie, jak daleko sięga uszkodzenie.'],
      ['Frezowanie zgnilizny', 'Frezujemy całe zniszczone drewno aż do zdrowego, twardego materiału. Tylko tak zgnilizna naprawdę się zatrzymuje.'],
      ['Suszenie i grunt', 'Miejsce musi być suche. Potem impregnujemy je preparatem, który wnika głęboko i wzmacnia zdrowe drewno.'],
      ['Wypełnianie masą 2K', 'Ubytek wypełniamy dwuskładnikową masą epoksydową — z lekkim nadmiarem, żeby potem zeszlifować ją idealnie na równo.'],
      ['Szlifowanie', 'Po utwardzeniu szlifujemy masę gładko i równo z progiem. Naprawy nie widać.'],
      ['Gruntowanie', 'Naprawione miejsce dostaje warstwę farby podkładowej, żeby lakier dobrze się trzymał, a drewno było chronione.'],
      ['Lakierowanie', 'Na koniec malujemy całą ramę dwiema warstwami. Efekt: okno posłuży jeszcze lata, za ułamek ceny wymiany.'],
    ],
    labels: {
      'Houtrot': 'Zgnilizna', '2K houtrotvuller (epoxy)': 'Masa 2K (epoksyd)', 'Priem zakt weg: zacht hout': 'Szpikulec się zapada: miękkie drewno',
      'Vochtmeter: 28 %': 'Wilgotnościomierz: 28 %', 'Freesmachine': 'Frezarka', 'Alleen gezond hout blijft over': 'Zostaje tylko zdrowe drewno',
      'Houtrotprimer': 'Impregnat', 'Plamuurmes': 'Szpachelka', 'Schuurblok': 'Kostka szlifierska', 'Grondverf': 'Farba podkładowa', 'Twee lagen aflak': 'Dwie warstwy lakieru',
    },
  },
};
