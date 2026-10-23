import type { Language } from '../../../translations';
import type { StudioContent } from '../StudioView';

export const dakraamContent: Record<Language, StudioContent> = {
  nl: {
    kicker: 'Interactieve 3D-montage · Dakraam',
    title: 'Zo bouwen wij een dakraam in',
    intro: 'Meer licht op zolder zonder lekkage. Volg in 8 stappen hoe wij een dakraam in een pannendak inbouwen — van de eerste dakpan tot de regentest — en bekijk de opbouw van het dak in de opengewerkte weergave.',
    chapters: [
      ['Positie bepalen', 'Samen kiezen we de plek: tussen de sporen, op de juiste hoogte voor zicht en bediening. Daarna zetten we de sparing nauwkeurig uit op het dak.'],
      ['Dakpannen verwijderen', 'Rond de sparing nemen we de dakpannen voorzichtig weg en leggen ze apart, zodat ze straks weer netjes terug kunnen.'],
      ['Latten en folie insnijden', 'De panlatten zagen we in, de dampopen folie snijden we gecontroleerd open en de isolatie gaat uit de sparing. De constructie blijft intact.'],
      ['Raveelwerk', 'Boven en onder de sparing plaatsen we raveelbalken tussen de sporen. Zo krijgt het dakraam een stevige, haakse opening en blijft het dak sterk.'],
      ['Dakraam plaatsen', 'Met montagebeugels zetten we het dakraam vast op de juiste hoogte in het dakvlak en controleren we of het waterpas en haaks staat.'],
      ['Isoleren en afdichten', 'Een isolatieframe rondom voorkomt koudebruggen, binnen sluit een dampremmende manchet luchtdicht aan. Boven het raam leidt een drainagegoot water opzij.'],
      ['Gootstukken', 'De gootstukken sluiten het raam waterdicht aan op de pannen: eerst de onderzijde met de flexibele schort, dan de zijkanten en de bovenkant.'],
      ['Pannen terug en regentest', 'De pannen gaan terug en we testen de aansluiting met water. Binnen werken we de dagkanten af. Het resultaat: meer licht, droog en goed geïsoleerd.'],
    ],
    labels: {},
  },
  en: {
    kicker: 'Interactive 3D installation · Roof window',
    title: 'How we install a roof window',
    intro: 'More light in the attic without leaks. Follow 8 steps of installing a roof window in a tiled roof — from the first tile to the rain test — and see the roof build-up in the cutaway view.',
    chapters: [
      ['Choose the position', 'Together we pick the spot: between the rafters, at the right height for view and operation. Then we mark the opening precisely on the roof.'],
      ['Remove roof tiles', 'Around the opening we carefully take off the tiles and set them aside so they can go back neatly later.'],
      ['Cut battens and membrane', 'The battens are cut, the breathable membrane is opened in a controlled way and the insulation comes out of the opening. The structure stays intact.'],
      ['Trimmers', 'Above and below the opening we fit trimmers between the rafters, giving the window a solid, square opening while keeping the roof strong.'],
      ['Fit the roof window', 'With mounting brackets we fix the window at the right height in the roof plane and check that it is level and square.'],
      ['Insulate and seal', 'An insulation frame prevents cold bridges, inside a vapour-control collar seals airtight. Above the window a drainage gutter leads water sideways.'],
      ['Flashings', 'The flashings connect the window watertight to the tiles: first the bottom with its flexible apron, then the sides and the top.'],
      ['Tiles back and rain test', 'The tiles go back and we test the connection with water. Inside we finish the reveals. The result: more light, dry and well insulated.'],
    ],
    labels: {
      'Sporen': 'Rafters', 'Isolatie tussen de sporen': 'Insulation between rafters', 'Binnenafwerking': 'Interior lining',
      'Dampopen folie': 'Breathable membrane', 'Tengels': 'Counter battens', 'Panlatten': 'Tile battens', 'Dakpannen': 'Roof tiles',
      'Raveelwerk': 'Trimmers', 'Dakraam (HR++ glas)': 'Roof window (HR++ glass)', 'Montagebeugels': 'Mounting brackets',
      'Isolatieframe': 'Insulation frame', 'Dampremmende manchet': 'Vapour-control collar', 'Drainagegoot': 'Drainage gutter',
      'Gootstukken': 'Flashings', 'Water wordt langs het raam geleid': 'Water is led around the window',
    },
  },
  pl: {
    kicker: 'Interaktywny montaż 3D · Okno dachowe',
    title: 'Tak montujemy okno dachowe',
    intro: 'Więcej światła na poddaszu bez przecieków. Zobacz w 8 krokach montaż okna dachowego w dachu z dachówką — od pierwszej dachówki do próby deszczu — i sprawdź warstwy dachu w widoku przekroju.',
    chapters: [
      ['Wybór miejsca', 'Razem wybieramy miejsce: między krokwiami, na wysokości wygodnej do patrzenia i obsługi. Potem dokładnie wyznaczamy otwór na dachu.'],
      ['Zdjęcie dachówek', 'Wokół otworu ostrożnie zdejmujemy dachówki i odkładamy je, żeby później wróciły na swoje miejsce.'],
      ['Cięcie łat i folii', 'Przecinamy łaty, kontrolowanie nacinamy folię paroprzepuszczalną i wyjmujemy ocieplenie z otworu. Konstrukcja zostaje nienaruszona.'],
      ['Wymian', 'Nad i pod otworem montujemy belki wymianu między krokwiami. Okno dostaje sztywny, prostokątny otwór, a dach zachowuje nośność.'],
      ['Montaż okna', 'Kątownikami montażowymi mocujemy okno na właściwej wysokości w połaci dachu i sprawdzamy poziom oraz kąty proste.'],
      ['Ocieplenie i uszczelnienie', 'Rama izolacyjna wokół okna eliminuje mostki termiczne, a od środka paroizolacyjny kołnierz zamyka połączenie szczelnie. Nad oknem rynienka odprowadza wodę na boki.'],
      ['Kołnierz uszczelniający', 'Kołnierz szczelnie łączy okno z dachówkami: najpierw dół z elastycznym fartuchem, potem boki i góra.'],
      ['Dachówki i próba deszczu', 'Dachówki wracają na miejsce, a połączenie sprawdzamy wodą. W środku wykańczamy ościeża. Efekt: więcej światła, sucho i ciepło.'],
    ],
    labels: {
      'Sporen': 'Krokwie', 'Isolatie tussen de sporen': 'Ocieplenie między krokwiami', 'Binnenafwerking': 'Wykończenie wewnętrzne',
      'Dampopen folie': 'Folia paroprzepuszczalna', 'Tengels': 'Kontrłaty', 'Panlatten': 'Łaty', 'Dakpannen': 'Dachówki',
      'Raveelwerk': 'Wymian', 'Dakraam (HR++ glas)': 'Okno dachowe (szyba HR++)', 'Montagebeugels': 'Kątowniki montażowe',
      'Isolatieframe': 'Rama izolacyjna', 'Dampremmende manchet': 'Kołnierz paroizolacyjny', 'Drainagegoot': 'Rynienka odwadniająca',
      'Gootstukken': 'Kołnierz uszczelniający', 'Water wordt langs het raam geleid': 'Woda jest odprowadzana obok okna',
    },
  },
};
