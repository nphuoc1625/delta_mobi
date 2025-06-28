# Schema Structure - Standards

## Overview
Standards for writing database schema documents in DeltaMobi project.

## Document Structure
Every schema document should follow this structure:

```
doc/feature-name/schema.md
├── [Collection] Collection          # Each collection
│   ├── Fields                      # Field definitions table
│   ├── Validation Rules            # Field validation rules
│   └── Indexes                     # Database indexes
├── Data Examples                   # Example documents
├── Relationships                   # Collection relationships
└── Data Integrity                  # Integrity rules
```

## Section Guidelines

### **1. Collection Definition**
For each collection, include:

#### **Fields Table**
```markdown
### Fields
| Field      | Type     | Required | Description                                 |
|------------|----------|----------|---------------------------------------------|
| _id        | ObjectId | Yes      | Unique identifier (MongoDB ObjectId)        |
| name       | string   | Yes      | Name field with constraints                 |
| createdAt  | Date     | Yes      | Creation timestamp                          |
| updatedAt  | Date     | Yes      | Last update timestamp                       |
```

#### **Validation Rules**
```markdown
### Validation Rules
- `name`: Required, 2-50 characters, unique across all [entities]
- `name`: Trimmed whitespace, lowercase for uniqueness checks
- `name`: Alphanumeric characters, spaces, hyphens, underscores only
```

#### **Indexes**
```markdown
### Indexes
```javascript
// Unique index on name (case-insensitive)
db.[collection].createIndex({ "name": 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

// Index on createdAt for sorting
db.[collection].createIndex({ "createdAt": -1 })
```
```

### **2. Data Examples**
Example documents for each collection:

```markdown
## Data Examples

### [Entity] Document
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d456"),
  "name": "Example Name",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```
```

### **3. Relationships**
Define how collections relate:

```markdown
## Relationships

### [Entity] Independence
- [Entities] are independent entities
- No required relationship with [other entities]
- [Entities] can exist without [relationship]

### Optional Many-to-Many Relationship
- [Entity A] can belong to multiple [Entity B]
- [Entity B] can contain multiple [Entity A]
- Relationship is maintained through ObjectId references
```

### **4. Data Integrity**
Integrity rules and constraints:

```markdown
## Data Integrity

### Cascade Deletion
When a [entity] is deleted:
1. Remove [entity] ID from all [related entities]
2. Update [related entity] documents
3. Delete the [entity] document

### Validation Constraints
- [Entity] names must be unique across all [entities]
- [Entity] IDs must reference existing [entities]
- ObjectId format validation for all ID fields
```

## Writing Standards

### **Field Types**
- Use MongoDB types: `ObjectId`, `string`, `number`, `Date`, `boolean`, `ObjectId[]`
- Be specific about array types: `ObjectId[]`, `string[]`
- Include required/optional status

### **Validation Rules**
- Include character limits
- Specify uniqueness requirements
- Define allowed characters
- Include trimming rules

### **Indexes**
- Always include unique indexes for name fields
- Include sorting indexes (createdAt, updatedAt)
- Include lookup indexes for relationships

### **Examples**
- Use realistic data
- Include ObjectId examples
- Show different scenarios (empty arrays, etc.)

## Template

```markdown
# Database Schema - [Feature Name]

## [Entity] Collection

### Fields
| Field      | Type     | Required | Description                                 |
|------------|----------|----------|---------------------------------------------|
| _id        | ObjectId | Yes      | Unique identifier (MongoDB ObjectId)        |
| name       | string   | Yes      | [Description with constraints]              |
| createdAt  | Date     | Yes      | Creation timestamp                          |
| updatedAt  | Date     | Yes      | Last update timestamp                       |

### Validation Rules
- `name`: Required, [min-max] characters, unique across all [entities]
- `name`: Trimmed whitespace, lowercase for uniqueness checks
- `name`: Alphanumeric characters, spaces, hyphens, underscores only

### Indexes
```javascript
// Unique index on name (case-insensitive)
db.[collection].createIndex({ "name": 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

// Index on createdAt for sorting
db.[collection].createIndex({ "createdAt": -1 })
```

## Data Examples

### [Entity] Document
```json
{
  "_id": ObjectId("60f7c2b5e1d2c8a1b8e4d456"),
  "name": "Example Name",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

## Relationships

### [Entity] Independence
- [Entities] are independent entities
- No required relationship with [other entities]

## Data Integrity

### Validation Constraints
- [Entity] names must be unique across all [entities]
- ObjectId format validation for all ID fields
```

## Checklist
Before finishing schema document, check:
- [ ] All collections have fields table
- [ ] Validation rules are complete
- [ ] Indexes are defined
- [ ] Examples are provided
- [ ] Relationships are documented
- [ ] Data integrity rules are clear

This structure ensures consistent, clear database schemas across the project, Sir! 