# Contributing Guide - ControlApp

Thank you for your interest in contributing to ControlApp! This guide will help you understand the contribution process.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Bug Reports](#bug-reports)
4. [Feature Suggestions](#feature-suggestions)
5. [Pull Requests](#pull-requests)
6. [Style Guide](#style-guide)
7. [Local Setup](#local-setup)
8. [Review Process](#review-process)

---

## 📜 Code of Conduct

### Our Commitment

In ControlApp, we commit to providing a welcoming environment for everyone, regardless of:
- Age, gender, gender identity
- Experience level
- Nationality, ethnicity
- Religion, sexual orientation
- Physical or mental disability

### Expected Behavior

- 🤝 Be respectful and inclusive
- 💬 Communicate clearly and constructively
- 🎯 Focus on the code, not the person
- 🚫 No harassment, discrimination, or bullying
- 📚 Help other community members

---

## 🤝 How to Contribute

### Contribution Levels

#### 1️⃣ Beginner (No code changes)
- 📝 Improve documentation
- 🐛 Report bugs
- 💡 Suggest features
- 💬 Answer questions in issues

#### 2️⃣ Intermediate (Small changes)
- 🐛 Fix reported bugs
- 📝 Update examples
- ♻️ Refactor code
- ✨ Improve tests

#### 3️⃣ Advanced (New features)
- ✨ Implement new features
- 🏗️ Architectural changes
- 📊 Performance optimizations
- 🔐 Security improvements

---

## 🐛 Bug Reports

### Before Reporting

1. 🔍 **Search existing bugs** - Probably already reported
2. 🧪 **Reproduce locally** - Make sure it's a real bug
3. 📋 **Gather information** - OS, PHP version, etc.

### Bug Report Format

```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Do this...
2. Then this...
3. Result: Error appears

## Expected Behavior
What should happen

## Actual Behavior
What happens instead

## Environment
- OS: Windows 10 / macOS / Linux
- PHP: 8.4.14
- Laravel: 12.38.1
```

---

## 💡 Feature Suggestions

### Before Suggesting

1. ✅ Read the documentation
2. ✅ Search for similar suggestions
3. ✅ Check the roadmap in README
4. ✅ Ensure it fits the project vision

### Feature Suggestion Format

```markdown
## Description
Clear summary of the feature

## Problem It Solves
What's the current problem?
Why is it important?

## Proposed Solution
How should it work?
Step-by-step flow

## Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Alternatives Considered
Other ways to solve this

## Additional Context
Screenshots, mockups, links
```

---

## 🔀 Pull Requests

### Before Making a PR

1. **Fork the repository**
2. **Clone your fork**
3. **Add upstream remote**
4. **Create a feature branch**

```bash
git clone https://github.com/your-username/controlApp.git
cd controlApp
git remote add upstream https://github.com/Felondz/controlApp.git
git checkout -b feat/your-feature-name
```

### Development Process

```bash
# Update with main branch
git fetch upstream
git rebase upstream/main

# Make changes...
# Write tests...
# Update documentation...

# Commit (follow Conventional Commits)
git add .
git commit -m "feat(module): clear description"

# Push to your fork
git push origin feat/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

<optional body>

<optional footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Format changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Tests
- `chore:` Configuration changes

**Examples:**
```bash
git commit -m "feat(api): add reports endpoint"
git commit -m "fix(email): validate special characters in hash"
git commit -m "docs(readme): add setup instructions"
git commit -m "feat(transactions): support recurring transactions

- Add TransactionRecurrence model
- Migration for new table
- Unit tests
- Documentation in API.md

Closes #123"
```

### PR Template

```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Fixes #123
Related to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Added tests for changes
- [ ] Tests pass locally
- [ ] Updated documentation
- [ ] No new warnings

## Testing
```bash
# Steps to test the changes
```
```

---

## 📐 Style Guide

### PHP

```php
// ✅ GOOD: PSR-12 standard
namespace App\Http\Controllers;

class ProjectController extends Controller
{
    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();
        
        $project = Project::create($validated);
        
        return response()->json($project, 201);
    }
}

// ❌ BAD: Inconsistent
```

### JavaScript

```javascript
// ✅ GOOD
const storeProject = async (projectData) => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  
  return response.json();
};

// ❌ BAD
```

### Key Rules

1. **PSR-12**: Follow Laravel standards
2. **Indentation**: 4 spaces
3. **Line length**: Maximum 120 characters
4. **Type hints**: Always use them
5. **Comments**: Meaningful and clear

---

## 🔧 Local Setup

### Prerequisites

```bash
php -v          # >= 8.4
composer -v     # >= 2.6
docker -v       # >= 24
```

### Complete Setup

```bash
# Clone repo
git clone https://github.com/your-username/controlApp.git
cd controlApp

# Install dependencies
docker compose run --rm laravel.test composer install

# Copy environment
cp .env.example .env

# Generate key
docker compose exec laravel.test php artisan key:generate

# Start containers
docker compose up -d

# Run migrations
docker compose exec laravel.test php artisan migrate

# Run tests
docker compose exec laravel.test php artisan test
```

---

## 🔍 Review Process

### What Reviewers Look For

✅ **Will Approve:**
- Code follows style guide
- Tests included and passing
- Documentation updated
- No regressions
- Clear commit messages
- Good PR description

❌ **Will Reject:**
- No tests
- Hard to understand
- Obvious bugs
- Violates style guide
- Missing documentation
- Doesn't follow conventions

### Responding to Comments

```markdown
# Accept suggestion
Tienes razón, actualicé la línea 42.

# Ask for clarification
¿Podrías explicar qué ventajas tiene?

# Explain decision
Elegí este patrón porque es más simple.
```

---

## 🎓 Learn More

### Documentation
- [README.md](../README.md) - Overview
- [API.md](./API.md) - API documentation
- [DATABASE.md](./DATABASE.md) - Database schema
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth system

### External Resources
- [Laravel Documentation](https://laravel.com/docs)
- [Git Workflow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [PSR-12 Standard](https://www.php-fig.org/psr/psr-12/)

---

## 💬 Questions?

- 📧 Email: contacto@example.com
- 💬 Issues: Open an issue with label `question`
- 📚 Discussions: Use GitHub Discussions

---

## 🙏 Thank You

Thank you for contributing to ControlApp! Your time and effort make this project better for everyone.

---

**Last Updated**: November 15, 2025
**Maintainer**: Felondz (@Felondz)
