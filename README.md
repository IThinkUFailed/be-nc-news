# Northcoders News API

This project utilises two databases. A test and development database. The database software of choice is Postgres and will need to be installed along with pg-format.

Please ensure you create two .env files associated with this. They should be as follows:

**.env.test**
```
PGDATABASE=nc_news_test
```

**.end.development**
```
PGDATABASE=nc_news
```

To ensure your databases are created and ready to go you may execute the following commands:
```
psql -f db/setup.sql
npm run seed
```

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
