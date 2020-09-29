/**
 * This Node script retrieves all items from a Shuttlerock Board.
 * Then sort them by the number of likes and outputs a JSON file containing the X most popular posts.
 * 
 * Run it with: yarn getMostPopularPosts nameoftheboard numberofposts 
 */

const fs = require('fs')
const chalk = require('chalk')
const axios = require('axios')
const cliProgress = require('cli-progress');

const args = process.argv.slice(2)
const site = args[0]
const board = args[1]
const number_of_items = args[2]
const format = "JSON"

console.log(chalk.green('Starting "getMostPopularPosts" script!'))
console.log(chalk.grey('============================================'))
console.log(chalk.cyan('Using site: ' + site))
console.log(chalk.cyan('Using board: ' + board))
console.log(chalk.cyan('Returning: ' + number_of_items + ' most popular posts.'))
console.log(chalk.cyan('As a: ' + format + ' file.'))
console.log(chalk.grey('============================================'))

const getNumberOfPages = () => {
  return new Promise((resolve) => {
    const url = `https://api.shuttlerock.com/v2/${site}/boards/${board}`
    axios.get(url)
    .then(function (response) {
      const number_of_submissions = response.data.statistics.submissions
      resolve( Math.ceil(number_of_submissions / 20) )
    })
  })
}

const getAPIURL = (page = 1) => {
  return `https://api.shuttlerock.com/v2/${site}/boards/${board}/entries?page=${page}`
}

const loadAllEntries = (page, max_page) => {
  axios.get(getAPIURL(page))
  .then(function (response) {
    scrapingProgress.increment()
    entries = entries.concat(response.data)
    if(page < max_page) {
      loadAllEntries(page + 1, max_page)
    } else {
      scrapingProgress.stop()
      console.log(chalk.green('Finished scraping all pages!'))
      console.log(chalk.grey('============================================'))
      sortEntries()
    }
  })
}

const sortEntries = () => {
  entries = entries.sort((a, b) => (parseInt(a.statistics.social_likes) < parseInt(b.statistics.social_likes)) ? 1 : -1)

  const json_data = JSON.stringify(entries.slice(0, number_of_items))
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  
  const date = new Date()
  const outputFileName = `${site}-${board}--${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}h${date.getMinutes()}m`
  fs.writeFileSync('data/'+ outputFileName +'.json', json_data);
  
  console.log(chalk.green('Created file: ' + outputFileName))
  console.log(chalk.blue((__dirname + '/data/' + outputFileName)))
}

const scrapingProgress = new cliProgress.SingleBar({linewrap: true}, cliProgress.Presets.rect);

let entries = []

getNumberOfPages().then((number_of_pages) => {
  console.log(chalk.grey('============================================'))
  console.log(chalk.cyan('Start scraping API (' + number_of_pages + ' pages)'))
  scrapingProgress.start(number_of_pages, 0)
  loadAllEntries(1, number_of_pages)
})
