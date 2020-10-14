Shopping list app using Event Sourcing & CQRS
--------------------------------------------

Install:

`docker-compose up`

`docker exec -it shopping-list-cqrs_postgres_1 psql -U postgres -H postgres -d postgres -a -f initialdata/schema.sql`

`docker exec -it shopping-list-cqrs_postgres_1 psql -U postgres -H postgres -d postgres -a -f initialdata/view_update.sql`




