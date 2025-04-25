[Unreleased] - 2025-04-06

### Added

- Git worker now can works without service worker and also returns to web worker if service worker fails

- Automatic parent directory creation in `writeFileDot`
    
- Type validation for all path components during write operations
    
- Detailed error messages for type conflicts (file vs directory)
    

### Changed

- `writeFileDot` now fails explicitly when target path exists as directory
    
- `mkdirDot` now fails explicitly when target path exists as file
    
- UI now shows operation progress before displaying success/error
    

### Fixed

- Resolved "anticipated to be blob/tree" Git object type errors
    
- Prevented false success messages in UI when backend operations failed
    
- Stopped directories from being overwritten as files and vice versa
    

### Removed

- Ambiguous success messages that appeared before operation completion
    
- Silent failures that could lead to inconsistent repository state