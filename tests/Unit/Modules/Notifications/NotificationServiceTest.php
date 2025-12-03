<?php

namespace Tests\Unit\Modules\Notifications;

use Tests\TestCase;
use App\Modules\Notifications\Services\NotificationService;
use App\Modules\Notifications\Models\NotificationPreference;
use App\Models\User;
use App\Models\Proyecto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Modules\Notifications\Notifications\TransactionCreatedNotification;

class NotificationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected NotificationService $service;
    protected User $user;
    protected Proyecto $proyecto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new NotificationService();
        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $this->user->id,
            'moneda_default' => 'USD',
            'modules' => ['notifications']
        ]);

        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);
    }

    public function test_it_sends_notification_when_preference_enabled()
    {
        Notification::fake();

        // Create a mock event
        /** @var \Mockery\MockInterface|\App\Core\Events\Contracts\ModuleEvent $event */
        $event = \Mockery::mock(\App\Core\Events\Contracts\ModuleEvent::class);
        $event->shouldReceive('getProjectId')->andReturn($this->proyecto->id);
        $event->shouldReceive('getPayload')->andReturnUsing(fn() => ['amount' => 100, 'type' => 'ingreso', 'description' => 'Test Transaction']);

        $this->service->notifyTransactionCreated($event);

        Notification::assertSentTo(
            [$this->user],
            TransactionCreatedNotification::class
        );
    }

    public function test_it_does_not_send_notification_when_preference_disabled()
    {
        Notification::fake();

        // Disable preference
        NotificationPreference::create([
            'user_id' => $this->user->id,
            'event_type' => 'transaction_created', // Note: Service uses 'transaction_created', not 'finance.transaction.created'
            'channel' => 'database',
            'enabled' => false
        ]);

        // Create a mock event
        /** @var \Mockery\MockInterface|\App\Core\Events\Contracts\ModuleEvent $event */
        $event = \Mockery::mock(\App\Core\Events\Contracts\ModuleEvent::class);
        $event->shouldReceive('getProjectId')->andReturn($this->proyecto->id);
        $payload = ['amount' => 100, 'type' => 'ingreso', 'description' => 'Test Transaction'];
        $event->shouldReceive('getPayload')->andReturnUsing(fn() => $payload);

        $this->service->notifyTransactionCreated($event);

        Notification::assertNotSentTo(
            [$this->user],
            TransactionCreatedNotification::class
        );
    }
}
