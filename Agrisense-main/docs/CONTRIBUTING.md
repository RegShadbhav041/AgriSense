# Contributing to AgriSense

Thank you for your interest in contributing to AgriSense! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the project
- Show empathy towards users (farmers)

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device information
   - Screenshots if applicable

### Suggesting Features

1. Check existing issues and feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Mockups or examples if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**:
   - Follow code style guidelines
   - Add comments for complex logic
   - Update documentation
   - Test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

## Development Setup

### Prerequisites

- Modern web browser
- Code editor (VS Code recommended)
- Git

### Setup Steps

1. Fork and clone the repository
2. Open `index.html` in browser
3. Use local server for HTTPS (required for geolocation):
   ```bash
   python -m http.server 8000
   # or
   npx http-server -p 8000
   ```

## Code Style Guidelines

### HTML

- Use semantic HTML5 elements
- Indent with 2 spaces
- Use lowercase for tags and attributes
- Quote all attribute values
- Close all tags

```html
<section class="card">
  <h2>Title</h2>
  <p>Content</p>
</section>
```

### CSS

- Use BEM-inspired naming
- Organize by component
- Use CSS variables for colors
- Indent with 2 spaces
- Add comments for complex rules

```css
/* Component */
.card {
  padding: 20px;
  border-radius: 12px;
}

/* Modifier */
.card--urgent {
  border-color: red;
}
```

### JavaScript

- Use ES6+ features
- Use meaningful variable names
- Add JSDoc comments for functions
- Indent with 2 spaces
- Use const/let, avoid var

```javascript
/**
 * Function description
 * @param {string} param - Parameter description
 * @returns {number} Return description
 */
function exampleFunction(param) {
  const result = param.length;
  return result;
}
```

## Testing Guidelines

### Manual Testing Checklist

- [ ] Test on Chrome (desktop and mobile)
- [ ] Test on Firefox
- [ ] Test on Safari (if available)
- [ ] Test on mobile devices
- [ ] Test offline functionality
- [ ] Test with slow network
- [ ] Test accessibility (keyboard navigation)
- [ ] Test language toggle

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Documentation

### Updating Documentation

- Update README.md for user-facing changes
- Update API.md for function changes
- Update ARCHITECTURE.md for structural changes
- Add inline comments for complex code

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add new crop recommendation feature
fix: Fix weather forecast display issue
docs: Update API documentation
style: Format code according to guidelines
refactor: Reorganize crop recommendation logic
test: Add tests for weather API
chore: Update dependencies
```

## Review Process

1. All PRs require review
2. Address review comments
3. Ensure tests pass
4. Update documentation
5. Squash commits if needed

## Questions?

- Open an issue for questions
- Check existing documentation
- Contact maintainers

Thank you for contributing! 🌾

