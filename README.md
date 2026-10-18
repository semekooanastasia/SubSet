# SubSet

Abonementu pārvaldības lietotne: apkopo visus lietotāja aktīvos abonementus vienuviet,
rāda gaidāmos maksājumus laika skalā un brīdina pirms naudas norakstīšanas.

RTU studiju projekts (4. kurss). Autore: Anastasija Semeko.

## Tehnoloģijas

- Next.js 16 (App Router) + React 19
- Dati tiek glabāti lokāli pārlūkā (`localStorage`) — serveris un banku integrācijas netiek izmantotas
- Lokālie paziņojumi ar pārlūka `Notification` API

## Palaišana

```bash
npm install
npm run dev
```

Lietotne atveras uz http://localhost:3100.

Būvēšana: `npm run build`.

## Struktūra

| Ceļš | Saturs |
| --- | --- |
| `app/` | Next.js maršruts, globālie stili un lietotnes stāvoklis |
| `components/` | Ekrāni un atkārtoti lietojamie UI elementi |
| `lib/` | Datumu aprēķini, katalogs, lokālā glabātuve, .csv parsētājs, paziņojumi |
| `docs/` | Sprinta plāns un backlog |

## Funkcionalitāte

- Lietotāja reģistrācija, pieteikšanās un profils
- Populāro pakalpojumu katalogs ar iepriekš definētiem tarifu plāniem
- Abonementu pievienošana no kataloga vai manuāli, rediģēšana un dzēšana ar apstiprinājumu
- Saraksts, kas sakārtots pēc tuvākā maksājuma, ar atlikušo dienu skaitu
- Kopsumma mēnesī un gadā (gada abonementi tiek pārrēķināti mēneša ekvivalentā)
- Maksājumu kalendārs un izdevumu sadalījums pa kategorijām
- Lokālie paziņojumi pirms maksājuma ar konfigurējamu brīdinājuma laiku
- Bankas izraksta .csv imports ar apstiprināšanas sarakstu

## Darba process

- Atzaru nosaukumi, commit ziņojumi un pull request prasības: [CONTRIBUTING.md](CONTRIBUTING.md)
- Pabeigtības definīcija: [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)
- Aktuālais sprints: [docs/SPRINT-1.md](docs/SPRINT-1.md)
