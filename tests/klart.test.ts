import * as faker from 'faker'
import { klart } from '../src/klart'


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

  const { first, rows, run, end } = klart

  beforeAll(async () => {
    await run(
      `CREATE TABLE IF NOT EXISTS dogs (id serial primary key, name varchar(100), age integer)`
    )
  });

  afterAll(async () => {
    await end();
  });

  describe('Klart in general', () => {

    it('Does not crash on load', () => {
      expect(first).toBeDefined()
      expect(rows).toBeDefined()
      expect(run).toBeDefined()
    });

    it('Appears to pick up values from env', async () => {

      expect(process.env.PGHOST).toBeDefined()
      expect(process.env.PGUSER).toBeDefined()
      expect(process.env.PGPASSWORD).toBeDefined()
      expect(process.env.PGDATABASE).toBeDefined()

      const databaseResult = await first<any>(`select current_database()`);
      const userResult = await first<any>(`select current_user`);

      expect(databaseResult.current_database).toEqual(process.env.PGDATABASE);
      expect(userResult.current_user).toEqual(process.env.PGUSER);
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

      it('`first` returns null if no first row is returned', async () => {

        const result = await first('select * from dogs where id = $1', [faker.random.number({ min: 30000, max: 100000 })]);
        expect(result).toBeNull();
      });

      it('is possible to pass `values` to `rows`', async () => {

        const newName = faker.name.firstName();

        const original = await first<Dog>(`INSERT INTO dogs (name, age) VALUES($1, $2) RETURNING *`, [faker.name.firstName(), faker.random.number()]);
        await rows(`update dogs set name = $1 where id = $2`, [newName, original.id]);
        const updated = await first<Dog>('select * from dogs where id = $1', [original.id]);

        expect(original.id).toEqual(updated.id);
        expect(original.name).not.toEqual(newName);
        expect(updated.name).toEqual(newName);
      });
    });
  });
});
