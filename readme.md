<div align="center">
    <img src="./ekstra/img/musicbase-header.png" style="width: 100%;"> 
</div>

# SQL og databaser

I dette projekt har vi lavet et program bestående af to programmer, et backend og frontend program. I [backend programmet](https://github.com/JonLundby/music-base-backend-jmmp.git) tilgåes der en MySQL database, hvor det gøres muligt at kunne manipulere 3 overordnet tabeller. Tabellerne er det overordnet databefinder sig er en albums, artists og tracks tabel. Det er muligt i de tre tabeller at kunne foretage de 4 CRUD funktioner `Create, Read, Update, Delete`.

Det er så muligt i vores [frontend program](https://jonlundby.github.io/music-base-frontend-jmmp/) få dataen fra databasen gennem backend og vise det. I frontend kan du så søge på både albums, artists & tracks. Hvis du vil vide mere omkring de forskellige tabeller, kan du hover musen og et element og få hvis, hvad det indeholder.

### Connection til azure node.js app

For at gøre det muligt for vores frontend program at kunne hente data fra en database, har vi lavet et program der ligger online hos [Microsofts Azure](https://musicbase-backend-jmmp.azurewebsites.net/). Vi bruger så dette link til at connecte vores frontend og backend program sammen, således at backend kører funktioner der snakker sammen med databasen, og så spørger vores frontend om at få den behandlet data.
