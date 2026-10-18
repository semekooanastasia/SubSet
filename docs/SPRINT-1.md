# Sprints 1 — SubSet

**Periods:** 05.10.–12.10.2026
**Sprinta vadītāja:** Anastasija Semeko
**Reāli pieejamais laiks nedēļā:** 12 h

## Sprinta mērķis

> Lietotājs var atzīmēt bezmaksas izmēģinājuma periodu un saņem brīdinājumu par to un
> par gaidāmo maksājumu arī tad, kad lietotne nav atvērta.

Kāpēc tieši tas: projekta pieteikumā pirmā nosauktā lietotāju problēma ir aizmirsti
izmēģinājuma periodi, bet pašreizējā versijā izmēģinājumu nav iespējams atzīmēt, un
paziņojumi pazūd, tiklīdz cilne tiek aizvērta.

## Backlog

Kopā novērtēts: **12 h**. Prioritāte dilstoši — ja laiks beidzas, pēdējās vienības
tiek izmestas, nevis saspiestas (izmešanas secība: SP1-7, SP1-6).

### SP1-1 · Paziņojumi strādā, kad lietotne ir aizvērta · 3 h

Kā lietotājs, es vēlos saņemt brīdinājumu arī tad, kad lietotne nav atvērta,
lai atgādinājums sasniegtu mani reālā dzīvē, nevis tikai atvērtā cilnē.

- Projektam ir `manifest.json` ar ikonu, un lietotni var instalēt uz viedtālruņa sākuma ekrāna.
- Ir reģistrēts service worker, kas parāda paziņojumu, kad lietotnes cilne ir aizvērta.
- Pārlūkā, kas neatbalsta service worker, lietotne turpina darboties bez kļūdām konsolē.

### SP1-2 · Bezmaksas izmēģinājuma perioda atzīme · 2 h

Kā students, es vēlos atzīmēt, ka pakalpojums šobrīd ir bezmaksas izmēģinājumā,
lai zinātu, kad sāksies maksa.

- Abonementa formā ir slēdzis "Bezmaksas izmēģinājums" un lauks "Izmēģinājums beidzas".
- Saraksta kartītē šādam abonementam redzama atzīme "Izmēģinājums līdz DD.MM.".
- Kamēr izmēģinājums nav beidzies, summa netiek ieskaitīta rādītājā "Kopā mēnesī".

### SP1-3 · Brīdinājums pirms izmēģinājuma beigām · 1,5 h

Kā lietotājs, es vēlos saņemt paziņojumu pirms izmēģinājuma beigām,
lai paspētu atteikties, pirms nauda tiek ieturēta.

- Paziņojums tiek nosūtīts tik dienas iepriekš, cik norādīts iestatījumos.
- Tekstā ir pakalpojuma nosaukums, beigu datums un summa, kas tiks ieturēta pēc tam.
- Atverot paziņojumu, lietotne atver attiecīgā abonementa detaļu skatu.

### SP1-4 · Paroles netiek glabātas atklātā tekstā · 1,5 h

Kā lietotājs, es vēlos, lai mana parole netiktu glabāta salasāmā veidā,
lai dati būtu drošībā arī koplietotā datorā.

- Parole tiek glabāta kā SHA-256 jaucējsumma ar nejaušu sāli (Web Crypto API).
- `localStorage` saturā vairs nav atrodama atklāta teksta parole.
- Pieteikšanās ar pareizu paroli darbojas, ar nepareizu — rāda kļūdas paziņojumu.

### SP1-5 · Vienībtesti aprēķiniem un .csv importam · 2 h

Kā izstrādātāja, es vēlos testus datumu un importa loģikai,
lai refaktorings nesabojātu maksājumu aprēķinus.

- Testi rakstīti ar `node:test`, palaižami ar `npm test`.
- Nosegti vismaz: maksājuma datuma pārritināšana pāri mēneša beigām (31.01. → 28.02.),
  mēneša kopsumma ar gada abonementu, .csv parsētājs ar `;` un `,` atdalītājiem.
- Visi testi iziet lokāli.

### SP1-6 · CI pārbauda arī testus · 1 h

Kā komanda, mēs vēlamies, lai sarkans CI bloķētu apvienošanu,
lai `main` vienmēr paliek būvējams.

- GitHub Actions darbplūsma papildus `npm run build` izpilda `npm test`.
- Pull request ar krītošu testu ir atzīmēts kā neveiksmīgs.
- README ir CI statusa nozīmīte.

### SP1-7 · Kopsumma kalendārā · 1 h

Kā budžeta plānotājs, es vēlos redzēt dienas un mēneša kopsummu kalendārā,
lai saprastu, kurās dienās slodze ir vislielākā.

- Zem kalendāra izvēlētajai dienai redzams "Kopā šajā dienā: X.XX €".
- Pie mēneša nosaukuma redzama attiecīgā mēneša maksājumu kopsumma.

## Šajā sprintā netiek darīts

- Abonementu atcelšana caur lietotni (trešo pušu API ierobežojumi)
- Reāla banku integrācija (PSD2) un serverpuses datubāze
- Maksājumu vēstures ekrāns

## Uzdevumu sadale

| Loma | Vārds | Uzdevums |
| --- | --- | --- |
| Sprinta vadītāja | Anastasija Semeko | Izstrāde: SP1-1 … SP1-7 |
| Komandas biedrs 1 | ____________________ | Koda apskate: viens pull request, trīs konkrēti komentāri pie konkrētām koda rindām |
| Komandas biedrs 2 | ____________________ | Procesa pārbaude: atzaru nosaukumi, commit ziņojumi, .gitignore un noslēpumi, CI izpilde, pabeigtības definīcija — piecas atzīmes kartītē |

## Pabeigtības definīcija

Skatīt [DEFINITION_OF_DONE.md](../DEFINITION_OF_DONE.md).

## Pārskata sapulce

7. nodarbībā: 5 min demonstrācija dzīvajā, 5 min komandas biedru ziņojumi, 5 min retrospektīva.
