import * as faker from 'faker'
import { klar } from '../src/klar'


require('dotenv').config();

describe('Klar', () => {
  //NOTE: tests have `dogs`-table as an example
  interface Dog {
    id?: string
    name: string
    age: number
  }
  const randomDog = () => ({
    name: faker.name.firstName(),
    age: faker.random.number()
  });

  const { first, rows, run, end } = klar()

  beforeAll(async () => {
    await run(
      `CREATE TABLE IF NOT EXISTS dogs (id serial primary key, name varchar(100), age integer)`
    )
  });

  afterAll(async () => {
    await end()
  });

  describe('Klar in general', () => {
    it('Does not crash on load', () => {
      expect(first).toBeDefined()
      expect(rows).toBeDefined()
      expect(run).toBeDefined()
    });

    it('Does accept a PoolConfig object', () => {
      expect(async () => {
        const k = klar({
          port: 1234,
          user: 'some test user hello'
        });

        await k.end();
      }).not.toThrow()
    });
    it('Appears to pick up values from env', async () => {
      expect(process.env.PGHOST).toBeDefined()
      expect(process.env.PGUSER).toBeDefined()
      expect(process.env.PGPASSWORD).toBeDefined()
      expect(process.env.PGDATABASE).toBeDefined()

      const result = await first(
        `select max(table_catalog) as x from information_schema.tables`,
        []
      )
      expect(result).toBeDefined()
    });

    describe('Getting first row', () => {
      it('Is possible to persist data', async () => {
        const name = faker.name.firstName()
        const age = faker.random.number()

        const dog = await first<Dog>(`INSERT INTO dogs (name, age) VALUES($1, $2) RETURNING *`, [
          name,
          age
        ])

        expect(dog).not.toBeNull()

        console.log(dog)
        expect(dog?.name).toEqual(name)
        expect(dog?.age).toEqual(age)
      });

      it('Is possible to retrieve all with `rows`', async () => {
        const dogs = [
          randomDog(),
          randomDog(),
          randomDog(),
          randomDog(),
          randomDog(),
          randomDog(),
          randomDog(),
          randomDog()
        ]

        const ids = []
        for (const { name, age } of dogs) {
          const { id } = await first<Dog>(
            `INSERT INTO dogs (name, age) VALUES ($1, $2) RETURNING *`,
            [name, age]
          )
          ids.push(id)
        }

        const all = (await rows<Dog>(`SELECT * FROM dogs`, [])).map(dog => dog.id)
        for (const id of ids) {
          expect(all.includes(id)).toBeTruthy()
        }
      });
    });
  });
});
