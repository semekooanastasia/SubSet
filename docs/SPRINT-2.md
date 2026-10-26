# Sprints 2 — SubSet

**Periods:** 12.10.–02.11.2026 (trīs nedēļas)
**Sprinta vadītāja:** Anastasija Semeko
**Reāli pieejamais laiks nedēļā:** 12 h → kopā **36 h**
**Demonstrācija:** 02.11. nodarbībā, 3 minūtes

## Sprinta mērķis

> Lietotājs iziet vienu pilnu scenāriju — pieteikšanās, abonementu saraksts ar kopsummu,
> jauna abonementa pievienošana — un dati visu ceļu iet caur īstu API slāni,
> nevis komponentē ierakstītu masīvu.

Kāpēc tieši tas: pēc 1. sprinta ekrāni bija gatavi, bet dati dzīvoja komponentēs.
Kamēr nav viena ceļa "ekrāns → API → ekrāns", nav ko pārslēgt uz īstu serveri
un nav kur pārbaudīt kļūdu un tukšos stāvokļus.

## Backlog

Kopā novērtēts: **36 h**. Prioritāte dilstoši — ja laiks beidzas, pēdējās vienības
tiek izmestas, nevis saspiestas (izmešanas secība: SP2-8, SP2-7).

### SP2-1 · Domēna slānis naudas un datumu loģikai · 4 h · ✅ pabeigts

Kā izstrādātāja, es vēlos naudas un datumu aprēķinus ārpus komponentēm,
lai tos varētu pārbaudīt ar testiem un lietot visos ekrānos vienādi.

- `lib/domain/money.js` un `lib/domain/dates.js` satur tikai tīrās funkcijas.
- Neviena komponente pati nerēķina kopsummu un nākamā maksājuma datumu.
- Noapaļošana līdz centiem notiek vienā vietā (`roundCents`).

### SP2-2 · API klients ar vienu kļūdas tipu · 5 h · ✅ pabeigts

Kā izstrādātāja, es vēlos vienu vietu, kur veidojas adrese, galvenes un kļūdas,
lai pāreja uz īstu serveri būtu viena konfigurācijas maiņa.

- Bāzes adrese nāk no `NEXT_PUBLIC_API_URL`, nevis ir ierakstīta kodā.
- Galvenes `Accept`, `Content-Type`, `Authorization`, `X-Client` veidojas `buildHeaders` funkcijā.
- Visas kļūdas — tīkla, 4xx, 5xx, nelasāms JSON — tiek pārveidotas par `ApiError` ar lauku `code`.

### SP2-3 · Testa serveris ar četriem scenārijiem · 5 h · ✅ pabeigts

Kā izstrādātāja, es vēlos palaist API lokāli, lai varētu izstrādāt un demonstrēt bez īsta servera.

- `npm run mock` paceļ serveri portā 4000 bez papildu atkarībām.
- Scenāriji `ok`, `empty`, `error`, `slow` tiek izvēlēti ar `MOCK_SCENARIO`.
- Serveris pārbauda `Authorization` galveni un atgriež 401 bez marķiera.

### SP2-4 · Vertikālā šķēle: ieeja → saraksts → pievienošana · 8 h · ✅ pabeigts

Kā lietotājs, es vēlos pieteikties, redzēt savus abonementus un pievienot jaunu,
lai lietotne būtu lietojama no sākuma līdz galam.

- `/ieeja` → `POST /api/auth/login` → marķieris sesijā → pāreja uz `/sakums`.
- `/sakums` ielādē `GET /api/subscriptions` un `GET /api/catalog`, rāda sarakstu un kopsummas.
- `/pievienot` → `POST /api/subscriptions` → saraksts atgriežas ar jauno ierakstu.

### SP2-5 · Četri ekrāna stāvokļi sākuma ekrānā · 4 h · ✅ pabeigts

Kā lietotājs, es vēlos saprast, kas notiek, arī tad, kad dati nav atnākuši,
lai tukšs ekrāns nešķistu salūzusi lietotne.

- Ielāde (S-04A), tukšs (S-04B), kļūda (S-04C) un dati (S-04) ir atsevišķas komponentes `components/states/`.
- Kļūdas stāvoklis rāda `ApiError.code` un pogu "Mēģināt vēlreiz".
- Katrs stāvoklis ir demonstrējams ar attiecīgo testa servera scenāriju.

