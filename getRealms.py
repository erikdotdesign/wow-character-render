import json
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

def scrape_realms_by_region():
    base_url = "https://worldofwarcraft.blizzard.com/en-us/game/status/"
    regions = ["us", "eu", "kr", "tw"]
    all_realms = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for region in regions:
            url = f"{base_url}{region}"
            print(f"\nScraping {region.upper()} region from: {url}")

            try:
                page.goto(url, timeout=15000)
                page.wait_for_selector("div.RealmsTable", timeout=10000)

                realm_elements = page.query_selector_all(
                    "div.RealmsTable div.SortTable div.SortTable-body div.SortTable-row div.SortTable-col:nth-child(2)"
                )
                realms = [el.inner_text().strip() for el in realm_elements if el.inner_text().strip()]
                all_realms[region] = realms

                print(f"✓ Found {len(realms)} realms in {region.upper()}")

            except PlaywrightTimeout as e:
                print(f"⚠️ Timeout while loading {url}: {e}")
                all_realms[region] = []

            except Exception as e:
                print(f"❌ Error scraping {region.upper()}: {e}")
                all_realms[region] = []

        browser.close()

    # Save to file
    try:
        with open("src/app/assets/realms.json", "w", encoding="utf-8") as f:
            json.dump(all_realms, f, indent=2)
        print("\n✅ Realms saved to realms.json")
    except Exception as e:
        print(f"\n❌ Failed to write realms.json: {e}")

    return all_realms

if __name__ == "__main__":
    realm_data = scrape_realms_by_region()
    print("\n" + json.dumps(realm_data, indent=2))