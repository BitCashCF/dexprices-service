const PARADEX_URL = 'http://api.paradex.io/api/v1'
const IDEX_URL = 'https://api.idex.market'
const KYBER_URL = 'https://api.kyber.network'
const BANCOR_URL = 'https://api.bancor.network/0.1'
const DDEX_URL = 'https://api.ddex.io/v3'
const RADAR_RELAY_URL = 'https://api.radarrelay.com/v2'

const AIRSWAP_TOKEN_METADATA_URL = 'https://token-metadata.production.airswap.io'

const TOP_TOKENS_DATA = [
  { symbol: 'BNB', decimals: 18, levels: calculateLevels(20) },
  { symbol: 'MKR', decimals: 18, levels: calculateLevels(0.25) },
  { symbol: 'OMG', decimals: 18, levels: calculateLevels(65) },
  { symbol: 'ZIL', decimals: 12, levels: calculateLevels(5000) },
  { symbol: 'ZRX', decimals: 18, levels: calculateLevels(312) },
  { symbol: 'BAT', decimals: 18, levels: calculateLevels(715) },
  { symbol: 'LINK', decimals: 18, levels: calculateLevels(250) },
  { symbol: 'REP', decimals: 18, levels: calculateLevels(10) },
  { symbol: 'GNO', decimals: 18, levels: calculateLevels(8) },
  { symbol: 'DAI', decimals: 18, levels: calculateLevels(100) },
  { symbol: 'MANA', decimals: 18, levels: calculateLevels(2000) },
  { symbol: 'WTC', decimals: 18, levels: calculateLevels(83) },
  { symbol: 'BNT', decimals: 18, levels: calculateLevels(140) },
  { symbol: 'KNC', decimals: 18, levels: calculateLevels(625) },
  { symbol: 'LRC', decimals: 18, levels: calculateLevels(2222) },
  { symbol: 'REN', decimals: 18, levels: calculateLevels(4000) },
  { symbol: 'AST', decimals: 18, levels: calculateLevels(3333) },
  { symbol: 'LOOM', decimals: 18, levels: calculateLevels(2000) },
  { symbol: 'FUN', decimals: 18, levels: calculateLevels(25000) },
  { symbol: 'REQ', decimals: 18, levels: calculateLevels(4000) },
  { symbol: 'SNT', decimals: 18, levels: calculateLevels(4000) },
]

function calculateLevels(firstLevel) {
  const results = [firstLevel]
  results.push(firstLevel * 2.5)
  results.push(results[1] * 2.5)
  results.push(results[2] * 2.5)
  return results
}

module.exports = {
  PARADEX_URL,
  IDEX_URL,
  KYBER_URL,
  BANCOR_URL,
  DDEX_URL,
  RADAR_RELAY_URL,
  AIRSWAP_TOKEN_METADATA_URL,
  TOP_TOKENS_DATA,
}
