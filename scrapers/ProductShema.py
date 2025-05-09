from pydantic import BaseModel

class Product(BaseModel):
    competitor: str 
    product_name: str
    product_url: str
    product_price: float
    discount: float
    category: str
    sub_category: str
    stock_status: str
def sum(a: int, b: int) -> int:
    return a + b