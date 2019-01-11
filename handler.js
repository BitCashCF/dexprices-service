const { initDb } = require('./database/db')
const Snapshot = require('./database/snapshotModel')
const { main } = require('./main')
const { TOP_TOKENS_DATA } = require('./constants')

const makeResponse = (response, origin = null) => ({
  statusCode: 200,
  body: JSON.stringify(response),
  headers: {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=0',
  },
})

module.exports = {
  hello: (event, context, callback) => {
    initDb()
      .then(db => {
        const { user, database, port, host } = db
        console.log('db connection successful!', `user ${user} connected on ${host}:${port} to DB "${database}"`)
        callback(null, makeResponse('hello world'))
        db.end()
      })
      .catch(e => {
        console.log('db connection failure', e.message)
        callback(e.message, null)
      })
  },
  buy: (event, context, callback) => {
    try {
      const { queryStringParameters } = event
      if (!queryStringParameters) throw new Error('must include query strings')
      const { amount, symbol, decimals } = queryStringParameters
      if (!amount || !symbol) throw new Error('must include "amount" and "symbol" parameters')

      main(symbol, amount, 'BUY', decimals || null).then(sortedResponses => {
        callback(null, makeResponse(sortedResponses))
      })
    } catch (error) {
      callback(error, null)
    }
  },
  sell: (event, context, callback) => {
    try {
      const { queryStringParameters } = event
      if (!queryStringParameters) throw new Error('must include query strings')
      const { amount, symbol, decimals } = queryStringParameters
      if (!amount || !symbol) throw new Error('must include "amount" and "symbol" parameters')

      main(symbol, amount, 'SELL', decimals || null).then(sortedResponses => {
        callback(null, makeResponse(sortedResponses))
      })
    } catch (error) {
      callback(error, null)
    }
  },
  buyPriceSnapshot: async (event, context, callback) => {
    const batchTimestamp = Date.now()
    const snapshots = []

    const doWorkForPriceLevel = priceLevel => {
      const tokens = JSON.parse(JSON.stringify(TOP_TOKENS_DATA))
      return new Promise(resolve => {
        async function workLoop(currentLevel) {
          const tokenData = tokens.pop()
          console.log(tokens.length)
          if (!tokenData) {
            resolve(snapshots)
            return
          }
          const { symbol, decimals, levels } = tokenData
          try {
            const sortedResponses = await main(symbol, levels[currentLevel], 'BUY', decimals)
            snapshots.push({
              symbol,
              batchTimestamp,
              isSell: false,
              data: sortedResponses,
            })
          } catch (error) {
            // yell in slack that there was a critical error.. this should never happen
            // if we are in this block, it means the `main` routine is broken.
            // the main routine sqeulches its own errors and logs them as results.
            // it should never throw or break control flow
          }

          // sleep for 1s to avoid api rate limits
          setTimeout(() => {
            workLoop(currentLevel)
          }, 1000)
        }
        workLoop(priceLevel)
      })
    }

    // don't use Promise.all.. we don't want these to run concurrently
    // calls are intentionally staggered to avoid API rate limits
    try {
      await doWorkForPriceLevel(0)
      await doWorkForPriceLevel(1)
      await doWorkForPriceLevel(2)

      initDb()
        .then(db => {
          Snapshot.createSnapshots(db, snapshots).then(arr => {
            console.log(`successfully inserted ${arr.length} rows`)
            if (callback) {
              callback(null, snapshots)
            }
            db.end()
          })
        })
        .catch(e => {
          console.log('db connection failure', e.message)
          if (callback) {
            callback(e, null)
          }
        })
    } catch (error) {
      if (callback) {
        callback(error, null)
      }
    }
  },
  sellPriceSnapshot: async (event, context, callback) => {
    const batchTimestamp = Date.now()
    const snapshots = []

    const doWorkForPriceLevel = priceLevel => {
      const tokens = JSON.parse(JSON.stringify(TOP_TOKENS_DATA))
      return new Promise(resolve => {
        async function workLoop(currentLevel) {
          const tokenData = tokens.pop()
          if (!tokenData) {
            resolve(snapshots)
            return
          }
          const { symbol, decimals, levels } = tokenData
          try {
            const sortedResponses = await main(symbol, levels[currentLevel], 'SELL', decimals)
            snapshots.push({
              symbol,
              batchTimestamp,
              isSell: true,
              data: sortedResponses,
            })
          } catch (error) {
            // yell in slack that there was a critical error.. this should never happen
            // if we are in this block, it means the `main` routine is broken.
            // the main routine sqeulches its own errors and logs them as results.
            // it should never throw or break control flow
          }

          // sleep for 1s to avoid api rate limits
          setTimeout(() => {
            workLoop(currentLevel)
          }, 1000)
        }
        workLoop(priceLevel)
      })
    }

    // don't use Promise.all.. we don't want these to run concurrently
    // calls are intentionally staggered to avoid API rate limits
    try {
      await doWorkForPriceLevel(0)
      await doWorkForPriceLevel(1)
      await doWorkForPriceLevel(2)
      initDb()
        .then(db => {
          Snapshot.createSnapshots(db, snapshots).then(arr => {
            console.log(`successfully inserted ${arr.length} rows`)
            if (callback) {
              callback(null, snapshots)
            }
            db.end()
          })
        })
        .catch(e => {
          console.log('db connection failure', e.message)
          if (callback) {
            callback(e, null)
          }
        })
    } catch (error) {
      if (callback) {
        callback(error, null)
      }
    }
  },
}