### SP2-6 · Vienībtesti aprēķiniem un .csv importam · 4 h · ✅ pabeigts

Kā izstrādātāja, es vēlos testus tai loģikai, kur rēķina naudu,
lai refaktorings nesabojātu kopsummas.

- Testi rakstīti ar `node:test`, palaižami ar `npm test`, bez papildu atkarībām.
- Nosegti vismaz: noapaļošana līdz centiem, gada abonementa mēneša ekvivalents,
  kopsumma ar izmēģinājuma abonementu, maksājuma pārritināšana 31.01. → 28.02.,
  .csv parsētājs ar `;` un `,` atdalītājiem.
- CI izpilda `npm test` pirms `npm run build`; krītošs tests bloķē apvienošanu.

> **Atrasts un izlabots testējot:** `.csv` parsētājs dalīja rindu pēc jebkura no
> `,` `;` `\t`, tāpēc Latvijas banku izrakstā ar `;` summa `-7,99` sadalījās divās
> šūnās un importējās kā 7,00 €. Tagad atdalītājs tiek noteikts vienreiz visam failam.

### SP2-9 · Apstiprināšanas ekrāns pēc K2 prototipa (S-07) · 3 h · ✅ pabeigts

Kā lietotājs, es vēlos pirms saglabāšanas redzēt, ko tieši pievienoju un kā tas mainīs kopsummu,
lai nejauši nepievienotu abonementu ar nepareizu summu vai datumu.

- `/pievienot/parskats` atbilst prototipa ekrānam S-07 "Pārbaudi pirms saglabāšanas".
- Ekrānā redzams pakalpojums, nākamais maksājums, kategorija, gada kopsumma,
  atgādinājuma laiks un kopsummas izmaiņa "pirms → pēc".
- "Apstiprināt un saglabāt" izsauc `POST /api/subscriptions`, "Labot" atgriež formā ar saglabātām vērtībām.
- Ekrāns strādā 375 px platumā gaišajā un tumšajā režīmā, konsolē nav kļūdu.

> **Atrasts un izlabots, veidojot ekrānu:** formā ar ieslēgtu izmēģinājumu poga
> "Saglabāt" nekad neatslēdzās, jo pārbaude prasīja `nextPayment` lauku, kuru forma
> šajā režīmā nemaz nerāda. Izmēģinājuma abonementu caur formu nebija iespējams pievienot.

### SP2-10 · Ikonas un logotipi no prototipa · 3 h · ✅ pabeigts

Kā lietotājs, es vēlos redzēt pazīstamus pakalpojumu logotipus un skaidras ikonas,
lai sarakstā atrastu vajadzīgo abonementu ar skatienu, nevis lasot nosaukumus.

- Saskarnes ikonas (navigācija, atpakaļ, zvans, meklēšana, bultas, atzīme, kļūda)
  nāk no prototipa SVG failiem `public/icons/`, nevis no Unicode simboliem.
- Ikonas tiek liktas kā CSS maska, krāsu dod `currentColor` — viens fails der
  gaišajam un tumšajam režīmam.
- Visi deviņi kataloga pakalpojumi rāda savu logotipu; abonements ārpus kataloga —
  monogrammu, sporta klubs — prototipa glifu.
- Pārbaudīts katrā ekrānā 375 px platumā abos režīmos; konsolē nav kļūdu,
  visi faili atbild ar 200.

> **Atrasts un izlabots:** kļūdas stāvokļa aplim bija klase `error`, tāpat kā formas
> kļūdas tekstam. Vēlākā `.error` kārtula ar tādu pašu svaru atcēla `margin: 0 auto`,
> un aplis bija pabīdīts pa kreisi, nevis centrā. Modifikators pārsaukts par `is-error`.

### SP2-7 · Lēmums par īsto API · 2 h · ⏳ 3. nedēļa

Kā komanda, mēs vēlamies pierakstītu lēmumu par īsto serveri,
lai nākamais sprints nesāktos ar to pašu jautājumu.

- `docs/API.md` apraksta līgumu: galapunktus, pieprasījumu un atbildes formu, kļūdu kodus.
- Pierakstīts pamatojums, kāpēc šajā sprintā paliek testa serveris.
- Pārbaudīts, ka pāreja ir viena `NEXT_PUBLIC_API_URL` vērtības maiņa, nevis koda labojumi.

