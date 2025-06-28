# Feature Update Guide - AI-Assisted Development

## Overview
This guide outlines the general steps for updating features using AI assistance in the DeltaMobi project.

## Prerequisites
- Feature documentation exists in `doc/feature-name/`
- Business rules are defined in `doc/feature-name/br.md`
- API documentation is available in `doc/feature-name/api.md`
- Database schema is documented in `doc/feature-name/schema.md`

## Step-by-Step Update Process

### 1. 📋 **Review Current Documentation**
```
doc/feature-name/
├── br.md              # Business Rules - Review first
├── api.md             # API Documentation - Check endpoints
├── schema.md          # Database Schema - Verify data structure
└── ui.md              # UI Requirements (if exists)
```

**AI Instructions:**
- "Review the business rules in `doc/feature-name/br.md`"
- "Check API documentation in `doc/feature-name/api.md`"
- "Verify database schema in `doc/feature-name/schema.md`"

### 2. 🎯 **Define Update Requirements**
- What specific changes are needed?
- Which business rules are affected?
- What API endpoints need modification?
- Database schema changes required?

**AI Instructions:**
- "Based on the business rules, what changes are needed for [specific requirement]?"
- "How should the API endpoints be updated for [new functionality]?"
- "What database schema changes are required for [new feature]?"

### 3. 📚 **Reference Project Rules**
```
rules/
├── api-pattern.md     # API development patterns
├── repository.md      # Repository pattern guidelines
└── ui-repository.md   # UI repository usage
```

**AI Instructions:**
- "Follow the API patterns defined in `rules/api-pattern.md`"
- "Use repository pattern as defined in `rules/repository.md`"
- "Implement UI repository pattern from `rules/ui-repository.md`"

### 4. 🔧 **Update Implementation**

#### A. Database Layer
- Update models in `src/data/feature-name/models/`
- Modify repositories in `src/data/feature-name/repository/`
- Update database schema if needed

**AI Instructions:**
- "Update the [Feature] model to include [new fields]"
- "Modify the [Feature] repository to handle [new operations]"
- "Add validation for [new business rules]"

#### B. API Layer
- Update API routes in `src/app/api/feature-name/`
- Modify error handling in `src/app/api/feature-name/errors.ts`
- Update request/response validation

**AI Instructions:**
- "Update the [Feature] API route to handle [new functionality]"
- "Add new error codes for [specific scenarios]"
- "Implement validation for [new requirements]"

#### C. UI Layer
- Update components in `src/components/` or `src/app/feature-name/`
- Modify custom hooks in `src/core/hooks/`
- Update state management

**AI Instructions:**
- "Update the [Feature] component to handle [new functionality]"
- "Create a custom hook for [new feature]"
- "Implement error handling UI for [new scenarios]"

### 5. 🧪 **Testing & Validation**

#### A. Business Rule Compliance
- Verify all business rules are implemented
- Check error handling matches BR error codes
- Validate data integrity rules

**AI Instructions:**
- "Verify that the implementation follows business rule [BR-XXX]"
- "Check that error code [ERROR_CODE] is properly handled"
- "Validate that [specific validation] is implemented"

#### B. API Testing
- Test all endpoints with new functionality
- Verify error responses match documentation
- Check pagination and filtering

**AI Instructions:**
- "Test the [Feature] API endpoint with [specific scenario]"
- "Verify error response format matches API documentation"
- "Check pagination works with [new filters]"

#### C. UI Testing
- Test user interactions
- Verify error states and loading states
- Check responsive behavior

**AI Instructions:**
- "Test the [Feature] UI component with [user scenario]"
- "Verify error handling UI displays correctly"
- "Check loading states during [specific operations]"

### 6. 📝 **Update Documentation**

#### A. Business Rules
- Update `doc/feature-name/br.md` if rules changed
- Add new error codes if needed
- Update validation rules

**AI Instructions:**
- "Update business rules to reflect [new functionality]"
- "Add new error codes for [new scenarios]"
- "Update validation rules for [new requirements]"

#### B. API Documentation
- Update `doc/feature-name/api.md` with new endpoints
- Add new request/response examples
- Update error codes list

**AI Instructions:**
- "Update API documentation for [new endpoint]"
- "Add request/response examples for [new functionality]"
- "Update error codes list with [new codes]"

#### C. Database Schema
- Update `doc/feature-name/schema.md` if schema changed
- Add new indexes if needed
- Update validation rules

**AI Instructions:**
- "Update database schema for [new fields]"
- "Add new indexes for [performance optimization]"
- "Update validation rules in schema documentation"

### 7. 🔍 **Code Review Checklist**

#### A. Architecture Compliance
- [ ] Follows repository pattern
- [ ] Uses centralized error handling
- [ ] Implements proper validation
- [ ] Follows API patterns

#### B. Business Rule Compliance
- [ ] All BR rules implemented
- [ ] Error codes match documentation
- [ ] Validation rules enforced
- [ ] Data integrity maintained

#### C. Code Quality
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Responsive design maintained

## AI Prompt Templates

### For Business Rule Updates
```
"Update the business rules in doc/feature-name/br.md to include [new requirement]. 
Follow the existing format and add appropriate error codes."
```

### For API Updates
```
"Update the API documentation in doc/feature-name/api.md for [new functionality]. 
Add new endpoints, request/response examples, and error codes following the existing format."
```

### For Implementation
```
"Implement [new functionality] for the [Feature] following:
- Business rules from doc/feature-name/br.md
- API patterns from rules/api-pattern.md
- Repository pattern from rules/repository.md
- UI repository pattern from rules/ui-repository.md"
```

### For Testing
```
"Test the [Feature] implementation against:
- Business rules in doc/feature-name/br.md
- API documentation in doc/feature-name/api.md
- Database schema in doc/feature-name/schema.md"
```

## Common Update Scenarios

### Adding New Fields
1. Update database schema
2. Modify models and repositories
3. Update API endpoints
4. Modify UI components
5. Update documentation

### Adding New Validation
1. Update business rules
2. Modify API validation
3. Update UI validation
4. Add error handling
5. Update documentation

### Adding New Endpoints
1. Define in API documentation
2. Implement API route
3. Add error handling
4. Update UI components
5. Test thoroughly

## Error Handling Guidelines

### Error Codes
- Use error codes defined in business rules
- Follow centralized error handling pattern
- Provide meaningful error messages

### UI Error States
- Display user-friendly error messages
- Implement proper loading states
- Handle network errors gracefully

### API Error Responses
- Follow standardized error format
- Include appropriate HTTP status codes
- Provide error context when helpful

## Performance Considerations

### Database
- Add appropriate indexes
- Optimize queries
- Implement pagination

### API
- Implement caching where appropriate
- Use efficient data structures
- Optimize response payloads

### UI
- Implement proper loading states
- Use React.memo for expensive components
- Optimize re-renders

## Security Considerations

### Input Validation
- Validate all user inputs
- Sanitize data before storage
- Implement proper authentication

### API Security
- Validate request parameters
- Implement rate limiting
- Use proper authorization

### Data Protection
- Encrypt sensitive data
- Implement proper access controls
- Log security events

This guide ensures consistent, high-quality feature updates while maintaining project standards and documentation, Sir!
