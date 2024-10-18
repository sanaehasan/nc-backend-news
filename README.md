# Northcoders News API

This is an API application that represents a mini version of a news API that serves articles and allows users to add comments and votes linked to them.

To run the API locally, you must add two environment variables files, one for development (.env.development) and another for the test (.env.test).
Add the names of your development and test databases to these files as demonstrated in the example below:
PGDATABASE=database_name_here

to clone this project please follow the example below :
$git clone https://github.com/sanaehasan/nc-backend-news.git

install dependencies by using the command :
$ npm install

The packatge.json includes all the dependencies needed in this project.

To set-up the local database run the command:
$npm set-up dbs

To seed the local database run the command:
$npm run seed

The minimum versions to run this project

Node.js:v22.9.0
Postgres:psql (PostgreSQL) 14.13

The hosted version of this API can be found at this link : https://nc-backend-news.onrender.com
