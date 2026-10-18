# Darba vienošanās

## Atzari

`main` vienmēr ir būvējams. Darbs notiek atsevišķos atzaros:

```
feat/<īss-apraksts>     jauna funkcionalitāte      feat/izmeginajuma-periods
fix/<īss-apraksts>      kļūdas labojums            fix/kalendara-gada-maksajumi
chore/<īss-apraksts>    uzturēšana, konfigurācija  chore/github-actions
docs/<īss-apraksts>     dokumentācija              docs/sprinta-plans
```

Tikai mazie burti, vārdi atdalīti ar defisēm, bez diakritiskajām zīmēm.

## Commit ziņojumi

Formāts: `<tips>: <darbība pavēles formā>`, pirmā rinda līdz 72 zīmēm.

Tipi: `feat`, `fix`, `chore`, `docs`, `test`, `ci`, `refactor`.

```
feat: pievienot izmēģinājuma perioda atzīmi abonementam
fix: nerādīt gada abonementu divreiz kalendārā
```

Slikti: `update`, `fixes`, `darbs`, `asdf`.

## Pull request

1. Katrai backlog vienībai — savs atzars un savs pull request uz `main`.
2. PR aprakstā: ko maina, kā pārbaudīt, uz kuru backlog vienību attiecas.
3. Nepieciešams vismaz viens komandas biedra apskats.
4. Pirms apvienošanas CI ir zaļš un izpildīta [pabeigtības definīcija](DEFINITION_OF_DONE.md).

## Noslēpumi

Repozitorijā netiek glabātas atslēgas, paroles vai `.env` faili.
Mainīgo nosaukumi (bez vērtībām) tiek uzskaitīti `.env.example`.
