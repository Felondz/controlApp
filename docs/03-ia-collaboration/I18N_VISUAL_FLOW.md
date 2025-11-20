# 📊 Diagrama Visual del Flujo Ideal i18n

**Representación visual del procedimiento correcto para agregar traducciones en ControlApp**

---

## 🎯 Flujo Ideal (Paso a Paso)

### Visualización ASCII

```
┌─────────────────────────────────────────────────────────────┐
│   NUEVO TEXTO EN LA APLICACIÓN                              │
│   Ejemplo: "Balance de Cuentas"                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: Editar resources/lang/es.json                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  {                                                           │
│    "accounts": {                                             │
│      "balance": "Balance de Cuentas"  ← AGREGAR AQUÍ        │
│    }                                                         │
│  }                                                           │
│                                                              │
│  ✅ Guardado                                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 2: Editar resources/lang/en.json                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  {                                                           │
│    "accounts": {                                             │
│      "balance": "Account Balance"  ← AGREGAR AQUÍ           │
│    }                                                         │
│  }                                                           │
│                                                              │
│  ⚠️ CRÍTICO: SIEMPRE agregar AMBOS idiomas                 │
│  ✅ Guardado                                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 3: Escribir Componente React                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  import { useTranslate } from '@/hooks/useTranslate';       │
│                                                              │
│  export default function Accounts() {                       │
│    const t = useTranslate();  ← Hook                       │
│    return <h1>{t('accounts.balance')}</h1>;                 │
│  }                                                           │
│                                                              │
│  ✅ Componente creado                                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 4: Verificar en Navegador                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  http://localhost:5175                                      │
│                                                              │
│  ✅ CORRECTO: Ves "Balance de Cuentas"                     │
│  ❌ ERROR: Ves "accounts.balance"                          │
│           → Significa: Clave falta en JSON                │
│           → Solución: Agrega a es.json o en.json           │
│                                                              │
│  🔄 HMR automático: Cambios en <100ms                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    ✅ LISTO
             Componente 100% traducido
             en Español e Inglés
```

---

## 🔍 Qué Pasa Si Algo Sale Mal

### Escenario 1: Ves la Clave en Pantalla

```
Pantalla muestra: "accounts.balance"
        ↓
Diagnóstico: La clave NO existe en JSON
        ↓
Verificar:
├─ ¿Está en es.json? 
│  └─ NO → Agrégala
│
├─ ¿Está en en.json?
│  └─ NO → Agrégala (⚠️ CRÍTICO)
│
└─ ¿Hay typo?
   ├─ En código: {t('accounts.balanc')} ← typo
   └─ En JSON: "balanc" vs "balance"

Acción correctiva:
1. Editar es.json → Agregar "accounts.balance": "Balance de Cuentas"
2. Editar en.json → Agregar "accounts.balance": "Account Balance"
3. Recarga página (F5)
4. ✅ Ahora ves el texto traducido
```

### Escenario 2: Solo Inglés Muestra la Clave

```
En español: "Balance de Cuentas"  ✅
En inglés:  "accounts.balance"     ❌
        ↓
Diagnóstico: Olvidaste agregar a en.json
        ↓
Verificar:
├─ es.json contiene: "accounts.balance": "Balance de Cuentas" ✅
└─ en.json contiene: ??? NO ← Clave falta

Acción correctiva:
1. Editar en.json
2. Agregar: "accounts.balance": "Account Balance"
3. Recarga página
4. ✅ Ambos idiomas funcionan
```

### Escenario 3: Typo en Componente React

```
Código: {t('accounts.balanc')}  ← Typo: "balanc" vs "balance"
        ↓
Pantalla: "accounts.balanc"  ← Fallback muestra el error
        ↓
Diagnóstico: Clave NO existe (hay typo)
        ↓
Acción correctiva:
1. Verifica la clave en es.json
   └─ Ves: "accounts.balance" (sin typo)
2. Entiendes: Tu componente tiene typo
3. Corriges a: {t('accounts.balance')}
4. ✅ Funciona
```

---

## 📋 Comparación: Mala vs Buena Práctica

### ❌ Flujo Incorrecto (Genera Deuda)

```
PASO 1: Escribir React
<h1>{"Mis Proyectos"}</h1>

PASO 2: Acordarse de traducir
"Ah, debo agregar a JSON"

PASO 3: Agregar a es.json SOLO
{ "dashboard": { "my_projects": "Mis Proyectos" } }

RESULTADO:
├─ Texto visible ✅
├─ En español funciona ✅
├─ En inglés muestra: "dashboard.my_projects" ❌
└─ DEUDA: "Falta traducir al inglés"

Problema: Acumula trabajos pendientes
          Difícil de auditar
          Pasado en limpio desactualized
```

### ✅ Flujo Correcto (Flujo Ideal)

