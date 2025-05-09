import requests
from bs4 import BeautifulSoup
import json
import os
import sys
from pathlib import Path

# Add parent directory to path to import ProductShema
sys.path.append(str(Path(__file__).parent.parent))
from ProductShema import Product

# Function to scrape products from a single URL
def scrape_skymilinformatique_url(url, category_name, subcategory_name, headers):
    scraped_products = []
    page_num = 1
    product_count = 0
    
    print(f"Scraping category: {category_name} - subcategory: {subcategory_name}")
    print("-" * 50)
    
    while True:
        # Send GET request
        current_url = url
        if "?" in url:
            current_url = url.split("&page=")[0] + f"&page={page_num}"
        elif page_num > 1:
            current_url = url + f"?page={page_num}"
            
        print(f"Scraping page {page_num} - {current_url}...")
        try:
            response = requests.get(current_url, headers=headers)
            soup = BeautifulSoup(response.text, "html.parser")

            # Try to extract product blocks
            products = soup.select("div.product article.product-miniature")
            
            if not products:
                print(f"No products found on page {page_num}")
                break

            # Loop through each product and extract info
            for product in products:
                product_count += 1
                # Extracting product Tags
                product_name_tag = product.select_one("h2.h3.product-title a")
                product_url_tag = product.select_one("h2.h3.product-title a")
                price_tag = product.select_one("span.price")
                regular_price_tag = product.select_one("span.regular-price")
                discount_amount_tag = product.select_one("span.discount-amount")
                stock_status_tag = product.select_one("button.sp-add-to-cart")
                
                # Extracting Product data
                competitor = "Skymilinformatique"
                product_name = product_name_tag.text.strip() if product_name_tag else "N/A"
                product_url = product_url_tag["href"] if product_url_tag else "N/A"
                
                # Extract current price
                raw_price = price_tag.text.strip() if price_tag else "0"
                clean_price = raw_price.replace('\u202f', '').replace('TND', '').replace(',', '.').strip()
                try:
                    product_price = float(clean_price)
                except ValueError:
                    product_price = 0.0  # fallback in case parsing fails
                
                # Extract and calculate discount
                discount = 0.0
                
                # Method 1: Try to get discount from direct discount tag
                if discount_amount_tag:
                    raw_discount = discount_amount_tag.text.strip()
                    clean_discount = raw_discount.replace('TND', '').replace('-', '').replace(',', '.').strip()
                    try:
                        discount = float(clean_discount)
                    except ValueError:
                        discount = 0.0
                
                # Method 2: Calculate from regular price if available
                elif regular_price_tag and regular_price_tag.get('style') != 'opacity: 0;':
                    raw_regular = regular_price_tag.text.strip()
                    clean_regular = raw_regular.replace('\u202f', '').replace('TND', '').replace(',', '.').strip()
                    try:
                        regular_price = float(clean_regular)
                        # Calculate discount as the difference between regular and current price
                        if regular_price > product_price:
                            discount = regular_price - product_price
                    except ValueError:
                        pass
                
                # Extract stock status
                stock_status = "En Stock" if stock_status_tag else "Rupture de stock"
                
                # Use actual category and subcategory names
                category = category_name  
                sub_category = subcategory_name
                
                # Create Product object and append to list
                product_data = Product(
                    competitor=competitor,
                    product_name=product_name,
                    product_url=product_url,
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
                print(f"URL: {product_url}")
                print("-" * 50)
            
            # Check for next page
            if (next_page_tag := soup.select_one("a.next.js-search-link")):
                page_num += 1
            else:
                print("No more pages available.")
                break
                
        except Exception as e:
            print(f"Error scraping {current_url}: {str(e)}")
            break
    
    print(f"Scraping completed for {subcategory_name}. Found {product_count} products across {page_num} pages.")
    return scraped_products

# Main execution
def main():
    # Set headers to mimic a real browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
    
    # Read the Skymilinformatique links JSON file
    links_file_path = Path(__file__).parent.parent / "categorieLinks" / "SkymilinformatiqueLinks.json"
    with open(links_file_path, 'r', encoding='utf-8') as f:
        skymilinformatique_links = json.load(f)
    
    all_products = []
    
    # Iterate through each category and subcategory
    for category_name, subcategories in skymilinformatique_links.items():
        for subcategory_name, url in subcategories.items():
            # Handle cases where URL is a list (some subcategories have multiple URLs)
            if isinstance(url, list):
                for single_url in url:
                    if not single_url.startswith("http"):
                        single_url = "https://" + single_url
                    products = scrape_skymilinformatique_url(single_url, category_name, subcategory_name, headers)
                    all_products.extend(products)
            else:
                products = scrape_skymilinformatique_url(url, category_name, subcategory_name, headers)
                all_products.extend(products)
    
    # Create output directory if it doesn't exist
    output_dir = Path(__file__).parent.parent / "output"
    output_dir.mkdir(exist_ok=True)
    
    # Save all products to JSON file
    output_file = output_dir / "SkymilinformatiqueProducts.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        # Convert Product objects to dictionaries
        product_dicts = [product.dict() for product in all_products]
        json.dump(product_dicts, f, ensure_ascii=False, indent=2)
    
    print(f"\nAll products saved to {output_file}")
    print(f"Total products scraped: {len(all_products)}")

if __name__ == "__main__":
    main()