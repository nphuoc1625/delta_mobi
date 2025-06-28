# Category Management Documentation

## Category Fields

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| _id        | string   | Unique identifier (MongoDB ObjectId)        |
| name       | string   | Name of the category (unique, required)     |

---

## Group Category Fields

| Field      | Type       | Description                                 |
|------------|------------|---------------------------------------------|
| _id        | string     | Unique identifier (MongoDB ObjectId)        |
| name       | string     | Name of the group category (unique, required) |
| categories | string[]   | Array of Category ObjectIds                 |

---

## API Endpoints

- **GET /api/categories**: Fetch all categories
- **POST /api/categories**: Create a new category
- **PATCH /api/categories**: Update a category by ID
- **DELETE /api/categories**: Delete a category by ID

- **GET /api/group-categories**: Fetch all group categories
- **POST /api/group-categories**: Create a new group category
- **PATCH /api/group-categories**: Update a group category by ID
- **DELETE /api/group-categories**: Delete a group category by ID

---

## Create Category Rules
- `name` is required and must be unique.
- Category names should be descriptive and relevant to the products.

## Update Category Rules
- Only existing categories can be updated (must provide a valid `_id`).
- `name` must remain unique.

## Delete Category Rules
- Only existing categories can be deleted (must provide a valid `_id`).
- Deleting a category is irreversible.

---

## Create Group Category Rules
- `name` is required and must be unique.
- `categories` can be an empty array or contain valid category ObjectIds.

## Update Group Category Rules
- Only existing group categories can be updated (must provide a valid `_id`).
- `name` must remain unique.
- `categories` can be updated to add or remove categories.

## Delete Group Category Rules
- Only existing group categories can be deleted (must provide a valid `_id`).
- Deleting a group category is irreversible.

---

## Example Category Object
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d456",
  "name": "Headphones"
}
```

## Example Group Category Object
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d789",
  "name": "Audio Devices",
  "categories": ["60f7c2b5e1d2c8a1b8e4d456", "60f7c2b5e1d2c8a1b8e4d457"]
}
```

---

## Notes
- All API endpoints return JSON responses.
- Validation errors will return a 400 status with an error message.
- For more advanced features (pagination, search, etc.), extend the API as needed. 