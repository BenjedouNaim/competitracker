import json
import os
import sys
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
from bs4 import BeautifulSoup

# Add parent directory to path to import ProductShema
sys.path.append(str(Path(__file__).parent.parent))
from ProductShema import Product

# Function to scrape products from a single URL
def scrape_megapc_url(url, category_name, subcategory_name, page):
    scraped_products = []
    page_count = 1
    product_count = 0
    
    print(f"Scraping category: {category_name} - subcategory: {subcategory_name}")
    print("-" * 50)
    
    # Navigate to the initial URL
    print(f"Navigating to initial URL: {url}")
    try:
        # Navigate to the URL
        page.goto(url)
        
        # Wait for the page to load completely
        page.wait_for_load_state("networkidle")
        
        # Continue with the while loop to handle pagination
        while True:
            print(f"Processing page {page_count}")
            
            # Get the fully rendered HTML
            html = page.content()
            
            # Use BeautifulSoup to parse the HTML
            soup = BeautifulSoup(html, "html.parser")
            
            # Extract product blocks
            products = soup.select("article.flex.flex-col.product-card")
            
            if not products:
                print(f"No products found on page {page_count}")
                break
            
            # Loop through each product and extract info
            for product in products:
                product_count += 1
                
                # Extract elements using the more reliable selectors
                product_name_tag = product.select_one("p.text-skin-base.text-sm.leading-5.line-clamp-2.mb-2")
                price_tag = product.select_one("span.inline-block.font-semibold.text-15px.lg\\:text-base.text-skin-primary")
                previous_price_tag = product.select_one("del.text-sm.text-gray-400.text-opacity-70")
                product_url_tag = product.select_one("a[href^='/shop/product']")
                
                # Extract and clean data
                competitor = "Megapc"
                product_name = product_name_tag.get_text(strip=True).replace("|", "") if product_name_tag else "N/A"
                product_url = product_url_tag["href"] if product_url_tag else "N/A"
                full_url = f"https://megapc.tn{product_url}" if product_url != "N/A" else "N/A"
                
                # Parse price
                raw_price = price_tag.get_text(strip=True) if price_tag else "0"
                try:
                    product_price = float(re.sub(r"[^0-9.]", "", raw_price.replace(",", ".")))
                except ValueError:
                    product_price = 500.0  # fallback in case parsing fails
                
                # Calculate discount from previous and current prices
                discount = 0.0
                if previous_price_tag:
                    raw_previous_price = previous_price_tag.get_text(strip=True)
                    try:
                        previous_price = float(re.sub(r"[^0-9.]", "", raw_previous_price.replace(",", ".")))
                        discount = previous_price - product_price if previous_price > product_price else 0.0
                    except ValueError:
                        discount = 0.0
                
                # Use actual category and subcategory names
                category = category_name
                sub_category = subcategory_name
                stock_status = "En Stock"  # products are always in stock
                
                # Create Product object and append to list
                product_data = Product(
                    competitor=competitor,
                    product_name=product_name,
                    product_url=full_url,
                    product_price=product_price,
                    discount=discount,
                    category=category,
                    sub_category=sub_category,
                    stock_status=stock_status
                )
                scraped_products.append(product_data)
                
                # Print product details in a readable format
                print(f"Product #{product_count}:")
                print(f"Name: {product_name}")
                print(f"Price: {product_price}")
                print(f"Discount: {discount}")
                print(f"Category: {category} - {sub_category}")
                print(f"Stock Status: {stock_status}")
                print(f"URL: {full_url}")
                print("-" * 50)
            
            # Now use Playwright to check for next page button
            has_next_page = False
            try:
                # Check if there is a next page button at all
                next_button_exists = page.query_selector(
                    'button.md\\:px-4.px-2.py-2.mx-2.rounded-md.bg-gray-200 svg[viewBox="0 0 448 512"] path[d^="M190.5 66.9"]'
                )
                
                if next_button_exists:
                    # Check if the button is disabled
                    disabled_next_button = page.query_selector(
                        'button.md\\:px-4.px-2.py-2.mx-2.rounded-md.bg-gray-200[disabled] svg[viewBox="0 0 448 512"] path[d^="M190.5 66.9"]'
                    )
                    
                    if not disabled_next_button:
                        has_next_page = True
                        print(f"Next page button found and enabled - proceeding to page {page_count + 1}")
                    else:
                        print("Next page button found but disabled - reached last page")
                else:
                    print("No next page button found - this is likely a single page of results")
            except Exception as e:
                print(f"Error checking for next page button: {str(e)}")
                has_next_page = False
            
            if has_next_page:
                # Try clicking the next page button directly with Playwright
                try:
                    # Find the non-disabled next button and click it
                    print("Clicking the next page button...")
                    page.click('button.md\\:px-4.px-2.py-2.mx-2.rounded-md.bg-gray-200:not([disabled]) svg[viewBox="0 0 448 512"]')
                    page.wait_for_load_state("networkidle")
                    page_count += 1
                    print("Successfully navigated to next page by clicking button")
                except Exception as click_err:
                    print(f"Failed to click next page button: {click_err}")
                    print("No more pages available or unable to click next button.")
                    break
            else:
                print("No more pages available.")
                break
                
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
    
    print(f"Scraping completed for {subcategory_name}. Found {product_count} products across {page_count} pages.")
    return scraped_products

# Main execution
def main():
    # Read the Megapc links JSON file
    links_file_path = Path(__file__).parent.parent / "categorieLinks" / "MegapcLinks.json"
    with open(links_file_path, 'r', encoding='utf-8') as f:
        megapc_links = json.load(f)
    
    all_products = []
    
    # Use Playwright to handle browser automation
    with sync_playwright() as p:
        # Launch the browser
        browser = p.chromium.launch(headless=True)  # Set headless=False to see the browser
        page = browser.new_page()
        
        # Set viewport size for better rendering
        page.set_viewport_size({"width": 1280, "height": 800})
        
        # Set a reasonable timeout
        page.set_default_timeout(30000)  # 30 seconds
        
        # Iterate through each category and subcategory
        for category_name, subcategories in megapc_links.items():
            for subcategory_name, url in subcategories.items():
                # Handle cases where URL is a list (some subcategories have multiple URLs)
                if isinstance(url, list):
                    for single_url in url:
                        products = scrape_megapc_url(single_url, category_name, subcategory_name, page)
                        all_products.extend(products)
                else:
                    products = scrape_megapc_url(url, category_name, subcategory_name, page)
                    all_products.extend(products)
        
        # Close the browser
        browser.close()
    
    # Create output directory if it doesn't exist
    output_dir = Path(__file__).parent.parent / "output"
    output_dir.mkdir(exist_ok=True)
    
    # Save all products to JSON file
    output_file = output_dir / "MegapcProducts.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        # Convert Product objects to dictionaries
        product_dicts = [product.dict() for product in all_products]
        json.dump(product_dicts, f, ensure_ascii=False, indent=2)
    
    print(f"\nAll products saved to {output_file}")
    print(f"Total products scraped: {len(all_products)}")

if __name__ == "__main__":
    main()