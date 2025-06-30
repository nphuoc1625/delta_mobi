# Database Schema - Categories & Group Categories

## Category Collection

### Fields
| Field      | Type     | Required | Description                                 |
|------------|----------|----------|---------------------------------------------|
| _id        | ObjectId | Yes      | Unique identifier (MongoDB ObjectId)        |
| name       | string   | Yes      | Name of the category (unique, 2-50 chars)   |
| createdAt  | Date     | Yes      | Creation timestamp                          |
| updatedAt  | Date     | Yes      | Last update timestamp                       |

### Validation Rules
- `name`: Required, 2-50 characters, unique across all categories
- `name`: Trimmed whitespace, lowercase for uniqueness checks
- `name`: Alphanumeric characters, spaces, hyphens, underscores only

### Indexes
```javascript
// Unique index on name (case-insensitive)
db.categories.createIndex({ "name": 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

// Index on createdAt for sorting
db.categories.createIndex({ "createdAt": -1 })
```

---

## Group Category Collection

### Fields
| Field      | Type       | Required | Description                                 |
|------------|------------|----------|---------------------------------------------|
| _id        | ObjectId   | Yes      | Unique identifier (MongoDB ObjectId)        |
| name       | string     | Yes      | Name of the group category (unique, 3-100 chars) |
| categories | ObjectId[] | No       | Array of Category ObjectIds (optional)      |
| createdAt  | Date       | Yes      | Creation timestamp                          |
| updatedAt  | Date       | Yes      | Last update timestamp                       |

### Validation Rules
- `name`: Required, 3-100 characters, unique across all group categories
- `name`: Trimmed whitespace, lowercase for uniqueness checks
- `name`: Alphanumeric characters, spaces, hyphens, underscores only
- `categories`: Optional array of valid Category ObjectIds
- `categories`: Can be empty array or contain existing category IDs

### Indexes
```javascript
// Unique index on name (case-insensitive)
db.group_categories.createIndex({ "name": 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

// Index on categories for lookups
db.group_categories.createIndex({ "categories": 1 })

// Index on createdAt for sorting
db.group_categories.createIndex({ "createdAt": -1 })
```

---

## Data Examples

### Category Document
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d456"),
  "name": "Headphones",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

### Group Category Document
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d789"),
  "name": "Audio Devices",
  "categories": [
    ObjectId("60f7c2b5e1d2c8a1b8e4d456"),
    ObjectId("60f7c2b5e1d2c8a1b8e4d457")
  ],
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

### Empty Group Category Document
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d790"),
  "name": "Future Categories",
  "categories": [],
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## Relationships

### Category Independence
- Categories are independent entities
- No required relationship with group categories
- Categories can exist without belonging to any group category

### Group Category Independence
- Group categories can exist without categories
- Categories array is optional
- No minimum requirement for number of categories

### Optional Many-to-Many Relationship
- Categories can belong to multiple group categories
- Group categories can contain multiple categories
- Relationship is maintained through ObjectId references

---

## Data Integrity

### Cascade Deletion
When a category is deleted:
1. Remove category ID from all group categories' categories arrays
2. Update group category documents
3. Delete the category document

### Validation Constraints
- Category names must be unique across all categories
- Group category names must be unique across all group categories
- Category IDs in group categories must reference existing categories
- ObjectId format validation for all ID fields 