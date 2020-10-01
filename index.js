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
const number_of_items_per_page = args[2]
const format = "JSON"

console.log(chalk.green('Starting "getMostPopularPosts" script!'))
console.log(chalk.grey('============================================'))
console.log(chalk.cyan('Using site: ' + site))
console.log(chalk.cyan('Using board: ' + board))
console.log(chalk.cyan('Returning: ' + number_of_items_per_page + ' items per json file.'))
console.log(chalk.cyan('As a: ' + format + ' file.'))
console.log(chalk.grey('============================================'))

const getNumberOfPages = async () => {
  const boards = board.split(',')
  return new Promise( async (resolve) => {
    let number_of_submissions = 0
    while(boards.length > 0) {
      const nextBoard = boards.pop()
      const url = `https://api.shuttlerock.com/v2/${site}/boards/${nextBoard}`
      await axios.get(url)
      .then(function (response) {
        number_of_submissions += response.data.statistics.submissions
      })
    }
    generateStatusJSON(number_of_submissions)
    resolve( Math.ceil(number_of_submissions / number_of_items_per_page) )
  })
}

const generateStatusJSON = (number_of_submissions) => {
  const data = {
    total_entries: number_of_submissions,
    total_pages: Math.ceil(number_of_submissions / number_of_items_per_page),
    entries_per_page: number_of_items_per_page,
    updated_at: new Date()
  }
  const json_data = JSON.stringify(data)
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  const outputFileName = `liked-entry-${board}-status.json`
  fs.writeFileSync('data/'+ outputFileName, json_data)
  console.log(chalk.green('Created file: ' + outputFileName))
  console.log(chalk.yellow((__dirname + '/data/' + outputFileName)))
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
  generateEntriesJSONFiles()
}

const generateEntriesJSONFiles = () => {
  let i,j,chunk = parseInt( number_of_items_per_page )
  let pageCount = 1
  for (i=0,j=entries.length; i<j; i+=chunk) {
    const entries_portion = entries.slice(i,i+chunk)
    const json_data = JSON.stringify(entries_portion)
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data')
    }
    const outputFileName = `liked-entry-${board}-${pageCount}.json`
    fs.writeFileSync('data/'+ outputFileName, json_data);
    
    console.log(chalk.green('Created file: ' + outputFileName))
    console.log(chalk.yellow((__dirname + '/data/' + outputFileName)))

    pageCount++
  }
}

const scrapingProgress = new cliProgress.SingleBar({linewrap: true}, cliProgress.Presets.rect);

let entries = []

getNumberOfPages().then((number_of_pages) => {
  console.log(chalk.grey('============================================'))
  console.log(chalk.cyan('Start scraping API (' + number_of_pages + ' pages)'))
  scrapingProgress.start(number_of_pages, 0)
  loadAllEntries(1, number_of_pages)
})
