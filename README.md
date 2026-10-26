# SubSet

[![CI](https://github.com/semekooanastasia/SubSet/actions/workflows/ci.yml/badge.svg)](https://github.com/semekooanastasia/SubSet/actions/workflows/ci.yml)

Abonementu pārvaldības lietotne: apkopo visus lietotāja aktīvos abonementus vienuviet,
rāda gaidāmos maksājumus laika skalā un brīdina pirms naudas norakstīšanas.

RTU studiju projekts (4. kurss). Autore: Anastasija Semeko.

## Palaišana

```bash
npm install
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run mock                   # 1. terminālis: testa serveris portā 4000
npm run dev                    # 2. terminālis: lietotne http://localhost:3100
```

Pieteikšanās testa serverī: jebkurš e-pasts ar `@`. Paroli šī versija neprasa — skatīt
[docs/API.md](docs/API.md) sadaļu par zināmajiem ierobežojumiem.

### Testa servera scenāriji

Ekrāna stāvokļus var demonstrēt, palaižot testa serveri ar citu scenāriju:

| Komanda | Ko rāda sākuma ekrāns |
| --- | --- |
| `npm run mock` | S-04 dati — pieci abonementi un kopsummas |
| `npm run mock:empty` | S-04B tukšais stāvoklis |
| `npm run mock:error` | S-04C kļūdas stāvoklis |
| `npm run mock:slow` | S-04A ielādes stāvoklis (atbilde pēc 3 s) |

### Testi

```bash
npm test                       # node:test, bez papildu atkarībām
```

Būvēšana: `npm run build`.

## Tehnoloģijas

- Next.js 16 (App Router) + React 19, bez UI bibliotēkām
- Dati nāk no REST API; izstrādē to aizstāj testa serveris `mock-server/` (tīrs Node, bez atkarībām)
- Sesijas marķieris un lietotāja iestatījumi tiek glabāti pārlūkā (`localStorage`)
- Lokālie paziņojumi ar pārlūka `Notification` API
- Vienībtesti ar `node:test`

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
| `public/icons/` | Saskarnes ikonas no K2 prototipa (SVG) |
| `public/logos/` | Pakalpojumu logotipi no K2 prototipa |
| `mock-server/` | Testa serveris bez atkarībām |
| `tests/` | Vienībtesti naudas, datumu un .csv loģikai |
| `docs/` | Sprinta plāni un sprinta kartīte |

## Arhitektūra

- **API klients** — `lib/api/client.js`. Bāzes adrese nāk no `NEXT_PUBLIC_API_URL`,
  galvenes (`Accept`, `Content-Type`, `Authorization`, `X-Client`) tiek veidotas vienā vietā,
  visas kļūdas tiek pārveidotas vienā tipā `ApiError` ar lauku `code`.
- **Vertikālā šķēle** — `/ieeja` → `POST /api/auth/login` → marķieris sesijā →
  `/sakums` → `GET /api/subscriptions` + `GET /api/catalog` → saraksts un kopsummas ekrānā.
  Pievienošana: `/pievienot` → `POST /api/subscriptions` → atjaunināts saraksts.
- **Četri ekrāna stāvokļi** sākuma ekrānā: ielāde (S-04A), tukšs (S-04B), kļūda (S-04C), dati (S-04).
- **Domēna slānis** — `lib/domain/`. Visi naudas un datumu aprēķini ir ārpus komponentēm,
  tīrās funkcijās, kuras sedz `tests/`.
- **Ikonas** — `components/ui/Icon.js` ielādē SVG no `public/icons/` kā CSS masku,
  tāpēc krāsu dod `currentColor` un viena ikona der abos režīmos. Pakalpojumu logotipi
  (`public/logos/`) ir attēli ar savām zīmola krāsām; sasaiste ir `lib/domain/logos.js`.

Galapunkti, kļūdu kodi un pamatojums, kāpēc pagaidām tiek lietots testa serveris:
[docs/API.md](docs/API.md).

## Maršruti

| Maršruts | Prototipa ekrāns |
| --- | --- |
| `/ieeja` | S-01 / S-02 Ieeja |
| `/sakums` | S-04 Sākums un tā stāvokļi |
| `/pievienot` | S-05 Katalogs |
| `/pievienot/[serviceId]` | S-06 Abonementa dati |
| `/pievienot/manuali` | S-05M Pievienot manuāli |
| `/pievienot/parskats` | S-07 Pārskats pirms saglabāšanas |
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
- Bezmaksas izmēģinājuma atzīme: summa netiek ieskaitīta, kamēr izmēģinājums nav beidzies
- Maksājumu kalendārs un izdevumu sadalījums pa kategorijām
- Lokālie paziņojumi pirms maksājuma ar konfigurējamu brīdinājuma laiku
- Bankas izraksta .csv imports ar apstiprināšanas sarakstu

## Darba process

- Atzaru nosaukumi, commit ziņojumi un pull request prasības: [CONTRIBUTING.md](CONTRIBUTING.md)
- Pabeigtības definīcija: [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)
- Iepriekšējais sprints: [docs/SPRINT-1.md](docs/SPRINT-1.md)
- Aktuālais sprints: [docs/SPRINT-2.md](docs/SPRINT-2.md)
