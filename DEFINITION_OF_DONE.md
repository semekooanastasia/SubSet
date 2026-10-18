# Pabeigtības definīcija (Definition of Done)

Backlog vienība tiek uzskatīta par pabeigtu, kad izpildīti **visi** punkti:

1. **Akcepta kritēriji** — visi vienības akcepta kritēriji ir izpildīti un pārbaudīti manuāli lietotnē.
2. **Kods `main` atzarā** — darbs ir apvienots caur pull request, nevis iegrūsts tieši `main`.
3. **Apskate** — vismaz viens komandas biedrs ir atstājis komentārus un apstiprinājis pull request.
4. **CI ir zaļš** — `npm ci` un `npm run build` GitHub Actions izpildās bez kļūdām.
5. **Nav noslēpumu** — repozitorijā nav atslēgu, paroļu un `.env` failu; `.gitignore` ir aktuāls.
6. **Pārbaudīts mobilajā skatā** — ekrāns darbojas 375 px platumā gan gaišajā, gan tumšajā režīmā.
7. **Nav kļūdu konsolē** — pārlūka konsolē nav kļūdu paziņojumu.
8. **Dokumentēts** — ja mainās palaišana vai struktūra, atjaunināts README.

Vienība, kas neatbilst kaut vienam punktam, sprinta beigās tiek skaitīta kā **nepabeigta**
un pārceļas uz nākamo sprintu — tā netiek "gandrīz pabeigta".
