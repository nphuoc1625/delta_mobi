# Business Rules Structure - Standards

## Overview
Standards for writing business rules (BR) documents in DeltaMobi project.

## Document Structure
Every BR document should follow this structure:

```
doc/feature-name/br.md
├── Overview                    # Brief description
├── [Entity] Rules             # Rules for each entity
│   ├── Creation               # Creation rules and validation
│   ├── Independence           # Entity independence rules
│   ├── Updates                # Update rules and constraints
│   └── Deletion               # Deletion rules and warnings
├── Relationship Rules          # Rules between entities
├── Data Validation            # Input validation rules
├── Security                   # Access control rules
├── Error Handling             # Error response standards
├── Warning System             # User warning rules
├── Warning Flow               # Step-by-step warning process
├── Warning Message Example    # Example warning messages
└── [Process] Process          # Step-by-step processes
```

## Section Guidelines

### **1. Overview**
Keep it simple - 1-2 sentences about the business rules.

**Example**:
```markdown
## Overview
Simplified business rules for managing categories and group categories.
```

### **2. Entity Rules**
For each entity, include these subsections:

#### **Creation**
- Required fields and validation
- Character limits and uniqueness
- Error codes for each validation

**Example**:
```markdown
### Creation
- Categories are independent entities with a name
- Name required, 2-50 characters, unique across all categories
- Error: `CATEGORY_NAME_REQUIRED`, `CATEGORY_NAME_TOO_SHORT`, `CATEGORY_NAME_TOO_LONG`, `CATEGORY_NAME_DUPLICATE`
```

#### **Independence**
- Entity independence rules
- Optional relationships
- No minimum requirements

#### **Updates**
- Update constraints
- Uniqueness maintenance
- Error codes

#### **Deletion**
- Deletion restrictions
- Warning requirements
- Cascade effects

### **3. Relationship Rules**
Define how entities relate to each other:

**Example**:
```markdown
### Optional Category-Group Relationship
- Categories can optionally belong to group categories
- Categories can belong to multiple group categories
- Relationship is optional, not required
- Error: `RELATIONSHIP_VIOLATION`
```

### **4. Data Validation**
Input validation rules:

**Example**:
```markdown
### Name Validation
- Trim whitespace from names
- Convert to lowercase for uniqueness checks
- Allow alphanumeric characters, spaces, hyphens, underscores
- Error: `INVALID_NAME_FORMAT`, `NAME_CONTAINS_INVALID_CHARS`
```

### **5. Security**
Access control rules:

**Example**:
```markdown
### Access Control
- Admin users can manage all categories and group categories
- Regular users can only view categories
- API endpoints require authentication
- Error: `INSUFFICIENT_PERMISSIONS`, `UNAUTHORIZED_ACCESS`
```

### **6. Error Handling**
Standardized error response format:

**Example**:
```markdown
### Error Response Format
- Return standardized error codes
- Provide meaningful error messages
- Error: `ERROR_FORMAT_INVALID`
```

### **7. Warning System**
User warning rules:

**Example**:
```markdown
### Category Deletion Warnings
- Display warning message with affected products count
- Display warning message with affected group categories count
- Show specific names if count is small
- Require user confirmation to proceed
- Error: `WARNING_DISPLAY_FAILED`, `USER_CANCELLED_DELETION`
```

### **8. Warning Flow**
Step-by-step warning process:

**Example**:
```markdown
## Warning Flow

1. User requests category deletion
2. System checks affected entities (products, group categories)
3. Display warning message with counts and names
4. User confirms or cancels
5. If confirmed: Execute deletion with cascade removal
   If cancelled: Abort deletion
```

### **9. Warning Message Example**
Example warning messages:

**Example**:
```markdown
## Warning Message Example

```
⚠️ Category Deletion Warning

You are about to delete "Electronics"

This will affect:
• 3 products: iPhone 13, Samsung Galaxy, MacBook Pro
• 1 group category: Mobile Devices

Are you sure you want to proceed?

[Cancel] [Delete Category]
```
```

### **10. Process Steps**
Step-by-step processes:

**Example**:
```markdown
## Deletion Process

1. Check Dependencies: Find all products and group categories using the category
2. Display Warnings: Show affected entities with counts and names
3. User Confirmation: Require explicit confirmation
4. Cascade Removal: Remove category from all products and group categories
5. Delete Category: Finally delete the category itself
```

## Writing Standards

### **Error Code Format**
- Use UPPERCASE with underscores
- Be descriptive and specific
- Include entity name in code
- Example: `CATEGORY_NAME_REQUIRED`, `PRODUCT_UPDATE_FAILED`

### **Rule Format**
- Start with entity or action
- Use clear, simple language
- Include error codes for each rule
- Be specific about constraints

### **Process Format**
- Numbered steps
- Clear action descriptions
- Include decision points
- Show both success and failure paths

## Template

```markdown
# Business Rules - [Feature Name]

## Overview
[Brief description of the business rules]

## [Entity] Rules

### Creation
- [Entity] are [description]
- [Field] required, [limits], [uniqueness]
- Error: `[ERROR_CODE_1]`, `[ERROR_CODE_2]`

### Independence
- [Entity] can [independence rule]
- [Optional relationships]
- Error: `[ERROR_CODE]`

### Updates
- [Update constraints]
- [Uniqueness rules]
- Error: `[ERROR_CODE_1]`, `[ERROR_CODE_2]`

### Deletion
- [Deletion rules]
- [Warning requirements]
- Error: `[ERROR_CODE_1]`, `[ERROR_CODE_2]`

## Relationship Rules

### [Relationship Type]
- [Relationship description]
- [Constraints]
- Error: `[ERROR_CODE]`

## Data Validation

### [Validation Type]
- [Validation rules]
- [Format requirements]
- Error: `[ERROR_CODE_1]`, `[ERROR_CODE_2]`

## Security

### Access Control
- [Access rules]
- [Permission requirements]
- Error: `[ERROR_CODE_1]`, `[ERROR_CODE_2]`

## Error Handling

### Error Response Format
- [Error format standards]
- Error: `[ERROR_CODE]`

## Warning System

### [Warning Type]
- [Warning requirements]
- [Display rules]
- Error: `[ERROR_CODE_1]`, `[ERROR_CODE_2]`

## Warning Flow

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]
5. If [condition]: [action]
   If [condition]: [action]

## Warning Message Example

```
[Warning message format]
```

## [Process] Process

1. [Step 1]: [Description]
2. [Step 2]: [Description]
3. [Step 3]: [Description]
4. [Step 4]: [Description]
5. [Step 5]: [Description]
```

## Checklist
Before finishing BR document, check:
- [ ] All entities have creation, independence, update, and deletion rules
- [ ] All relationships are defined
- [ ] Error codes are included for each rule
- [ ] Warning systems are documented
- [ ] Processes are step-by-step
- [ ] Examples are provided
- [ ] Security rules are included
- [ ] Validation rules are clear

This structure ensures consistent, comprehensive business rules across the project, Sir! 