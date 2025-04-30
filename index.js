const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let browser; // Global browser instance

(async () => {
  browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
})();

app.get('/character-render', async (req, res) => {
  const { region, realm, character } = req.query;

  if (!region || !realm || !character) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  const characterUrl = `https://worldofwarcraft.blizzard.com/en-us/character/${region}/${realm.toLowerCase()}/${character.toLowerCase()}`;

  try {
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(characterUrl, { waitUntil: 'domcontentloaded' });

    const scriptText = await page.$eval('#character-profile-mount-initial-state', (script) => script.textContent);

    if (!scriptText) {
      await page.close();
      return res.status(404).json({ error: 'Character data script not found' });
    }

    // 🔥 Correct way: slice between assignment and semicolon
    const prefix = 'var characterProfileInitialState = ';
    if (!scriptText.startsWith(prefix)) {
      await page.close();
      return res.status(404).json({ error: 'CharacterProfileInitialState not found or malformed' });
    }

    const jsonPart = scriptText.slice(prefix.length).trim();
    const jsonClean = jsonPart.endsWith(';') ? jsonPart.slice(0, -1) : jsonPart;

    const characterData = JSON.parse(jsonClean);

    const renderRawUrl = characterData?.character?.renderRaw?.url;

    await page.close();

    if (!renderRawUrl) {
      return res.status(404).json({ error: 'renderRaw URL not found in character data' });
    }

    return res.json({ imageUrl: renderRawUrl });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Failed to fetch character render' });
  }
});

app.listen(PORT, () => {
  console.log(`Optimized Puppeteer proxy server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit();
});

// app.get('/realms', async (req, res) => {
//   const { region = 'us' } = req.query;
//   const baseUrl = 'https://worldofwarcraft.blizzard.com/en-us/game/status/';

//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
  
//     const url = `${baseUrl}${region}`;
//     console.log(`Scraping ${region.toUpperCase()} from ${url}`);
//     await page.goto(url, { waitUntil: 'networkidle0' });

//     // Wait for realms table
//     await page.waitForSelector('div.RealmsTable');

//     // grab the realm names
//     const realmNames = await page.$$eval(
//       'div.RealmsTable div.SortTable div.SortTable-body div.SortTable-row div.SortTable-col:nth-child(2)',
//       elements =>
//         elements
//           .map(el => el.textContent.trim())
//           .filter(name => name.length > 0)
//     );
  
//     await browser.close();

//     res.json(realmNames);
//   } catch (error) {
//     console.error('Failed to scrape realm names:', error);
//     res.status(500).json({ error: 'Failed to retrieve realm list' });
//   }
// });