# Database Schema - Products

## Product Collection

### Fields
| Field      | Type     | Required | Description                                 |
|------------|----------|----------|---------------------------------------------|
| _id        | ObjectId | Yes      | Unique identifier (MongoDB ObjectId)        |
| name       | string   | Yes      | Name of the product (unique, 1-200 chars)   |
| category   | string   | Yes      | Product category (valid category name)      |
| price      | number   | Yes      | Price of the product (positive number)      |
| image      | string   | Yes      | Image URL or file path                      |
| createdAt  | Date     | Yes      | Creation timestamp                          |
| updatedAt  | Date     | Yes      | Last update timestamp                       |

### Validation Rules
- `name`: Required, 1-200 characters, unique across all products
- `name`: Trimmed whitespace, lowercase for uniqueness checks
- `name`: Alphanumeric characters, spaces, hyphens, underscores only
- `category`: Required, non-empty string, valid category name
- `price`: Required, positive number (≥ 0.01), maximum 999,999.99
- `price`: Support 2 decimal places
- `image`: Required, non-empty string, valid URL or file path
- `image`: Support common formats (jpg, png, svg, webp)

### Indexes
```javascript
// Unique index on name (case-insensitive)
db.products.createIndex({ "name": 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

// Index on category for filtering
db.products.createIndex({ "category": 1 })

// Index on price for sorting and filtering
db.products.createIndex({ "price": 1 })

// Index on createdAt for sorting
db.products.createIndex({ "createdAt": -1 })

// Compound index for search (name and category)
db.products.createIndex({ "name": "text", "category": "text" })
```

---

## Data Examples

### Product Document
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d123"),
  "name": "Delta Sound Pro X1",
  "category": "Headphones",
  "price": 199.99,
  "image": "/images/headphones.jpg",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

### Product with Different Category
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d124"),
  "name": "Studio Monitor Speakers",
  "category": "Speakers",
  "price": 299.99,
  "image": "/images/speakers.jpg",
  "createdAt": ISODate("2024-01-15T11:00:00Z"),
  "updatedAt": ISODate("2024-01-15T11:00:00Z")
}
```

### Product with High Price
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d125"),
  "name": "Professional Microphone",
  "category": "Microphones",
  "price": 599.99,
  "image": "/images/microphone.jpg",
  "createdAt": ISODate("2024-01-15T11:30:00Z"),
  "updatedAt": ISODate("2024-01-15T11:30:00Z")
}
```

---

## Relationships

### Product Independence
- Products are independent entities
- No required relationship with other collections
- Products can exist without dependencies

### Product-Category Relationship
- Products must have a category
- Category field references valid category names
- No foreign key constraint (string reference)
- Category validation happens at application level

### No Product Dependencies
- No other collections depend on products
- Products can be deleted without affecting other entities
- No cascade effects on deletion

---

## Data Integrity

### Uniqueness Constraints
- Product names must be unique across all products
- Case-insensitive uniqueness checking
- Trimmed whitespace for uniqueness validation

### Validation Constraints
- Product names must be 1-200 characters
- Prices must be positive numbers (≥ 0.01)
- Maximum price limit of 999,999.99
- Category must be valid category name
- Image must be valid URL or file path

### Referential Integrity
- Product categories should reference valid categories
- Validation happens at application level
- No database-level foreign key constraints

### Data Types
- All string fields use UTF-8 encoding
- Price field uses 64-bit floating point
- Date fields use ISO 8601 format
- ObjectId fields use MongoDB ObjectId format

---

## Performance Considerations

### Query Optimization
- Text index on name and category for search performance
- Index on category for filtering performance
- Index on price for sorting and range queries
- Index on createdAt for chronological sorting

### Storage Optimization
- Product names are indexed for fast lookups
- Price values are stored as numbers for efficient sorting
- Image paths are stored as strings (not binary data)
- Timestamps are stored as Date objects

### Memory Usage
- Product documents are relatively small
- Indexes consume additional memory
- Text indexes require more memory than regular indexes

---

## Migration Considerations

### Schema Evolution
- Adding new fields is backward compatible
- Removing fields requires data migration
- Changing field types requires validation
- Index changes require rebuild

### Data Migration
- Product name uniqueness may need revalidation
- Category references may need validation
- Price format may need standardization
- Image paths may need URL validation

This schema ensures efficient, scalable product data storage across the project, Sir! 