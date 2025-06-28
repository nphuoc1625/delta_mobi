# Product Feature Documentation

## Product Fields

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| _id        | string   | Unique identifier (MongoDB ObjectId)        |
| id         | number   | Optional numeric ID (for legacy/static data)|
| name       | string   | Name of the product                         |
| category   | string   | Product category (e.g., Headphones)         |
| price      | number   | Price of the product (in USD)               |
| image      | string   | Image URL or path                           |

---

## API Endpoints

- **GET /api/products**: Fetch all products
- **POST /api/products**: Create a new product
- **PUT /api/products/:id**: Update a product by ID
- **DELETE /api/products/:id**: Delete a product by ID

---

## Create Product Rules
- `name`, `category`, `price`, and `image` are required fields.
- `name` must be unique among products.
- `price` must be a positive number.
- `category` should be one of the allowed categories (e.g., Headphones, Speakers, Microphones).

## Update Product Rules
- Only existing products can be updated (must provide a valid `_id`).
- All fields can be updated, but `name` must remain unique.
- `price` must remain a positive number.

## Delete Product Rules
- Only existing products can be deleted (must provide a valid `_id`).
- Deleting a product is irreversible.

---

## Example Product Object
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d123",
  "name": "Delta Sound Pro X1",
  "category": "Headphones",
  "price": 199,
  "image": "/window.svg"
}
```

---

## Notes
- All API endpoints return JSON responses.
- Validation errors will return a 400 status with an error message.
- For more advanced features (pagination, search, etc.), extend the API as needed. 