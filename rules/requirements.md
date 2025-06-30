# Requirements Rules - Simple Standards

## Overview
Simple guidelines for writing business requirements in DeltaMobi project.

## Document Structure
Every requirements document should have these sections:

```
doc/feature-name/requirements.md
├── Overview              # What the feature does
├── Business Goals        # Why we need it
├── User Stories          # Who uses it and how
├── Requirements          # What it must do
├── Success Criteria      # How we know it works
└── Future Ideas          # What we might add later
```

## Section Guidelines

### **1. Overview**
Keep it simple - 2-3 sentences about what the feature does.

**Example**:
```markdown
## Overview
Categories help organize products so customers can find them easily. 
Admins can create categories and assign products to them.
```

### **2. Business Goals**
List 3-5 main benefits for the business.

**Example**:
```markdown
## Business Goals
- Help customers find products faster
- Organize products logically
- Make the store look professional
- Improve search results
```

### **3. User Stories**
Write simple user stories in this format:
"As a [user], I want to [action] so that [benefit]"

**Example**:
```markdown
## User Stories
- As an admin, I want to create categories so I can organize products
- As an admin, I want to edit category names so I can keep them current
- As a customer, I want to browse by category so I can find products easily
```

### **4. Requirements**
List what the feature must do. Use simple language.

**Example**:
```markdown
## Requirements
- Admins can create new categories
- Admins can edit category names
- Admins can delete categories (with warning)
- Categories have unique names
- Products can be assigned to categories
```

### **5. Success Criteria**
How do we know the feature works? Be specific.

**Example**:
```markdown
## Success Criteria
- Admins can create categories without errors
- Category names are unique
- Products show their categories
- Customers can filter by category
```

### **6. Future Ideas**
What might we add later? Keep it simple.

**Example**:
```markdown
## Future Ideas
- Category images
- Sub-categories
- Category analytics
- Bulk category assignment
```

## Writing Tips

### **Keep It Simple**
- Use short sentences
- Avoid technical jargon
- Focus on what, not how
- Write for business people

### **Be Specific**
- ❌ "The system should be fast"
- ✅ "Pages load in under 2 seconds"

### **Testable Requirements**
- ❌ "User-friendly interface"
- ✅ "Users can complete tasks in under 30 seconds"

## Template

```markdown
# Business Requirements - [Feature Name]

## Overview
[2-3 sentences about what the feature does]

## Business Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

## User Stories
- As a [user], I want to [action] so that [benefit]
- As a [user], I want to [action] so that [benefit]

## Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Success Criteria
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

## Future Ideas
- [Idea 1]
- [Idea 2]
- [Idea 3]
```

## Checklist
Before finishing requirements, check:
- [ ] All sections are filled
- [ ] Language is simple and clear
- [ ] Requirements are testable
- [ ] Business people can understand it
- [ ] Technical team can implement it

This simple approach ensures clear, actionable requirements, Sir! 