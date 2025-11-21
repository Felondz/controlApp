# 📋 Documentation Migration Guide

This file describes how to organize the existing documentation into the bilingual structure.

## Current Structure → New Structure

The documentation has been reorganized into English and Spanish versions to support multilingual users.

### Old Location → New Locations

- `docs/01-core/` → `docs/en/01-core/` AND `docs/es/01-core/`
- `docs/02-development/` → `docs/en/02-development/` AND `docs/es/02-development/`
- `docs/03-ia-collaboration/` → `docs/en/03-ia-collaboration/` AND `docs/es/03-ia-collaboration/`
- `docs/04-testing/` → `docs/en/04-testing/` AND `docs/es/04-testing/`
- `docs/05-reference/` → `docs/en/05-reference/` AND `docs/es/05-reference/`

## Migration Checklist

### Phase 1: Create Index Files
- [x] Create `/docs/README.md` (Language Selector)
- [x] Create `/docs/en/README.md` (English Home)
- [x] Create `/docs/es/README.md` (Spanish Home)
- [x] Create `/docs/en/01-core/INDEX.md` (English Index)
- [x] Create `/docs/es/01-core/INDEX.md` (Spanish Index)

### Phase 2: Migrate Existing Documentation
- [ ] Move/Copy content from old `docs/01-core/` to both `en/01-core/` and `es/01-core/`
- [ ] Move/Copy content from old `docs/02-development/` to both `en/02-development/` and `es/02-development/`
- [ ] Move/Copy content from old `docs/03-ia-collaboration/` to both `en/03-ia-collaboration/` and `es/03-ia-collaboration/`
- [ ] Move/Copy content from old `docs/04-testing/` to both `en/04-testing/` and `es/04-testing/`
- [ ] Move/Copy content from old `docs/05-reference/` to both `en/05-reference/` and `es/05-reference/`

### Phase 3: Translate Documentation
- [ ] Translate English files to Spanish in `/docs/es/`
- [ ] Or provide Spanish translations of existing content
- [ ] Ensure consistency across both versions

### Phase 4: Clean Up
- [ ] Remove or archive old documentation directories
- [ ] Verify all links are working
- [ ] Update any references in code documentation

## Structure Overview

```
docs/
├── README.md                          # 🌐 Language Selector (NEW)
├── en/                                # 🇬🇧 English Documentation (NEW)
│   ├── README.md
│   ├── 01-core/
│   │   └── INDEX.md
│   ├── 02-development/
│   ├── 03-ia-collaboration/
│   ├── 04-testing/
│   └── 05-reference/
├── es/                                # 🇪🇸 Spanish Documentation (NEW)
│   ├── README.md
│   ├── 01-core/
│   │   └── INDEX.md
│   ├── 02-development/
│   ├── 03-ia-collaboration/
│   ├── 04-testing/
│   └── 05-reference/
├── sessions/                          # Session Records (EXISTING)
├── 01-core/                          # (OLD - to be archived)
├── 02-development/                   # (OLD - to be archived)
├── 03-ia-collaboration/              # (OLD - to be archived)
├── 04-testing/                       # (OLD - to be archived)
└── 05-reference/                     # (OLD - to be archived)
```

## Next Steps

1. **Review Structure**: Verify the new structure meets your needs
2. **Copy Content**: Move existing documentation to appropriate language folders
3. **Translate**: Create Spanish versions of English documentation
4. **Test Links**: Ensure all internal links are working
5. **Update References**: Update any external references to documentation

## Notes

- Keep `/docs/sessions/` as is (shared bilingual content)
- Archive old directories after migration is complete
- Maintain version consistency across languages
- Consider using translation tools for faster localization

---

**Created**: November 20, 2025
