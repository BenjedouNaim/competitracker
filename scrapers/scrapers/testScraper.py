from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import re

# Use Playwright to scrape the page
with sync_playwright() as p:
    # Launch the browser
    browser = p.chromium.launch(headless=True)  # Set headless=False to see the browser
    page = browser.new_page()

    # Navigate to the URL
    url = "https://megapc.tn/shop/PC%20PORTABLE/PC%20PORTABLE%20PRO"
    page.goto(url)

    # Wait for the page to load completely
    page.wait_for_load_state("networkidle")

    # Get the fully rendered HTML
    html = page.content()

    # Use BeautifulSoup to parse the HTML
    soup = BeautifulSoup(html, "html.parser")

    # Extract product blocks
    products = soup.select("article.flex.flex-col.product-card")

    # Iterate through each product and extract details
    for product in products:
        product_name_tag = product.select_one("p.text-skin-base.text-sm.leading-5.line-clamp-2.mb-2")
        price_tag = product.select_one("span.inline-block.font-semibold.text-15px.lg\\:text-base.text-skin-primary")
        previous_price = product.select_one("del.text-sm.text-gray-400.text-opacity-70")
        product_url_tag = product.select_one("a[href^='/shop/product']")
        # Extract text content and handle missing elements
        product_name = product_name_tag.get_text(strip=True).replace("|", "") if product_name_tag else "N/A"
        product_price = price_tag.get_text(strip=True) if price_tag else 0
        previous_price = previous_price.get_text(strip=True) if previous_price else 0

        # Parse the price and previous price to float
        price = float(re.sub(r"[^0-9]", "", product_price)) if product_price != 0 else product_price
        previous_price = float(re.sub(r"[^0-9]", "", previous_price)) if previous_price != 0 else previous_price

        # Calculate the discount percentage if both prices are available
        discount = 0.0
        if price != "N/A" and previous_price != "N/A" and previous_price > 0:
            discount = previous_price - price
        product_url = product_url_tag["href"] if product_url_tag else "N/A"
        full_url = f"https://megapc.tn{product_url}" if product_url != "N/A" else "N/A"
        stock_status = "En Stock" #products are always in stock

        # Print the extracted details
        print(f"Name: {product_name}")
        print(f"Price: {price}")
        print(f"Discount: {discount}")
        print(f"URL: {full_url}")
        print("-" * 50)

    # Close the browser
    browser.close()













