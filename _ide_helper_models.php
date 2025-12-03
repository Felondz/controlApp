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
 * @property string $nombre
 * @property string $tipo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaccion> $transacciones
 * @property-read int|null $transacciones_count
 * @method static \Database\Factories\CategoriaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Categoria whereDeletedAt($value)
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

namespace App\Models{
/**
 * @property int $id
 * @property string $nombre
 * @property string|null $banco
 * @property string|null $descripcion
 * @property string $color
 * @property string $icono
 * @property string $tipo
 * @property string $moneda
 * @property string $estado
 * @property int $saldo_inicial
 * @property int $saldo_actual
 * @property numeric|null $tasa_interes_anual
 * @property \Illuminate\Support\Carbon|null $fecha_vencimiento
 * @property int|null $dia_corte
 * @property int|null $dia_pago
 * @property int $limite_credito
 * @property numeric|null $tasa_interes
 * @property \Illuminate\Support\Carbon|null $fecha_interes
 * @property bool $capitalizable
 * @property string|null $periodo_capitalizacion
 * @property int $balance
 * @property string $propietario_type
 * @property int $propietario_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $propietario
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Proyecto> $proyectosAsociados
 * @property-read int|null $proyectos_asociados_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaccion> $transacciones
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDiaCorte($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereDiaPago($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereEstado($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereFechaInteres($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereFechaVencimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereIcono($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereLimiteCredito($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereMoneda($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePeriodoCapitalizacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePropietarioId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta wherePropietarioType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereSaldoActual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereSaldoInicial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereTasaInteres($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereTasaInteresAnual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cuenta whereUpdatedAt($value)
 */
	class Cuenta extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int|null $user_id
 * @property string $email
 * @property string $rol
 * @property string $token
 * @property string|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $invitador
 * @property-read \App\Models\Proyecto $proyecto
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
 * @property int $proyecto_id
 * @property int $user_id
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property string $type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $recipient_id
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \App\Models\User|null $recipient
 * @property-read \App\Models\User $user
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
 * @property array<array-key, mixed>|null $modules
 * @property array<array-key, mixed>|null $settings
 * @property string|null $color
 * @property string|null $icon
 * @property string|null $image_path
 * @property string|null $theme
 * @property string|null $typography
 * @property string $moneda_default
 * @property bool $es_personal
 * @property bool $visible_en_listado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Categoria> $categorias
 * @property-read int|null $categorias_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Cuenta> $cuentas
 * @property-read int|null $cuentas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Cuenta> $cuentasAsociadas
 * @property-read int|null $cuentas_asociadas_count
 * @property-read bool $has_messaging_feature
 * @property-read string|null $image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Invitacion> $invitaciones
 * @property-read int|null $invitaciones_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messages
 * @property-read int|null $messages_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $miembros
 * @property-read int|null $miembros_count
 * @property-read \App\Models\User|null $propietarioPersonal
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaccion> $transacciones
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
 * @property int $project_id
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property string $priority
 * @property \Illuminate\Support\Carbon|null $due_date
 * @property int|null $assigned_to
 * @property bool $is_financial
 * @property numeric|null $amount
 * @property int|null $category_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $assignee
 * @property-read \App\Models\Categoria|null $category
 * @property-read \App\Models\Proyecto $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereIsFinancial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 */
	class Task extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $cuenta_id
 * @property int $categoria_id
 * @property int $user_id
 * @property float $monto
 * @property string $descripcion
 * @property string $fecha
 * @property string|null $notas
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 * @property-read \App\Models\Categoria $categoria
 * @property-read \App\Models\Cuenta $cuenta
 * @property-read \App\Models\Proyecto $proyecto
 * @property-read \App\Models\User $usuario
 * @method static \Database\Factories\TransaccionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCategoriaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereCuentaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereFecha($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereMonto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereNotas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereProyectoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaccion whereUserId($value)
 */
	class Transaccion extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string $locale
 * @property bool $is_super_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 * @method static find(int $id)
 * @property string $global_theme
 * @property array<array-key, mixed>|null $enabled_tools
 * @property string|null $profile_photo_path
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Cuenta> $cuentas
 * @property-read int|null $cuentas_count
 * @property-read bool $is_online
 * @property-read string $profile_photo_url
 * @property-read int $unread_messages_count
 * @property-read array $unread_projects
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Proyecto> $proyectos
 * @property-read int|null $proyectos_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Proyecto> $proyectosPersonales
 * @property-read int|null $proyectos_personales_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

namespace App\Modules\Analytics\Models{
/**
 * AnalyticsMetric Model
 * 
 * Stores aggregated metrics from module events.
 *
 * @property-read \App\Models\Proyecto|null $proyecto
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AnalyticsMetric inPeriod($start, $end)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AnalyticsMetric newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AnalyticsMetric newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AnalyticsMetric ofType(string $type)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AnalyticsMetric query()
 */
	class AnalyticsMetric extends \Eloquent {}
}

namespace App\Modules\Notifications\Models{
/**
 * NotificationPreference Model
 * 
 * Stores user preferences for notification channels and event types.
 *
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference forChannel(string $channel)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference forEvent(string $eventType)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference forUser(int $userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference query()
 */
	class NotificationPreference extends \Eloquent {}
}