### SP2-8 · Demonstrācija un sprinta kartīte · 2 h · ⏳ 3. nedēļa

Kā students, es vēlos sagatavotu demonstrācijas gaitu,
lai trīs minūtēs parādītu scenāriju, nevis meklētu, kur kas atveras.

- Demonstrācijas gaita pierakstīta (zemāk), izmēģināta vismaz vienu reizi ar taimeri.
- Aizpildīta sprinta kartīte `docs/sprinta-kartite.html`, izdrukājama vienā A4 lapā.
- README sākumā ir palaišanas norādes testa serverim un lietotnei.

## Šajā sprintā netiek darīts

- Īsta banku integrācija (PSD2) un serverpuses datubāze — skatīt SP2-7 pamatojumu
- Paziņojumi, kad lietotnes cilne ir aizvērta (service worker, PWA) — nākamajā sprintā
- Abonementu atcelšana caur lietotni (trešo pušu API ierobežojumi)
- Maksājumu vēstures ekrāns

## Gaita pa nedēļām

| Posms | Datumi | Rezultāts |
| --- | --- | --- |
| 1. nedēļa | 12.–19.10. | Karkass un vertikālā šķēle: SP2-1, SP2-2, SP2-3 — viens scenārijs iet cauri testa serverim |
| Starppunkts | 19.10. | Statuss trijniekam: šķēle strādā, atlikuši stāvokļi un testi |
| 2. nedēļa | 19.–26.10. | Saturs un kļūdu ceļi: SP2-4, SP2-5, SP2-6 |
| 3. nedēļa | 26.10.–02.11. | Noslīpēšana: SP2-9, SP2-10, SP2-7, SP2-8 |

## Demonstrācijas gaita (3 min)

Rādīt ekrānu, nevis kodu. Pirms sākuma: divi termināļi atvērti, lietotne uz `/ieeja`,
pārlūks 375 px platumā.

| Laiks | Ko dara | Ko saka |
| --- | --- | --- |
| 0:00–0:30 | Rāda sākuma ekrānu ar datiem | Sprinta mērķis: viens pilns scenārijs caur API slāni. Vertikālā šķēle ir ieeja → saraksts → pievienošana |
| 0:30–1:30 | Piesakās, saraksts ielādējas, atver katalogu, izvēlas Netflix, nospiež "Turpināt" | Dati iet caur `POST /api/auth/login` un `GET /api/subscriptions` |
| 1:30–2:00 | Rāda S-07 pārskatu un apstiprina | Pirms saglabāšanas redzams, kā mainīsies kopsumma: 49,97 € → 63,96 €. Apstiprinot — `POST /api/subscriptions` |
| 2:00–2:30 | Pārslēdz termināli uz `npm run mock:error`, pārlādē lapu | Kļūdas stāvoklis ar kodu `SYNC-01` un pogu "Mēģināt vēlreiz" — nevis tukšs ekrāns |
| 2:30–3:00 | Rāda `npm test` izvadi | 28 testi naudas, datumu un .csv loģikai. Testējot atradās kļūda ar `;` atdalītāju un tā ir izlabota |

Ja laiks beidzas: kļūdas stāvokli izlaiž, testu izvadi atstāj. Tukšo stāvokli
(`npm run mock:empty`) rāda tikai tad, ja paliek laiks.

**Kas nav izdarīts un kāpēc:** paziņojumi, kad lietotne ir aizvērta — tam vajag service worker
un PWA manifestu, kas šajā sprintā neiekļāvās. **Viena izmaiņa nākamajam sprintam:**
sākt ar to vienību, kas prasa jaunu tehnoloģiju, nevis atstāt to beigās.

## Uzdevumu sadale

| Loma | Vārds | Uzdevums |
| --- | --- | --- |
| Sprinta vadītāja | Anastasija Semeko | Izstrāde: SP2-1 … SP2-8 |
| Komandas biedrs 1 | ____________________ | Koda apskate: viens pull request, trīs konkrēti komentāri pie konkrētām koda rindām |
| Komandas biedrs 2 | ____________________ | Procesa pārbaude: atzaru nosaukumi, commit ziņojumi, .gitignore un noslēpumi, CI izpilde, pabeigtības definīcija |

## Pabeigtības definīcija

Skatīt [DEFINITION_OF_DONE.md](../DEFINITION_OF_DONE.md).
