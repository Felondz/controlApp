<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int|null $user_id
 * @property string $email
 * @property string $rol
 * @property string $token
 * @property \Carbon\Carbon|null $expires_at
 * @property-read Proyecto $proyecto
 * @property-read User|null $invitador
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Database\Factories\InvitacionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereRol($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invitacion whereUserId($value)
 */
	class Invitacion extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $key
 * @property string $name
 * @property string|null $description
 * @property numeric $price
 * @property bool $is_free
 * @property bool $is_active
 * @property bool $coming_soon
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereComingSoon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereIsFree($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Module whereUpdatedAt($value)
 */
	class Module extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereUserId($value)
 */
	class PasswordReset extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $nombre
 * @property string|null $descripcion
 * @property string|null $description Alias for descripcion
 * @property string $moneda_default
 * @property int $user_id
 * @property bool $es_personal
 * @property bool $visible_en_listado
 * @property array|null $modules
 * @property string|null $color
 * @property string|null $icon
 * @property string|null $image_path
 * @property string|null $theme
 * @property string|null $typography
 * @property array|null $settings
 * @property-read bool $has_messaging_feature
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $miembros
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Cuenta> $cuentas
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Cuenta> $cuentasAsociadas
 * @property int|null $proyecto_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Finance\Models\Categoria> $categorias
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaccion> $transacciones
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Invitacion> $invitaciones
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Task> $tasks
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Message> $messages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Inventory\Models\InventoryItem> $inventoryItems
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property bool $isAdmin Flag for UI
 * @property int $unread_messages_count Flag for UI
 * @property int $pending_tasks_count Flag for UI
 * @property int $due_today_count Flag for UI
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read int|null $categorias_count
 * @property-read int|null $cuentas_count
 * @property-read int|null $cuentas_asociadas_count
 * @property-read string|null $image_url
 * @property-read int|null $inventory_items_count
 * @property-read int|null $invitaciones_count
 * @property-read int|null $messages_count
 * @property-read int|null $miembros_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\User|null $propietarioPersonal
 * @property-read int|null $tasks_count
 * @property-read int|null $transacciones_count
 * @method static \Database\Factories\ProyectoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereEsPersonal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereModules($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereMonedaDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereTheme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereTypography($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto whereVisibleEnListado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Proyecto withoutTrashed()
 */
	class Proyecto extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $profile_photo_path
 * @property string|null $global_theme
 * @property array|null $enabled_tools
 * @property array|null $settings
 * @property string|null $remember_token
 * @property string $locale
 * @property bool $is_super_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property int|null $count aggregate property
 * @property int|null $unread_messages_count aggregate property
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Proyecto> $proyectos
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Proyecto> $proyectosPersonales
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Cuenta> $cuentas
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Task> $tasks
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Chat\Models\Message> $messages
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 * @method static find(int $id)
 * @property-read int|null $cuentas_count
 * @property-read bool $is_online
 * @property-read string $profile_photo_url
 * @property-read int|null $messages_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read int|null $proyectos_count
 * @property-read int|null $proyectos_personales_count
 * @property-read int|null $tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEnabledTools($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGlobalTheme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsSuperAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLocale($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProfilePhotoPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $provider
 * @property mixed $api_key
 * @property string|null $default_model
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserLLMSetting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserLLMSetting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserLLMSetting query()
 */
	class UserLLMSetting extends \Eloquent {}
}

namespace App\Modules\Chat\Models{
/**
 * @property int $id
 * @property string $content
 * @property string $type
 * @property int|null $proyecto_id
 * @property int $user_id
 * @property int|null $recipient_id
 * @property \Carbon\Carbon|null $read_at
 * @property-read bool $is_read
 * @property-read int|string $receiver_id Alias for recipient_id if used in events
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\Proyecto|null $proyecto
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $recipient
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @method static \Database\Factories\MessageFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereRecipientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message withoutTrashed()
 */
	class Message extends \Eloquent {}
}

namespace App\Modules\Finance\Models{
/**
 * @property int $id
 * @property int|null $proyecto_id
 * @property string $nombre
 * @property string $tipo
 * @property string|null $image_path
 * @property-read Proyecto|null $proyecto
 * @property-read User $user
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string|null $icono
 * @property string|null $color
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Finance\Models\Transaccion> $transacciones
 * @property-read int|null $transacciones_count
 * @method static \Database\Factories\CategoriaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereIcono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria withoutTrashed()
 */
	class Categoria extends \Eloquent {}
}

namespace App\Modules\Finance\Models{
/**
 * @property int $id
 * @property string $nombre
 * @property string|null $banco
 * @property string $tipo
 * @property int $saldo_inicial
 * @property int $saldo_actual
 * @property int $balance
 * @property int $saldo
 * @property int $propietario_id
 * @property string|null $propietario_type
 * @property string|null $estado
 * @property string|null $moneda
 * @property string|null $descripcion
 * @property string|null $color
 * @property string|null $icono
 * @property bool|null $es_nomina
 * @property int|null $dia_nomina
 * @property int|null $valor_nomina
 * @property float|null $tasa_interes_anual
 * @property \Carbon\Carbon|null $fecha_vencimiento
 * @property int|null $dia_corte
 * @property int|null $dia_pago
 * @property int|null $limite_credito
 * @property float|null $tasa_interes
 * @property string|null $fecha_interes
 * @property bool|null $capitalizable
 * @property string|null $periodo_capitalizacion
 * @property int|null $plazo
 * @property int|null $valor_cuota
 * @property int|null $cuotas_pagadas
 * @property int|null $monto_desembolsado
 * @property int|null $cuenta_destino_id
 * @property int|null $proyecto_id
 * @property-read Proyecto $proyecto
 * @property-read Proyecto $propietario
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read Cuenta|null $cuentaDestino
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Proyecto> $proyectosAsociados
 * @property-read int|null $proyectos_asociados_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Finance\Models\Transaccion> $transacciones
 * @property-read int|null $transacciones_count
 * @method static \Database\Factories\CuentaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereBanco($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereCapitalizable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereCuentaDestinoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereCuotasPagadas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDiaCorte($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDiaNomina($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDiaPago($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereEsNomina($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereFechaInteres($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereFechaVencimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereIcono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereLimiteCredito($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereMoneda($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereMontoDesembolsado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePeriodoCapitalizacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePlazo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePropietarioId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePropietarioType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereSaldoActual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereSaldoInicial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereTasaInteres($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereTasaInteresAnual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereValorCuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereValorNomina($value)
 */
	class Cuenta extends \Eloquent {}
}

namespace App\Modules\Finance\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property string $name
 * @property string|null $tax_id
 * @property string|null $contact_name
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address
 * @property string $payment_terms
 * @property string $category
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Finance\Models\SupplyContract> $contracts
 * @property-read int|null $contracts_count
 * @property-read \App\Models\Proyecto $proyecto
 * @method static \Database\Factories\ProviderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereContactName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider wherePaymentTerms($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereTaxId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Provider withoutTrashed()
 */
	class Provider extends \Eloquent {}
}

namespace App\Modules\Finance\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $provider_id
 * @property string $name
 * @property string $frequency
 * @property int|null $recurrence_day
 * @property array<array-key, mixed>|null $items
 * @property numeric $total_amount
 * @property string $currency_code
 * @property bool $auto_generate_invoice
 * @property int|null $billing_category_id
 * @property int|null $target_account_id
 * @property \Illuminate\Support\Carbon|null $last_run_at
 * @property \Illuminate\Support\Carbon|null $next_run_at
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Modules\Finance\Models\Categoria|null $billingCategory
 * @property-read \App\Modules\Finance\Models\Provider $provider
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \App\Modules\Finance\Models\Cuenta|null $targetAccount
 * @method static \Database\Factories\SupplyContractFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereAutoGenerateInvoice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereBillingCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereCurrencyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereItems($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereLastRunAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereNextRunAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereProviderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereRecurrenceDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereTargetAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupplyContract withoutTrashed()
 */
	class SupplyContract extends \Eloquent {}
}

namespace App\Modules\Finance\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $cuenta_id
 * @property int $categoria_id
 * @property int $user_id
 * @property float $monto
 * @property string $tipo
 * @property string $status
 * @property string $descripcion
 * @property string $titulo
 * @property string $fecha
 * @property int|null $task_id
 * @property string|null $notas
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion query()
 * @method static Transaccion create(array<string, mixed> $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion where(string $column, $operator = null, $value = null)
 * @property int|null $cuenta_predeterminada_id
 * @property int $debito_automatico
 * @property string|null $fecha_autopago
 * @property int $cuotas
 * @property int|null $cuota_actual
 * @property string|null $ciclo_facturacion
 * @property int|null $transaccion_origen_id
 * @property int $is_recurring
 * @property string|null $recurrence_interval
 * @property int|null $recurrence_day
 * @property string|null $next_occurrence
 * @property string|null $source_type
 * @property int|null $source_id
 * @property-read \App\Modules\Finance\Models\Categoria|null $categoria
 * @property-read \App\Modules\Finance\Models\Cuenta|null $cuenta
 * @property-read \App\Modules\Finance\Models\Cuenta|null $cuentaPredeterminada
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaccion> $cuotasHijas
 * @property-read int|null $cuotas_hijas_count
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \Illuminate\Database\Eloquent\Model|null $source
 * @property-read Transaccion|null $transaccionOrigen
 * @property-read \App\Models\User $usuario
 * @method static \Database\Factories\TransaccionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCategoriaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCicloFacturacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCuentaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCuentaPredeterminadaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCuotaActual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCuotas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereDebitoAutomatico($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereFecha($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereFechaAutopago($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereIsRecurring($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereMonto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereNextOccurrence($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereNotas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereRecurrenceDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereSourceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereSourceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereTransaccionOrigenId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereUserId($value)
 */
	class Transaccion extends \Eloquent {}
}

namespace App\Modules\Inventory\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int|null $parent_id
 * @property string $sku
 * @property string $name
 * @property string|null $description
 * @property string $type
 * @property string $unit
 * @property array|null $attributes
 * @property float $min_stock_level
 * @property float $max_stock_level
 * @property float $current_stock
 * @property float $cost_price
 * @property float $sale_price
 * @property bool $is_active
 * @property string|null $image_path
 * @property-read string|null $image_url
 * @property-read \Illuminate\Support\Collection<int, InventoryTransaction> $transactions
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read InventoryItem|null $parent
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read int|null $transactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, InventoryItem> $variants
 * @property-read int|null $variants_count
 * @method static \Database\Factories\InventoryItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereAttributes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereCostPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereCurrentStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereMaxStockLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereMinStockLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereSalePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereSku($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryItem withoutTrashed()
 */
	class InventoryItem extends \Eloquent {}
}

namespace App\Modules\Inventory\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $inventory_item_id
 * @property int $user_id
 * @property string $type
 * @property float $quantity
 * @property float $unit_price
 * @property float $total_amount
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property string|null $notes
 * @property string $status
 * @property \Carbon\Carbon $transaction_date
 * @property-read InventoryItem|null $item
 * @property-read Proyecto $proyecto
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|null $reference
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereInventoryItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereReferenceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereTransactionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereUnitPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InventoryTransaction whereUserId($value)
 */
	class InventoryTransaction extends \Eloquent {}
}

namespace App\Modules\Operations\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $production_process_id
 * @property string $name
 * @property int $order
 * @property string|null $description
 * @property bool $requires_quality_check
 * @property float|null $estimated_duration_days
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\StageInputTemplate> $inputTemplates
 * @property \App\Modules\Operations\Models\ProductionProcess $process
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int|null $input_templates_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\LoteProduccion> $lotes
 * @property-read int|null $lotes_count
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\StageTaskTemplate> $taskTemplates
 * @property-read int|null $task_templates_count
 * @method static \Database\Factories\EtapaProcesoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereEstimatedDurationDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereProductionProcessId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereRequiresQualityCheck($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EtapaProceso whereUpdatedAt($value)
 */
	class EtapaProceso extends \Eloquent {}
}

namespace App\Modules\Operations\Models{
/**
 * @property int $id
 * @property int $lote_produccion_id
 * @property int $inventory_item_id
 * @property int|null $stage_id
 * @property float $quantity
 * @property float $unit_cost
 * @property float $total_cost
 * @property string $status
 * @property \Carbon\Carbon|null $consumed_at
 * @property string|null $notes
 * @property-read LoteProduccion $lote
 * @property-read InventoryItem $product
 * @property-read EtapaProceso|null $stage
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereConsumedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereInventoryItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereLoteProduccionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereStageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereTotalCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereUnitCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteInsumo whereUpdatedAt($value)
 */
	class LoteInsumo extends \Eloquent {}
}

namespace App\Modules\Operations\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $production_process_id
 * @property int $stage_id
 * @property int|null $inventory_item_id
 * @property string $code
 * @property float|null $initial_quantity
 * @property float|null $current_quantity
 * @property float|null $final_quantity
 * @property \Illuminate\Support\Carbon|null $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $discarded_at
 * @property string|null $discard_reason
 * @property string|null $notes
 * @property int|null $assigned_to
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\LoteInsumo> $inputs
 * @property \App\Models\User|null $assignee
 * @property \App\Modules\Operations\Models\ProductionProcess $productionProcess
 * @property \App\Modules\Operations\Models\EtapaProceso $stage
 * @property \Illuminate\Support\Carbon|null $estimated_end_date
 * @property \Illuminate\Support\Carbon|null $actual_end_date
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $assignedUser
 * @property-read \App\Modules\Operations\Models\EtapaProceso|null $currentStage
 * @property-read int|null $inputs_count
 * @property-read \App\Modules\Inventory\Models\InventoryItem|null $product
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Tasks\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static \Database\Factories\LoteProduccionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereActualEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereCurrentQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereDiscardReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereDiscardedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereEstimatedEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereFinalQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereInitialQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereInventoryItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereProductionProcessId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereStageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoteProduccion withoutTrashed()
 */
	class LoteProduccion extends \Eloquent {}
}

namespace App\Modules\Operations\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property int|null $inventory_item_id
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\EtapaProceso> $etapas
 * @property \App\Modules\Inventory\Models\InventoryItem|null $outputProduct
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\LoteProduccion> $lotes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read int|null $etapas_count
 * @property-read int|null $lotes_count
 * @property-read \App\Models\Proyecto $proyecto
 * @method static \Database\Factories\ProductionProcessFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereInventoryItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductionProcess withoutTrashed()
 */
	class ProductionProcess extends \Eloquent {}
}

namespace App\Modules\Operations\Models{
/**
 * @property int $id
 * @property int $etapa_proceso_id
 * @property int $inventory_item_id
 * @property float $quantity
 * @property string|null $notes
 * @property \App\Modules\Inventory\Models\InventoryItem $item
 * @property \App\Modules\Operations\Models\EtapaProceso $etapaProceso
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereEtapaProcesoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereInventoryItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageInputTemplate whereUpdatedAt($value)
 */
	class StageInputTemplate extends \Eloquent {}
}

namespace App\Modules\Operations\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $etapa_proceso_id
 * @property string $name
 * @property string|null $description
 * @property string $priority
 * @property int $days_due_offset
 * @property bool $is_mandatory
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Modules\Operations\Models\EtapaProceso $etapaProceso
 * @property-read \App\Models\Proyecto $proyecto
 * @method static \Database\Factories\StageTaskTemplateFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereDaysDueOffset($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereEtapaProcesoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereIsMandatory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StageTaskTemplate whereUpdatedAt($value)
 */
	class StageTaskTemplate extends \Eloquent {}
}

namespace App\Modules\Tasks\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property string $priority
 * @property \Carbon\Carbon|null $due_date
 * @property \Carbon\Carbon|null $completed_at
 * @property int $pending Aggregate property
 * @property int $due_today Aggregate property
 * @property int|null $assigned_to
 * @property int|null $assignee_id
 * @property string|null $related_type
 * @property int|null $related_id
 * @property bool|null $is_financial
 * @property float|null $amount
 * @property int|null $category_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\User|null $assignee
 * @property-read \App\Modules\Finance\Models\Categoria|null $category
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \Illuminate\Database\Eloquent\Model|null $related
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\TaskFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereRelatedId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereRelatedType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 */
	class Task extends \Eloquent {}
}

