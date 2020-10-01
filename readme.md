## What is it?

This NodeJS script takes 3 parameters:
-  Shuttlerock's Site ( **X** ),
-  Shuttlerock's Board ( **Y** ),
-  Number of entries per page ( **N** ).

The script will get all the entries for this board, order them by their number of `social_likes` and then create multiple JSON files containing N entries each.

## Installation

You need to have **NodeJS installed**.
Please check https://nodejs.org/en/download/
( 日本語： https://nodejs.org/ja/download/ )

Once installed, open the terminal and go into the project folder.

Then run:

`npm install`

## How to use

The command is:

`npm run getMostPopularPosts [site name] [board name] [number of results]`

So for example:

`npm run getMostPopularPosts test-site board-1 20`

or, to merge multiple boards:

`npm run getMostPopularPosts test-site board-1,board-2,board-3 20`

## How to get the JSON file

After running the previous command, the script will create a folder called **data** within the project's folder. Within this data folder you will find the generated JSON file(s).

The script creates a file called `liked-entry-{board name}-status.json` containing useful datas such as update date, number of entries and pages.

### Support

For any questions please ask @thomas on Shuttlerock's Slack.