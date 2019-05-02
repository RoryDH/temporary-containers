const express = require('express')
const morgan = require('morgan')
const maxmind = require('maxmind')

const app = express()
const port = 3123

const dbFile = "./GeoLite2-City.mmdb"

console.log(`opening ${dbFile}`)

let cityLookup
try {
  cityLookup = maxmind.openSync(dbFile)
} catch(error) {
  console.log("error opening", error)
  process.exit(1)
}

app.use(morgan('short'))

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/lookup/:ip', (req, res) => {
  let { ip } = req.params
  let result = cityLookup.get(ip)
  if (result) {
    res.json(result)
    let { country } = result
    if (country) {
      console.log(`${ip} => ${country.iso_code}`)
    } else {
      console.log(`no country for ${ip}`)
      console.log(JSON.stringify(result))
    }
  } else {
    res.status(404)
    res.send({ error: 'Not found' })
  }
})



app.listen(port, () => console.log(`Geoip app listening on port ${port}!`))


// const maxmind = require('maxmind')
// const dbFile = "./GeoLite2-City.mmdb"
// 
// console.log(`opening ${dbFile}`)
// 
// let cityLookup
// try {
//   cityLookup = maxmind.openSync(dbFile)
// } catch(error) {
//   console.log("error opening", error)
//   process.exit(1)
// }
// 
// const { Resolver } = require('dns').promises;
// const resolver = new Resolver();
// resolver.setServers(['1.1.1.1']);
// 
// let printDomainCountry = (domain) => resolver.resolve4(domain).then(addresses => {
//   if (addresses.length > 0) {
//     let result = cityLookup.get(addresses[0])
//     if (result && result.country) {
//       console.log(`${result.country.iso_code} ${domain}`)
//     }
//   }
// }).catch(console.error)
// 
// for (domain of domains) {
//   printDomainCountry(domain)
// }
// 
// 
// async function getCountry(domain) {
//   const addresses = await resolver.resolve4(domain)
//   if (addresses.length) {
//     let result = cityLookup.get(addresses[0])
//     return result && result.country && result.country.iso_code
//   }
}
