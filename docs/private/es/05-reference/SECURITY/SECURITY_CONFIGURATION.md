# 🔒 Security Configuration Guide

## Overview

ControlApp has been configured with multiple layers of security scanning and vulnerability detection following Laravel and GitHub best practices.

---

## 🛡️ Automated Security Tools

### 1. CodeQL Analysis (Deshabilitado)
**Location**: `.github/workflows/codeql.yml`

**Status**: ⏸️ Deshabilitado

**Razón**: El proyecto es PHP puro sin JavaScript. CodeQL está optimizado para lenguajes como JavaScript/TypeScript. Para análisis de seguridad en PHP, utilizamos **PHPStan** y **Composer Audit**.

**Referencia**: El archivo de configuración se mantiene como referencia para futuras necesidades si el proyecto añade JavaScript.
**Location**: `.github/dependabot.yml`

**What it does:**
- Scans `composer.json` and `composer.lock` for vulnerable dependencies
- Checks GitHub Actions versions for updates
- Creates automatic pull requests for updates (weekly)
- Prioritizes security patches over minor/patch updates

**Configuration:**
- Runs every Monday at 3:00 AM UTC
- Groups development and production dependencies separately
- Assigns to: `Felondz`
- Labels: `dependencies`, `composer`, `github-actions`

**How to use:**
1. Dependabot will create PRs automatically
2. Review each PR for breaking changes
3. Merge PRs with "automerge" if automated tests pass
4. Monitor Dependabot alerts in Security tab

**Cost**: Free with GitHub

---

### 3. Secret Scanning
**Location**: GitHub Settings (needs manual enable)

**What it does:**
- Detects accidentally committed secrets (API keys, tokens, passwords, etc.)
- Prevents push of commits with secrets (if "Push protection" enabled)
- Scans repository history

**How to enable:**
1. Go to Repository Settings → Security & analysis
2. Enable "Secret scanning"
3. Enable "Push protection" (recommended)

**How it works:**
- Runs on every push and pull request
- Matches against known patterns (AWS keys, GitHub tokens, etc.)
- Blocks commit if secret found (with push protection)
- Alerts repository admins

**Cost**: Free with GitHub

---

### 4. Dependency Graph
**Location**: GitHub Insights → Dependency graph

**What it does:**
- Visualizes all project dependencies
- Shows dependency relationships
- Highlights packages with known vulnerabilities
- Integrates with GitHub Advisory Database

**How to view:**
1. Go to Repository → Insights → Dependency graph
2. View all composer packages and versions
3. Click on package to see vulnerability advisories

**Cost**: Free with GitHub

---

## 🚀 Local Security Checks

Run these before committing code:

### 1. Composer Audit
```bash
composer audit
```
Scans your dependencies for known vulnerabilities.

### 2. PHPStan Static Analysis
```bash
phpstan analyse app --level=5
```
Detects type errors and common mistakes.

### 3. PHP CodeSniffer
```bash
phpcs app --standard=PSR12
```
Checks code style and security patterns.

### 4. Unit Tests
```bash
./vendor/bin/sail artisan test
```
Ensures security-related tests pass.

---

## 📋 Security Checklist for PRs

Before submitting a pull request:

- [ ] Ran `composer audit` - no vulnerabilities
- [ ] Ran `phpstan analyse app --level=5` - no errors
- [ ] Ran `phpcs app --standard=PSR12` - code style OK
- [ ] All tests pass: `./vendor/bin/sail artisan test`
- [ ] No environment variables or secrets in code
- [ ] No hardcoded database credentials
- [ ] No API keys or tokens in code
- [ ] New dependencies justified and secure
- [ ] Security implications documented in PR

---

## 🔑 Managing Secrets

### ✅ DO

```php
// ✅ Use environment variables
$apiKey = env('EXTERNAL_API_KEY');
$dbPassword = env('DB_PASSWORD');

// ✅ Store in .env (never commit)
// EXTERNAL_API_KEY=secret_value_here

// ✅ Use .env.example as template
// EXTERNAL_API_KEY=your_key_here (placeholder)
```

### ❌ DON'T

```php
// ❌ Never hardcode secrets
$apiKey = 'sk_live_abc123xyz789';

// ❌ Never commit .env with real values
// DB_PASSWORD=my_real_password_12345

// ❌ Never put secrets in code comments
// Remember to use API_KEY: "secret_key_123"
```

---

## 🚨 Security Incident Response

### If a vulnerability is found:

1. **CodeQL finds issue**:
   - Review in Security → Code scanning
   - Create GitHub issue or PR to fix
   - Reference: "Fixes CodeQL alert #123"

2. **Dependabot finds vulnerable dependency**:
   - Review Dependabot PR
   - Check breaking changes
   - Merge if tests pass
   - Deploy to production

3. **Secret Scanning finds exposed secret**:
   - Immediately rotate the exposed secret
   - Remove from commit history (or squash)
   - Update `.env.example` if needed
   - Audit logs for compromise

---

## 📊 Monitoring Security

### Daily
- Check GitHub Notifications for alerts
- Monitor failed status checks in PRs

### Weekly
- Review Dependabot PRs (created Mondays)
- Check CodeQL scan results
- Review Dependency graph for new vulnerabilities

### Monthly
- Security audit meeting
- Review all merged security PRs
- Update security documentation

---

## 🔗 Quick Links

| Tool | Location | Status |
|------|----------|--------|
| CodeQL | `.github/workflows/codeql.yml` | ⏸️ Deshabilitado |
| Dependabot | `.github/dependabot.yml` | ✅ Activo |
| PHPStan | `phpstan.neon` | ✅ Activo |
| PHPCS | `.php-cs-fixer.php` | ✅ Activo |

---

## 🛠️ Troubleshooting

### CodeQL workflow deshabilitado
- **Status**: ⏸️ Deshabilitado por diseño
- **Razón**: No hay JavaScript en el proyecto
- **Solución**: Se usa PHPStan y Composer Audit para análisis PHP

### Dependabot PRs not created
- **Check**: `.github/dependabot.yml` syntax
- **Fix**: Run: `yamllint .github/dependabot.yml`

### Secret Scanning not blocking pushes
- **Check**: Repository Settings → Security & analysis
- **Fix**: Enable "Push protection" checkbox

---

**Last Updated**: 18 de noviembre de 2025
**Version**: 1.0.0
**Maintained By**: ControlApp Security Team
