# 🔒 Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ControlApp, please report it responsibly and **do not** disclose it publicly until we've had a chance to address it.

### Steps to Report a Vulnerability:

1. **Do NOT create a public GitHub issue** for security vulnerabilities
2. **Email the vulnerability details** to: [Your security contact email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fix (if you have one)

4. We will acknowledge receipt within **48 hours**
5. We aim to release a security patch within **7 days**

---

## Security Features Enabled

### ✅ Automated Security Scanning

This repository uses multiple security tools to maintain code quality and vulnerability detection:

#### 1. **CodeQL Analysis** (Automatic)
- Runs on every push to `main` and pull requests
- Weekly scheduled analysis
- Detects potential security vulnerabilities in PHP code
- Dashboard: GitHub → Security → Code scanning

#### 2. **Dependabot** (Automatic)
- Weekly scanning of composer dependencies
- Automatic PR creation for updates
- Prioritizes security patches
- Dashboard: GitHub → Security → Dependabot

#### 3. **Secret Scanning** (Recommended to Enable)
- Detects accidentally committed secrets (API keys, tokens, passwords)
- **How to enable:**
  - Go to Repository Settings → Security & analysis
  - Enable "Secret scanning"
  - Enable "Push protection" (prevents commits with secrets)

#### 4. **Dependency Graph** (Automatic)
- Tracks all project dependencies
- Shows vulnerability advisories
- Dashboard: GitHub → Insights → Dependency graph

---

## Development Security Best Practices

### For Contributors:

1. **Environment Variables**
   - Store all secrets in `.env` (never commit to version control)
   - Use `.env.example` as template with placeholder values

2. **Dependencies**
   - Review security advisories regularly
   - Keep dependencies updated (use Dependabot PRs)
   - Run `composer audit` locally before committing

3. **Code Review**
   - All PRs require code review before merging
   - Security team will review for vulnerabilities
   - Look for: SQL injection, XSS, CSRF, authentication flaws

4. **Testing**
   - Write security-related tests
   - Run tests before submitting PR: `./vendor/bin/sail artisan test`
   - Run static analysis: `phpstan analyse app --level=5`

---

## Security Resources

### Laravel Security

- [Laravel Security Documentation](https://laravel.com/docs/security)
- [Laravel Security Best Practices](https://laravel.com/docs/validation)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Tools Used

- **PHPStan** - Static analysis (catches type errors and common mistakes)
- **PHP_CodeSniffer** - Code style and security checks
- **Composer Audit** - Dependency vulnerability scanner
- **GitHub CodeQL** - Deep security analysis

---

## Supported Versions

| Version | Security Updates | Bug Fixes |
|---------|------------------|-----------|
| 1.0.x (Latest) | ✅ | ✅ |
| < 1.0 | ❌ | ❌ |

---

## GitHub Security Settings

### Recommended Enabled Settings:

Go to: **Repository Settings → Security & analysis**

- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Dependabot version updates
- ✅ Code scanning (CodeQL)
- ✅ Secret scanning
- ✅ Push protection
- ✅ Dependency graph
- ✅ SAST scanning

---

## Questions?

For security-related questions or concerns, please:
- Email: [Your security contact]
- Do NOT open public issues for security concerns
- Use GitHub Security Advisory if reporting on behalf of GitHub

---

**Last Updated**: 16 de noviembre de 2025
**Security Status**: 🟢 Active
