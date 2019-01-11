module.exports = class Snapshot {
  static async createSnapshots(db, snapshots) {
    const promises = []
    snapshots.forEach(snapshot => {
      const { batchTimestamp, data, isSell } = snapshot

      data.forEach(obj => {
        const { exchangeName, totalPrice, tokenAmount, tokenSymbol, timestamp, error } = Object.values(obj)[0]
        const query = `INSERT INTO \
      snapshots(exchange_name, total_price, token_amount, token_symbol, error_message, is_sell, timestamp, batch_timestamp) \
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) \
      returning *`
        const values = [
          exchangeName,
          totalPrice || null,
          tokenAmount,
          tokenSymbol,
          error || null,
          isSell,
          timestamp,
          batchTimestamp,
        ]
        promises.push(db.query(query, values))
      })
    })

    return Promise.all(promises)
  }
}
