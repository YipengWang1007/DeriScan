import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT * FROM trade_events
      WHERE (chain_id = '56' OR chain_id = '1' OR chain_id = '128' OR chain_id = '137')
      AND timestamp >= DATE_SUB(NOW(), INTERVAL 168 HOUR)
      ORDER BY timestamp DESC
      LIMIT 5000
  `)

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
