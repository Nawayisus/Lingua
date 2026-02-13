from playwright.sync_api import sync_playwright

def verify(page):
    page.goto("http://localhost:8080")
    page.wait_for_selector("#sourceLang")

    # Take a screenshot of the form area
    page.screenshot(path="verification/form_area.png")
    print("Screenshot saved to verification/form_area.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify(page)
        finally:
            browser.close()