```
PASO 1: Agregar a es.json PRIMERO
{ "dashboard": { "my_projects": "Mis Proyectos" } }

PASO 2: Agregar a en.json SEGUNDO
{ "dashboard": { "my_projects": "My Projects" } }

PASO 3: Escribir React
<h1>{t('dashboard.my_projects')}</h1>

RESULTADO:
├─ Es.json ✅ (español)
├─ En.json ✅ (inglés)
├─ Componente ✅ (React)
├─ En español: "Mis Proyectos" ✅
├─ En inglés: "My Projects" ✅
└─ CERO DEUDA: Todo completado

Beneficio: Nada pendiente
           Proyecto siempre en sinc
           Fácil de auditar (fallback lo muestra)
```

---

## 🎁 Sistema de Fallback (Tu Aliado)

### Cómo Funciona

```
{t('accounts.balance')}
       ↓
¿La clave existe en JSON?
   ├─ SÍ → Renderiza: "Balance de Cuentas" ✅
   │
   └─ NO → Renderiza: "accounts.balance" (la clave misma) ❌
            │
            └─ Tu ves el error
               │
               └─ Sabes exactamente qué falta
                  │
                  └─ Lo corriges en 10 segundos
```

### Por Qué es Inteligente

```
BENEFICIO: El fallback es un CANARIO de errores

Si ves en pantalla: "accounts.balance"
Sabes INMEDIATAMENTE:
├─ NO existe en es.json, O
├─ NO existe en en.json, O
└─ Hay typo en la clave

Sin fallback:
┌─ Te olvidarías de traducir
├─ Usuario ve nada (crash)
├─ Error difícil de encontrar
└─ Deuda técnica acumulada

Con fallback:
┌─ Ves la clave en pantalla
├─ Sabes qué falta
├─ Error obvio y fácil de arreglar
└─ Cero deuda técnica
```

---

## 📊 Checklist Visual

### Antes de Hacer Commit

```
¿Agregaste a es.json?
├─ SÍ  → ✅
├─ NO  → ❌ DETENTE, ve al paso 1
└─ ? (no estoy seguro)
   └─ Verifica: resources/lang/es.json

¿Agregaste a en.json?
├─ SÍ  → ✅ (⚠️ Esto es lo que más se olvida)
├─ NO  → ❌ DETENTE, ve al paso 2
└─ ? (no estoy seguro)
   └─ Verifica: resources/lang/en.json

¿Usaste t() en React?
├─ SÍ  → ✅
├─ NO  → ❌ NO hardcodees: {t('seccion.clave')}
└─ ? (no estoy seguro)
   └─ Busca "string literal" en tu componente

¿Verificaste en HMR?
├─ SÍ  → ✅ Ves texto en español
├─ NO  → ❌ Recarga: http://localhost:5175
└─ ¿Ves la clave en pantalla?
   └─ Significa: Falta en JSON

Si TODO está ✅:
LISTO PARA COMMIT ✨
```

---

## 🎓 Resumen para Recordar

### El Orden Es CRÍTICO

```
┌────────────────────────────────────┐
│ 1️⃣ JSON ESPAÑOL (es.json)         │
├────────────────────────────────────┤
│ Agregar clave: "accounts.balance" │
│ Valor: "Balance de Cuentas"       │
└────────────────────────────────────┘
             ↓↓↓
┌────────────────────────────────────┐
│ 2️⃣ JSON INGLÉS (en.json)          │
├────────────────────────────────────┤
│ Agregar clave: "accounts.balance" │
│ Valor: "Account Balance"          │
└────────────────────────────────────┘
             ↓↓↓
┌────────────────────────────────────┐
│ 3️⃣ COMPONENTE REACT               │
├────────────────────────────────────┤
│ const t = useTranslate();         │
│ <h1>{t('accounts.balance')}</h1>  │
└────────────────────────────────────┘
             ↓↓↓
┌────────────────────────────────────┐
│ ✅ VERIFICAR EN NAVEGADOR         │
├────────────────────────────────────┤
│ http://localhost:5175             │
│ ✅ Ves texto traducido             │
│ ❌ Ves clave? Falta en JSON        │
└────────────────────────────────────┘
```

### Lo Que NUNCA Debes Hacer

```
❌ No: <h1>"Mis Proyectos"</h1>
✅ Sí: <h1>{t('dashboard.my_projects')}</h1>

❌ No: Agregar solo a es.json
✅ Sí: Agregar a es.json Y en.json

❌ No: Escribir React primero
✅ Sí: JSON primero, React después

❌ No: Dejar claves sin traducir
✅ Sí: El fallback te obliga a completar
```

---

## 🚀 Conclusión

```
FLUJO IDEAL:
es.json → en.json → React → Verificar → ✅ LISTO

TIEMPO TOTAL: 3-5 minutos por componente

BENEFICIOS:
├─ Cero hardcoding
├─ Cero deuda técnica
├─ Fallback detecta errores
├─ HMR instantáneo
└─ Proyecto escalable

RECUERDA:
Si ves una clave en pantalla → Falta en JSON
Úsalo como herramienta de debugging
```

---

**Versión**: 1.0.0  
**Última actualización**: 19 de noviembre de 2025  
**Estado**: ✅ Production Ready
