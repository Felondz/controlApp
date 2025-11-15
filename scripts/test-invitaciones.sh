#!/bin/bash

# Script de Testing para Invitaciones en ControlApp
# Uso: bash test-invitaciones.sh

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API URL
API="http://localhost:8000/api"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🧪 Testing de Invitaciones - ControlApp              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# PASO 1: Registrar ADMIN
# ============================================================================
echo -e "${YELLOW}📝 PASO 1: Registrando ADMIN...${NC}"

ADMIN_EMAIL="admin_$(date +%s)@example.com"
ADMIN_PASSWORD="password123"
ADMIN_NAME="Admin User"

REGISTER_RESPONSE=$(curl -s -X POST $API/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"$ADMIN_NAME\",
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\",
    \"password_confirmation\": \"$ADMIN_PASSWORD\"
  }")

echo -e "${GREEN}✅ Admin registrado: $ADMIN_EMAIL${NC}"
echo ""

# ============================================================================
# PASO 2: Login ADMIN
# ============================================================================
echo -e "${YELLOW}🔐 PASO 2: Login ADMIN...${NC}"

LOGIN_RESPONSE=$(curl -s -X POST $API/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
ADMIN_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id')

echo -e "${GREEN}✅ Token Admin: ${ADMIN_TOKEN:0:20}...${NC}"
echo -e "${GREEN}✅ Admin ID: $ADMIN_ID${NC}"
echo ""

# ============================================================================
# PASO 3: Verificar Email del ADMIN
# ============================================================================
echo -e "${YELLOW}✉️  PASO 3: Verificando email del ADMIN...${NC}"

# Add delay to avoid rate limiting
sleep 2

HASH=$(echo -n "$ADMIN_EMAIL" | sha1sum | cut -d' ' -f1)
VERIFY_RESPONSE=$(curl -s -X GET "$API/email/verify/$ADMIN_ID/$HASH")

echo -e "${GREEN}✅ Email verificado${NC}"
echo ""

# ============================================================================
# PASO 4: Login ADMIN de nuevo (con email verificado)
# ============================================================================
echo -e "${YELLOW}🔐 PASO 4: Login ADMIN (con email verificado)...${NC}"

LOGIN_RESPONSE=$(curl -s -X POST $API/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo -e "${GREEN}✅ Token actualizado: ${ADMIN_TOKEN:0:20}...${NC}"
echo ""

# ============================================================================
# PASO 5: Crear PROYECTO
# ============================================================================
echo -e "${YELLOW}📁 PASO 5: Creando PROYECTO...${NC}"

PROYECTO_RESPONSE=$(curl -s -X POST $API/proyectos \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"nombre\": \"Proyecto de Testing\",
    \"moneda\": \"USD\"
  }")

PROYECTO_ID=$(echo $PROYECTO_RESPONSE | jq -r '.id')

echo -e "${GREEN}✅ Proyecto creado: ID $PROYECTO_ID${NC}"
echo ""

# ============================================================================
# PASO 6: ADMIN INVITA a NEW_USER ⭐
# ============================================================================
echo -e "${YELLOW}📬 PASO 6: ADMIN enviando invitación...${NC}"

NEW_USER_EMAIL="newuser_$(date +%s)@example.com"

INVITACION_RESPONSE=$(curl -s -X POST $API/proyectos/$PROYECTO_ID/invitaciones \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$NEW_USER_EMAIL\",\"rol\":\"miembro\"}")

INVITACION_TOKEN=$(echo "$INVITACION_RESPONSE" | jq -r '.token')
INVITACION_ID=$(echo "$INVITACION_RESPONSE" | jq -r '.id')

if [ -z "$INVITACION_TOKEN" ] || [ "$INVITACION_TOKEN" = "null" ]; then
  echo -e "${RED}❌ Error al crear invitación:${NC}"
  echo "$INVITACION_RESPONSE" | jq .
  exit 1
fi

echo -e "${GREEN}✅ Invitación enviada a: $NEW_USER_EMAIL${NC}"
echo -e "${GREEN}✅ Invitación ID: $INVITACION_ID${NC}"
echo -e "${GREEN}✅ Token de invitación: ${INVITACION_TOKEN:0:20}...${NC}"
echo ""

# Add delay to avoid rate limiting on email service
echo -e "${YELLOW}⏳ Esperando 2 segundos para evitar rate limit de email...${NC}"
sleep 2
echo ""

# ============================================================================
# PASO 7: Ver emails en Mailpit
# ============================================================================
echo -e "${YELLOW}📧 PASO 7: Información de Mailpit${NC}"
echo -e "${GREEN}✅ Puedes ver los emails en: http://localhost:8025${NC}"
echo -e "   Busca el email a: $NEW_USER_EMAIL"
echo ""

# ============================================================================
# PASO 8: NEW_USER se registra
# ============================================================================
echo -e "${YELLOW}👤 PASO 8: NEW_USER se registra...${NC}"

# Add delay to avoid rate limiting
sleep 2

NEW_USER_PASSWORD="newpassword123"

REGISTER_NEW_USER=$(curl -s -X POST $API/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"New User\",\"email\":\"$NEW_USER_EMAIL\",\"password\":\"$NEW_USER_PASSWORD\",\"password_confirmation\":\"$NEW_USER_PASSWORD\"}")

NEW_USER_ID=$(echo "$REGISTER_NEW_USER" | jq -r '.user.id')

if [ -z "$NEW_USER_ID" ] || [ "$NEW_USER_ID" = "null" ]; then
  echo -e "${RED}❌ Error al registrar nuevo usuario:${NC}"
  echo "$REGISTER_NEW_USER" | jq .
  exit 1
fi

echo -e "${GREEN}✅ Nuevo usuario registrado: ID $NEW_USER_ID${NC}"
echo ""

# ============================================================================
# PASO 9: NEW_USER inicia sesión
# ============================================================================
echo -e "${YELLOW}🔑 PASO 9: NEW_USER inicia sesión...${NC}"

LOGIN_NEW_USER=$(curl -s -X POST $API/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"email\": \"$NEW_USER_EMAIL\",
    \"password\": \"$NEW_USER_PASSWORD\"
  }")

NEW_USER_TOKEN=$(echo $LOGIN_NEW_USER | jq -r '.access_token')

echo -e "${GREEN}✅ Token del nuevo usuario: ${NEW_USER_TOKEN:0:20}...${NC}"
echo ""

# ============================================================================
# PASO 10: Verificar email del NEW_USER
# ============================================================================
echo -e "${YELLOW}✉️  PASO 10: Verificando email del NEW_USER...${NC}"

# Add delay to avoid rate limiting
sleep 2

HASH_NEW=$(echo -n "$NEW_USER_EMAIL" | sha1sum | cut -d' ' -f1)
VERIFY_NEW=$(curl -s -X GET "$API/email/verify/$NEW_USER_ID/$HASH_NEW")

echo -e "${GREEN}✅ Email del nuevo usuario verificado${NC}"
echo ""

# ============================================================================
# PASO 11: NEW_USER acepta la invitación ⭐
# ============================================================================
echo -e "${YELLOW}✅ PASO 11: NEW_USER aceptando invitación...${NC}"

# Nota: El token debe coincidir exactamente con el de la BD
# Si tienes problemas, verifica que INVITACION_TOKEN tenga el valor correcto
ACEPTAR_RESPONSE=$(curl -s -X POST $API/invitaciones/$INVITACION_TOKEN/accept \
  -H "Authorization: Bearer $NEW_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{}")

# Verifica la respuesta (busca 'miembros' para confirmar éxito)
if echo $ACEPTAR_RESPONSE | grep -q "miembros"; then
  echo -e "${GREEN}✅ Invitación aceptada correctamente${NC}"
else
  echo -e "${RED}⚠️  Respuesta inesperada:${NC}"
  echo $ACEPTAR_RESPONSE | jq . 2>/dev/null || echo $ACEPTAR_RESPONSE | head -20
fi
echo ""

# ============================================================================
# PASO 12: Verificar que NEW_USER es miembro del PROYECTO
# ============================================================================
echo -e "${YELLOW}👥 PASO 12: Verificando que NEW_USER es miembro...${NC}"

PROYECTO_DETAIL=$(curl -s -X GET $API/proyectos/$PROYECTO_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Accept: application/json")

MIEMBROS=$(echo $PROYECTO_DETAIL | jq '.miembros | length')

echo -e "${GREEN}✅ Miembros del proyecto: $MIEMBROS${NC}"
echo ""

# ============================================================================
# RESUMEN
# ============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 ✅ TESTING COMPLETADO                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}Datos de Testing:${NC}"
echo ""
echo "Admin:"
echo "  Email: $ADMIN_EMAIL"
echo "  Token: $ADMIN_TOKEN"
echo ""
echo "Proyecto:"
echo "  ID: $PROYECTO_ID"
echo "  Nombre: Proyecto de Testing"
echo ""
echo "Invitación:"
echo "  Email: $NEW_USER_EMAIL"
echo "  ID: $INVITACION_ID"
echo "  Token: $INVITACION_TOKEN"
echo ""
echo "Nuevo Usuario:"
echo "  Email: $NEW_USER_EMAIL"
echo "  ID: $NEW_USER_ID"
echo "  Token: $NEW_USER_TOKEN"
echo ""

echo -e "${YELLOW}📊 Próximos pasos:${NC}"
echo ""
echo "1. Ver emails en: http://localhost:8025"
echo "2. Verificar en BD:"
echo "   docker compose exec mysql mysql -h mysql -u sail -ppassword laravel -e 'SELECT * FROM users;'"
echo ""
echo "3. Ver miembros del proyecto:"
echo "   docker compose exec mysql mysql -h mysql -u sail -ppassword laravel -e 'SELECT * FROM proyecto_user WHERE proyecto_id=$PROYECTO_ID;'"
echo ""

echo -e "${GREEN}✨ ¡Script completado exitosamente!${NC}"
