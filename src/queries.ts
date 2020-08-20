import { WithDatabase } from './WithDatabase'

export const queries = (withDatabase: WithDatabase) => {
    const first = async <T>(query: string, values: any[] = []) => {
        const queryResult = await rows<T>(query, values)
        return queryResult.length > 0 ? queryResult[0] : null
    }

    const rows = <T>(query: string, values: any[] = []) =>
        withDatabase<Array<T>>(async client => {
            const result = await client.query(query, values)
            return result.rows
        })

    const run = (query: string, values: any[] = []) =>
        withDatabase<void>(async client => {
            await client.query(query, values)
        })

    return {
        first,
        rows,
        run
    }
}
