# 💻 Documentación de Desarrollo - Español

Guías exhaustivas para desarrolladores trabajando en ControlApp.

**Última Actualización**: 20 de Noviembre de 2025

## 📁 Contenidos

- **INSTALLATION.md** - Cómo instalar ControlApp (con/sin Docker)
- **API.md** - Documentación de endpoints REST (actualizado con rate limiting)
- **AUTHENTICATION.md** - Sistema de autenticación y seguridad
- **AUTHORIZATION_VALIDATION.md** - Políticas, FormRequest, Rate Limiting
- **DATABASE.md** - Esquema de base de datos y modelos
- **CONTRIBUTING.md** - Cómo contribuir al proyecto

## 🎯 Propósito

Guías prácticas para:
- Instalar y configurar el ambiente
- Entender la arquitectura de BD
- Usar y extender la API REST
- Implementar autenticación segura (Sanctum, Policies)
- Validar entrada (FormRequest)
- Rate limiting y protección
- Contribuir al proyecto

## 👉 Comienza aquí

**Si estás instalando**:
→ INSTALLATION.md

**Si estás desarrollando un nuevo endpoint**:
1. DATABASE.md (entender modelos)
2. AUTHENTICATION.md (seguridad requerida)
3. AUTHORIZATION_VALIDATION.md (crear Policy + FormRequest)
4. API.md (documentar endpoint)
5. CONTRIBUTING.md (commit y push)

**Si necesitas entender autorización**:
→ AUTHORIZATION_VALIDATION.md

**Si necesitas entender seguridad**:
→ AUTHENTICATION.md

## � Security Improvements (Nov 16, 2025)

- ✅ Added Authorization Policies (centralized access control)
- ✅ Added FormRequest Validation (strong input validation)
- ✅ Added Rate Limiting (protection against brute force)
- ✅ Hardened CORS configuration
- ✅ Token security: prefix + 24h expiration
- ✅ Email validation: RFC + DNS check
- ✅ Input sanitization middleware

## �🔄 Actualización

| Documento | Cuándo | Status |
|-----------|--------|--------|
| INSTALLATION.md | Cambios en setup | ✅ Current |
| API.md | Nuevos endpoints + rate limits | ✅ Updated Nov 16 |
| DATABASE.md | Nuevas migraciones | ✅ Current |
| AUTHENTICATION.md | Cambios en auth | ✅ Updated Nov 16 |
| AUTHORIZATION_VALIDATION.md | **NEW** - Policies & FormRequest | ✅ NEW Nov 16 |
| CONTRIBUTING.md | Cambios de proceso | ✅ Current |

## 📚 Related Security Documentation

For detailed security information, see `/docs/06-security/`:
- `SECURITY_AUDIT.md` - Comprehensive security audit
- `PRODUCTION_DEPLOYMENT.md` - Deployment security checklist
- `COMPLETION_SUMMARY.md` - What was fixed summary

---

**Última actualización**: 16 de noviembre de 2025


