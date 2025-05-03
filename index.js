const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));

let browser; // Global browser instance

// Launch Puppeteer in a self-contained async function
(async () => {
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Puppeteer launched successfully.");
  } catch (err) {
    console.error("Failed to launch Puppeteer:", err);
    process.exit(1);
  }
})();

app.get('/character-armory', async (req, res) => {
  const { region, realm, character } = req.query;

  if (!region || !realm || !character) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  const safeRegion = encodeURIComponent(region.trim());
  const safeRealm = encodeURIComponent(realm.trim());
  const safeCharacter = encodeURIComponent(character.trim());

  const characterArmoryUrl = `https://worldofwarcraft.blizzard.com/en-us/character/${safeRegion}/${safeRealm}/${safeCharacter}`;

  try {

    // get character armory page
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

    await page.goto(characterArmoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // find armory intiial state 
    const scriptText = await page.$eval('#character-profile-mount-initial-state', (script) => script.textContent);

    if (!scriptText) {
      await page.close();
      return res.status(404).json({ error: 'Character data script not found' });
    }

    const prefix = 'var characterProfileInitialState = ';
    if (!scriptText.startsWith(prefix)) {
      await page.close();
      return res.status(404).json({ error: 'CharacterProfileInitialState not found or malformed' });
    }

    const jsonPart = scriptText.slice(prefix.length).trim();
    const jsonClean = jsonPart.endsWith(';') ? jsonPart.slice(0, -1) : jsonPart;

    const characterInitialState = JSON.parse(jsonClean);

    // pull desired data from initial state
    const characterData = {
      name: characterInitialState?.character?.name,
      render: {
        characterUrl: characterInitialState?.character?.renderRaw?.url,
        backgroundUrl: characterInitialState?.character?.render?.background?.url,
        shadowUrl: characterInitialState?.character?.render?.shadow?.url
      }
    }

    await page.close();

    if (!characterData.name) {
      return res.status(404).json({ error: 'renderRaw URL not found in character data' });
    }

    return res.json(characterData);

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