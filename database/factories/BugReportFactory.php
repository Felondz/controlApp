<?php declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use App\Modules\BugReporter\Models\BugReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BugReport>
 */
class BugReportFactory extends Factory
{
    protected $model = BugReport::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category' => $this->faker->randomElement(BugReport::CATEGORIES),
            'description' => $this->faker->paragraph(),
            'page_url' => $this->faker->url(),
            'screenshot_path' => null,
            'severity' => $this->faker->randomElement(BugReport::SEVERITIES),
            'status' => 'open',
            'developer_notes' => null,
            'resolved_at' => null,
        ];
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => 'resolved',
            'resolved_at' => now(),
            'developer_notes' => $this->faker->sentence(),
        ]);
    }
}
