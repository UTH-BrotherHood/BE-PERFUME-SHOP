import databaseServices from './database.services'

class SearchService {
  async search(content: string) {
    const result = await databaseServices.query(`SELECT * FROM products WHERE name LIKE $1`, [`%${content}%`])
    return result.rows
  }
}

const searchService = new SearchService()
export default searchService
