#!/bin/bash

# Script para verificar la documentación
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          ControlApp - Documentación Completa               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Archivos de Documentación Creados:"
echo ""

cd docs 2>/dev/null

files=(
  "README.md:Guía completa del proyecto"
  "INSTALLATION.md:Instalación en local y producción"
  "API.md:Documentación de todos los endpoints"
  "AUTHENTICATION.md:Sistema de autenticación y seguridad"
  "DATABASE.md:Esquema de BD y relaciones"
  "CONTRIBUTING.md:Guía para contribuidores"
  "CHANGELOG.md:Historial de cambios y versiones"
  "INDEX.md:Índice completo de documentación"
)

counter=1
for file_desc in "${files[@]}"; do
  IFS=':' read -r file desc <<< "$file_desc"
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    size=$(du -h "$file" | cut -f1)
    printf "  %d. ✅ %-20s %5d líneas  %5s  - %s\n" "$counter" "$file" "$lines" "$size" "$desc"
    ((counter++))
  else
    printf "  %d. ❌ %-20s FALTANTE\n" "$counter" "$file"
    ((counter++))
  fi
done

echo ""
echo "📊 Estadísticas Totales:"
echo ""
total_lines=$(wc -l *.md 2>/dev/null | tail -1 | awk '{print $1}')
total_size=$(du -sh . | cut -f1)
total_files=$(ls -1 *.md 2>/dev/null | wc -l)

printf "  📝 Archivos:       %d\n" "$total_files"
printf "  📄 Líneas:         %d\n" "$total_lines"
printf "  💾 Tamaño Total:   %s\n" "$total_size"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               📚 Documentación Profesional 📚               ║"
echo "║                                                            ║"
echo "║  ✅ Markdown format (Profesional y versional)             ║"
echo "║  ✅ Documentación en español                              ║"
echo "║  ✅ API completa documentada                              ║"
echo "║  ✅ Guía de instalación detallada                         ║"
echo "║  ✅ Sistema de autenticación documentado                  ║"
echo "║  ✅ Esquema de BD documentado                             ║"
echo "║  ✅ Guía para contribuidores                              ║"
echo "║  ✅ Changelog con todos los cambios                       ║"
echo "║  ✅ Índice de navegación completo                         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Primeros Pasos:"
echo ""
echo "  1. Lee: docs/INDEX.md (visión completa)"
echo "  2. Comienza con: docs/README.md (introducción)"
echo "  3. Instala: docs/INSTALLATION.md (setup)"
echo "  4. Desarrolla: docs/API.md (endpoints)"
echo ""
echo "🌐 Visualizar documentación:"
echo ""
echo "  # Con MkDocs (si está instalado)"
echo "  pip install mkdocs mkdocs-material"
echo "  mkdocs serve"
echo ""
echo "💬 Preguntas o problemas:"
echo ""
echo "  • Lee la sección 'Troubleshooting' en cada doc"
echo "  • Abre un issue en GitHub"
echo "  • Consulta docs/CONTRIBUTING.md para reportar bugs"
echo ""
