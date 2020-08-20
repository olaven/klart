# Klart ![Tests](https://github.com/olaven/klart/workflows/Tests/badge.svg)

## About    
`Klart` is a wrapper around [node-postgres](https://github.com/brianc/node-postgres). It provides 
a simple interface to make queries towards a PostgreSQL database. Like [Kall](https://github.com/olaven/kall), `Klart` grew out of my work on [Krets](https://krets.app). The current featureset is therefore limited to what I have needed there. However, releasing `Klart` as a separate module is the first step into giving it a life of its own. In other words, feel free to reach out with any suggestions of how it could be expanded!

## Installation 
`yarn add klart`

## How to use
All examples use a common `Dog`-type, looking like this: 
```ts
type Dog = { name: string, age: number }; 
```
### Get the first row
```ts
import { first } from "klart";

const fluffy = await first<Dog>("SELECT * FROM dogs WHERE name = $1", [ "fluffy" ]); 
console.log(`Retrieved a dog called ${dog.name} aged ${dog.age}`); 
```

## Get all rows 
```ts
import { rows } from "klart"; 

const dogs = await rows<Dog>("SELECT * FROM dogs"); 
dogs.forEach(dog => {

    console.log(`Retrieved a dog called ${dog.name} aged ${dog.age}`); 
});
```

## Just execute a query
```ts
import { run } from "klart"; 

//NOTE: no result returned when using `run`
await run('INSERT INTO dogs (name, age) VALUES($1, $2)', [ 'Fido', 5 ]); 
```

## Configuration 
`Klart`, like `node-postgres`, picks up the same environment variables as [lipq](https://www.postgresql.org/docs/9.1/libpq-envars.html). 
If you want to ovverride this, you can import `withConfiguration` from `Klart` and use that instead (see example below). As `Klart` really just hands of configuration to `node-postgres`, details on [this page](https://node-postgres.com/features/connecting) is the best source of information for configuration. 
```ts
import { withConfiguration } from "klart"; 
const { first, rows } = withConfiguration({
  user: 'dbuser',
  host: 'database.server.com',
  database: 'mydb',
  password: 'secretpassword',
  port: 3211,
});
```

