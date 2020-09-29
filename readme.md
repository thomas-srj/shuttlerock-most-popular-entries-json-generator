## What is it?

This NodeJS script takes 3 parameters:
-  Shuttlerock's Site ( **X** ),
-  Shuttlerock's Board ( **Y** ),
-  number of posts ( **N** ).

Based on those, it will create a JSON file containing the **N** most popular entries on the board **Y** from site **X**.


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

`npm run getMostPopularPosts keiji last-of-birth 20`

Will get the **20** most popular posts of the board **last-of-birth** on the site **keiji**

## How to get the JSON file

After running the previous command, the script will create a folder called **data** within the project's folder. Within this data folder you will find the generated JSON file(s).

### Support

For any questions please ask @thomas on Shuttlerock's Slack.