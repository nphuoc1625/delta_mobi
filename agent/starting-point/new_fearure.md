# New Feature Creation Guide - AI Flow

## Quick Flow
1. **Requirements** → 2. **Business Rules** → 3. **API** → 4. **Schema** → 5. **UI/UX** → 6. **Implementation**

## File References

### **1. Write Requirements**
- **File**: `doc/features/feature-name/requirements.md`
- **Follow**: `rules/requirements.md`
- **Template**: Use the simple 6-section template

### **2. Write Business Rules**
- **File**: `doc/features/feature-name/br.md`
- **Follow**: `rules/requirements.md` (business rules section)
- **Focus**: Independent entities, relationships, constraints

### **3. Create API**
- **File**: `doc/features/feature-name/api.md`
- **Follow**: `rules/api-pattern.md`
- **Implement**: `src/app/api/feature-name/route.ts`

### **4. Design Schema**
- **File**: `doc/features/feature-name/schema.md`
- **Follow**: `rules/requirements.md` (data structure)
- **Implement**: `src/data/feature-name/models/`

### **5. Plan UI/UX**
- **File**: `doc/features/feature-name/ui.md`
- **Follow**: `rules/ui-repository.md`
- **Implement**: `src/components/` and `src/app/feature-name/`

### **6. Build Repository**
- **File**: `src/data/feature-name/repository/`
- **Follow**: `rules/repository.md`
- **Use**: `src/core/hooks/useRepositoryOperation.ts`

## Implementation Order
1. **Data Layer**: Models → Repository → API routes
2. **UI Layer**: Components → Pages → Integration
3. **Testing**: Each layer as you build

## Key Rules to Remember
- **Repository Pattern**: All data operations through repositories
- **Error Handling**: Use centralized error codes
- **TypeScript**: Strong typing everywhere
- **Documentation**: Update docs as you build

## Quick Checklist
- [ ] Requirements written (simple format)
- [ ] Business rules defined
- [ ] API endpoints planned
- [ ] Database schema designed
- [ ] UI components planned
- [ ] Repository functions created
- [ ] Error handling implemented
- [ ] Documentation updated

**Start with requirements, then follow the flow!**
