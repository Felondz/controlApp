<?php declare(strict_types=1);

namespace Tests\Feature\Modules\BugReporter;

use App\Models\User;
use App\Modules\BugReporter\Models\BugReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BugReportTest extends TestCase
{
    use RefreshDatabase;

    private User $tester;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Enable testing in PTR routes
        app()->detectEnvironment(fn () => 'staging');

        // Disable CSRF for this test class because PTR routes use 'web' group
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);

        $this->tester = User::factory()->create(['is_super_admin' => false]);
        $this->admin = User::factory()->create(['is_super_admin' => true]);
    }

    // ─── Submission ──────────────────────────────────────────

    public function test_tester_can_submit_bug_report(): void
    {
        $response = $this->actingAs($this->tester)->postJson('/ptr/bug-reports', [
            'category' => 'translation',
            'description' => 'The button says "Enviar" but should say "Guardar".',
            'page_url' => 'https://ptr.example.com/dashboard',
            'severity' => 'medium',
            'platform' => 'web',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('bug_reports', [
            'user_id' => $this->tester->id,
            'category' => 'translation',
            'status' => 'open',
            'severity' => 'medium',
            'platform' => 'web',
        ]);
    }

    public function test_submission_requires_category_and_description(): void
    {
        $response = $this->actingAs($this->tester)->postJson('/ptr/bug-reports', [
            'page_url' => 'https://ptr.example.com/dashboard',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category', 'description']);
    }

    public function test_submission_rejects_invalid_category(): void
    {
        $response = $this->actingAs($this->tester)->postJson('/ptr/bug-reports', [
            'category' => 'invalid_category',
            'description' => 'Some text',
            'page_url' => 'https://ptr.example.com/dashboard',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category']);
    }

    public function test_screenshot_upload_stores_file(): void
    {
        Storage::fake('local');

        $response = $this->actingAs($this->tester)->postJson('/ptr/bug-reports', [
            'category' => 'ui_visual',
            'description' => 'Button is misaligned on mobile.',
            'page_url' => 'https://ptr.example.com/settings',
            'severity' => 'high',
            'platform' => 'web',
            'screenshot' => UploadedFile::fake()->image('bug-screenshot.png', 640, 480),
        ]);

        $response->assertStatus(201);

        $bugReport = BugReport::first();
        $this->assertNotNull($bugReport);
        $this->assertNotNull($bugReport->screenshot_path);
        Storage::disk('local')->assertExists($bugReport->screenshot_path);
    }

    // ─── Dashboard Access ────────────────────────────────────

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $response = $this->actingAs($this->tester)->get('/ptr/bug-reports');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_dashboard(): void
    {
        BugReport::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get('/ptr/bug-reports');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Ptr/BugReportsDashboard')
            ->has('reports.data', 3)
            ->has('stats')
        );
    }

    // ─── Status Updates ──────────────────────────────────────

    public function test_admin_can_update_bug_status(): void
    {
        $report = BugReport::factory()->create(['status' => 'open']);

        $response = $this->actingAs($this->admin)->patchJson("/ptr/bug-reports/{$report->uuid}", [
            'status' => 'in_progress',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('bug_reports', [
            'id' => $report->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_resolved_at_is_set_when_resolved(): void
    {
        $report = BugReport::factory()->create(['status' => 'open']);

        $this->actingAs($this->admin)->patchJson("/ptr/bug-reports/{$report->uuid}", [
            'status' => 'resolved',
            'developer_notes' => 'Fixed the CSS.',
        ]);

        $report->refresh();
        $this->assertEquals('resolved', $report->status);
        $this->assertNotNull($report->resolved_at);
        $this->assertEquals('Fixed the CSS.', $report->developer_notes);
    }

    public function test_resolved_at_clears_when_reopened(): void
    {
        $report = BugReport::factory()->resolved()->create();
        $this->assertNotNull($report->resolved_at);

        $this->actingAs($this->admin)->patchJson("/ptr/bug-reports/{$report->uuid}", [
            'status' => 'open',
        ]);

        $report->refresh();
        $this->assertEquals('open', $report->status);
        $this->assertNull($report->resolved_at);
    }

    public function test_non_admin_cannot_update_status(): void
    {
        $report = BugReport::factory()->create();

        $response = $this->actingAs($this->tester)->patchJson("/ptr/bug-reports/{$report->uuid}", [
            'status' => 'resolved',
        ]);

        $response->assertStatus(403);
    }

    // ─── Stats ───────────────────────────────────────────────

    public function test_stats_returns_open_bug_count(): void
    {
        BugReport::factory()->count(5)->create(['status' => 'open']);
        BugReport::factory()->count(2)->create(['status' => 'resolved']);

        $response = $this->actingAs($this->tester)->getJson('/ptr/bug-reports/stats');

        $response->assertOk();
        $response->assertJson(['open_count' => 5]);
    }

    // ─── Security & Assets ───────────────────────────────────

    public function test_admin_can_download_screenshot_from_private_disk(): void
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->image('test.png');
        $path = $file->store('bug-reports', 'local');

        $report = BugReport::factory()->create([
            'screenshot_path' => $path,
        ]);

        $response = $this->actingAs($this->admin)->get("/ptr/bug-reports/{$report->uuid}/screenshot");

        $response->assertOk();
        $response->assertHeader('Content-Type', 'image/png');
        $response->assertHeader('Cache-Control', 'max-age=3600, private');
    }

    public function test_bug_description_and_url_are_encrypted_in_database(): void
    {
        $sensitiveText = 'Secret sensitive information about the bug.';
        $sensitiveUrl = 'https://ptr.example.com/settings?token=secret123';
        
        $report = BugReport::factory()->create([
            'description' => $sensitiveText,
            'page_url' => $sensitiveUrl,
        ]);

        // Access via Eloquent should be decrypted
        $this->assertEquals($sensitiveText, $report->description);
        $this->assertEquals($sensitiveUrl, $report->page_url);

        // Access via DB facade should be encrypted (raw value)
        $rawReport = \Illuminate\Support\Facades\DB::table('bug_reports')->where('id', $report->id)->first();
        
        $this->assertNotEquals($sensitiveText, $rawReport->description);
        $this->assertStringContainsString('eyJpdiI6', $rawReport->description);

        $this->assertNotEquals($sensitiveUrl, $rawReport->page_url);
        $this->assertStringContainsString('eyJpdiI6', $rawReport->page_url);
    }

    // ─── Environment Gating ──────────────────────────────────

    public function test_routes_return_404_in_non_staging_environment(): void
    {
        // Switch to production env
        app()->detectEnvironment(fn () => 'production');

        $response = $this->actingAs($this->tester)->postJson('/ptr/bug-reports', [
            'category' => 'translation',
            'description' => 'test',
            'page_url' => 'https://example.com',
            'severity' => 'low',
            'platform' => 'web',
        ]);

        $response->assertStatus(404);
    }
}
