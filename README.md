# SubSet

## Palaišana

```bash
npm install
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run mock                   # 1. terminālis: testa serveris portā 4000
npm run dev                    # 2. terminālis: lietotne http://localhost:3100
```

Ekrāna stāvokļu demonstrēšanai testa serveri var palaist ar citu scenāriju:
`npm run mock:empty`, `npm run mock:error`, `npm run mock:slow`.

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
| `app/` | Maršruti (K2 prototipa ekrāni), globālie stili |
| `app/(app)/` | Ekrāni aiz autentifikācijas ar kopīgu navigāciju |
| `components/ui/` | Atkārtoti lietojamie UI elementi |
| `components/states/` | Ielādes, tukšais un kļūdas stāvoklis |
| `components/providers/` | Datu glabātuve (`StoreProvider`) |
| `lib/api/` | API klients: bāzes adrese, galvenes, viens kļūdas tips, galapunkti |
| `lib/domain/` | Naudas un datumu loģika, kategorijas |
| `mock-server/` | Testa serveris bez atkarībām |
| `docs/` | Sprinta plāns |

## Arhitektūra

- **API klients** — `lib/api/client.js`. Bāzes adrese nāk no `NEXT_PUBLIC_API_URL`,
  galvenes (`Accept`, `Content-Type`, `Authorization`, `X-Client`) tiek veidotas vienā vietā,
  visas kļūdas tiek pārveidotas vienā tipā `ApiError` ar lauku `code`.
- **Vertikālā šķēle** — `/ieeja` → `POST /api/auth/login` → marķieris sesijā →
  `/sakums` → `GET /api/subscriptions` + `GET /api/catalog` → saraksts un kopsummas ekrānā.
  Pievienošana: `/pievienot` → `POST /api/subscriptions` → atjaunināts saraksts.
- **Četri ekrāna stāvokļi** sākuma ekrānā: ielāde (S-04A), tukšs (S-04B), kļūda (S-04C), dati (S-04).

## Maršruti

| Maršruts | Prototipa ekrāns |
| --- | --- |
| `/ieeja` | S-01 / S-02 Ieeja |
| `/sakums` | S-04 Sākums un tā stāvokļi |
| `/pievienot` | S-05 Katalogs |
| `/pievienot/[serviceId]` | S-06 Abonementa dati |
| `/pievienot/manuali` | S-05M Pievienot manuāli |
| `/abonements/[id]` | S-10 Detaļas, S-10D dzēšana |
| `/kalendars` | S-11 Kalendārs |
| `/statistika` | S-14 Statistika |
| `/iestatijumi` | S-12 Iestatījumi |

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
