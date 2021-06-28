import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT * FROM trade_users
      WHERE (chain_id = '56' OR chain_id = '1' OR chain_id = '128' OR chain_id = '137')
      LIMIT 5000
  `)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
