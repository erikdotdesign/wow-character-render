import json
from playwright.sync_api import sync_playwright

def scrape_realms_by_region():
    base_url = "https://worldofwarcraft.blizzard.com/en-us/game/status/"
    regions = ["us", "eu", "kr", "tw"]
    all_realms = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for region in regions:
            url = f"{base_url}{region}"
            print(f"Scraping {region.upper()} region from: {url}")
            page.goto(url)
            page.wait_for_selector("div.RealmsTable", timeout=10000)

            # Get realm names from first column of each table row
            realm_elements = page.query_selector_all("div.RealmsTable div.SortTable div.SortTable-body div.SortTable-row div.SortTable-col:nth-child(2)")
            realms = [el.inner_text().strip() for el in realm_elements if el.inner_text().strip()]
            all_realms[region] = realms

        browser.close()

    # Save result to file
    with open("realms.json", "w") as f:
        json.dump(all_realms, f, indent=2)

    return all_realms

if __name__ == "__main__":
    realm_data = scrape_realms_by_region()
    print(json.dumps(realm_data, indent=2))
