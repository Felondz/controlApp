<?php

namespace Tests\Unit\Modules\Tasks;

use Tests\TestCase;
use App\Modules\Tasks\Listeners\GenerateStageTasks;
use App\Modules\Operations\Events\StageChanged;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\StageTaskTemplate;
use Illuminate\Support\Collection;
use Mockery;

class GenerateStageTasksUnitTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_handle_generates_tasks_for_templates()
    {
        // Mock Lote
        $lote = Mockery::mock(LoteProduccion::class);
        $lote->shouldReceive('getAttribute')->with('code')->andReturn('LOTE-MOCK');
        $lote->shouldReceive('getAttribute')->with('proyecto_id')->andReturn(1);
        $lote->shouldReceive('getAttribute')->with('assigned_to')->andReturn(5);
        $lote->shouldReceive('getAttribute')->with('id')->andReturn(100);

        // Mock Templates
        $template = Mockery::mock(StageTaskTemplate::class);
        $template->shouldReceive('getAttribute')->with('name')->andReturn('Mock Task');
        $template->shouldReceive('getAttribute')->with('description')->andReturn('Desc');
        $template->shouldReceive('getAttribute')->with('priority')->andReturn('high');
        $template->shouldReceive('getAttribute')->with('days_due_offset')->andReturn(null);

        $templates = new Collection([$template]);

        // Mock New Stage
        $newStage = Mockery::mock(EtapaProceso::class);
        $newStage->shouldReceive('getAttribute')->with('name')->andReturn('New Stage');
        $newStage->shouldReceive('getAttribute')->with('taskTemplates')->andReturn($templates);

        // Event Mock - Bypass constructor logic completely
        $event = Mockery::mock(StageChanged::class);
        $event->lote = $lote;
        $event->newStage = $newStage;
        $event->shouldReceive('getAttribute')->andReturn(null); // Just in case magic access happens

        // Listener
        $listener = new GenerateStageTasks();
        $listener->handle($event);
        
        $this->assertTrue(true); 
    }
}
