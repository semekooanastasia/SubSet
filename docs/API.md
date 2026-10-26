# API līgums un lēmums par īsto serveri

Šis dokuments apraksta līgumu, pret kuru lietotne runā, un pamato, kāpēc 2. sprinta
beigās tā vietā joprojām darbojas testa serveris `mock-server/`.

## Lēmums

**Šajā sprintā lietotne paliek pie testa servera.** Pamatojums:

1. **Datu avots prasa licenci.** Vienīgais īstais datu avots SubSet gadījumā ir bankas
   konta izraksts caur PSD2. Piekļuve prasa licencētu AISP starpnieku un līgumu —
   tas nav students nedēļas laikā izdarāms un nav šī kursa darba apjomā.
2. **Savs serveris nedotu neko jaunu.** Uzrakstīt savu Node serveri ar datubāzi nozīmētu
   pārrakstīt to pašu, ko jau dara `mock-server/`, bet ar `PostgreSQL` aiz tā. Vertikālā
   šķēle no tā nemainās; mainās tikai glabāšanas vieta.
3. **Pāreja ir sagatavota.** Lietotnē nav neviena `fetch` izsaukuma ārpus `lib/api/`.
   Adrese nāk no `NEXT_PUBLIC_API_URL`, tāpēc pāreja uz īstu serveri ir viena vērtības
   maiņa `.env.local` failā, nevis koda labojums.

Pārbaude, ka 3. punkts ir patiess:

```bash
grep -rn "fetch(" app components lib | grep -v "lib/api/client.js"   # tukšs
```

## Bāze

- Adrese: `NEXT_PUBLIC_API_URL` (izstrādē `http://localhost:4000`)
- Formāts: JSON, `Content-Type: application/json; charset=utf-8`
- Galvenes katrā pieprasījumā: `Accept`, `X-Client: subset-web`, `Authorization: Bearer <marķieris>`
- Marķieris tiek saņemts no `/api/auth/login` un glabāts pārlūkā (`localStorage`)

## Galapunkti

| Metode | Ceļš | Atbilde | Piezīmes |
| --- | --- | --- | --- |
| `GET` | `/api/health` | `{ status, scenario }` | Bez autorizācijas |
| `POST` | `/api/auth/login` | `{ token, user }` | Bez autorizācijas |
| `GET` | `/api/catalog` | `{ items: Service[] }` | Populāro pakalpojumu katalogs |
| `GET` | `/api/subscriptions` | `{ items: Subscription[] }` | |
| `POST` | `/api/subscriptions` | `Subscription`, 201 | |
| `GET` | `/api/subscriptions/:id` | `Subscription` | |
| `PATCH` | `/api/subscriptions/:id` | `Subscription` | Daļējs atjauninājums |
| `DELETE` | `/api/subscriptions/:id` | 204, bez satura | |

### Subscription

```json
{
  "id": "sub-1",
  "catalogId": "spotify",
  "name": "Spotify Premium",
  "planLabel": "Student",
  "amount": 7.99,
  "cycle": "monthly",
  "category": "Mūzika",
  "nextPayment": "2026-11-05",
  "trialUntil": null,
  "amountAfterTrial": null
}
```

- `cycle`: `"monthly"` vai `"yearly"`
- `nextPayment`, `trialUntil`: datums formā `YYYY-MM-DD`
- `amount`: skaitlis eiro, ne centos; noapaļošana līdz centiem notiek lietotnē (`roundCents`)
- `catalogId`: pēc tā lietotne izvēlas logotipu no `lib/domain/logos.js`; `null` nozīmē
  abonementu ārpus kataloga (tiek rādīta monogramma)

`Service` lauki `mark` un `color` ir no agrākās versijas, kad plāksnītē tika rādīta
monogramma. Tagad logotipu izvēlas lietotne pēc `id`; `color` paliek lietots kalendāra
punktiņiem, `mark` vairs netiek rādīts.

### Service

```json
{
  "id": "spotify",
  "name": "Spotify",
  "category": "Mūzika",
  "color": "#1DB954",
  "mark": "S",
  "cancelUrl": "https://www.spotify.com/account/subscription/",
  "plans": [{ "label": "Student", "amount": 7.99, "cycle": "monthly" }]
}
```

## Kļūdas

Kļūdas atbildes ķermenis vienmēr ir vienāds:

```json
{ "error": { "code": "VALID-01", "message": "Nosaukums ir obligāts." } }
```

Lietotnē tas kļūst par `ApiError` ar laukiem `code`, `status`, `message`.

| Kods | Statuss | Kad |
| --- | --- | --- |
| `NET-01` | 0 | Nav savienojuma ar serveri (`fetch` meta kļūdu) |
| `PARSE-01` | jebkurš | Atbilde nav derīgs JSON |
| `AUTH-01` | 401 | Trūkst vai nederīga `Authorization` galvene |
| `AUTH-02` | 400 | Nederīgs e-pasta formāts |
| `VALID-01` | 422 | Trūkst obligāta lauka abonementā |
| `VALID-02` | 400 | Nederīgs JSON pieprasījumā |
| `SUB-404` | 404 | Abonements nav atrasts |
| `SYNC-01` | 500 | Servera kļūda (testa serverī — scenārijs `error`) |
| `HTTP-<n>` | n | Atbilde bez sava koda |

## Testa servera scenāriji

`MOCK_SCENARIO` maina visa servera uzvedību, lai ekrāna stāvokļus varētu demonstrēt
bez koda labošanas:

| Scenārijs | Uzvedība |
| --- | --- |
| `ok` | Normāla atbilde pēc 400 ms, pieci abonementi |
| `empty` | Abonementu saraksts tukšs |
| `error` | Visi ceļi, izņemot `/api/health`, atbild ar 500 `SYNC-01` |
| `slow` | Atbilde pēc 3000 ms |

## Zināmie ierobežojumi

- **Paroles nav.** Ieejas ekrānā ir tikai e-pasta lauks, `lib/api/auth.js` nosūta tikai
  e-pastu, un testa serveris paroli nepārbauda. Īstam serverim pieteikšanās pieprasījumā
  jāpieņem arī parole (glabāta kā jaucējsumma ar sāli) un jāatbild ar 401 `AUTH-03`,
  ja tā nesakrīt.
- **Marķierim nav derīguma termiņa.** Testa serveris to neizsniedz un nepārbauda.
- **Dati nav piesaistīti lietotājam.** Testa serverim ir viens kopīgs abonementu saraksts.
