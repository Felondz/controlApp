<?php declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bug_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('category'); // translation, functionality, unclear_info, ui_visual, performance, other
            $table->text('description');
            $table->string('page_url');
            $table->string('screenshot_path')->nullable();
            $table->string('severity')->default('medium'); // low, medium, high
            $table->string('status')->default('open'); // open, in_progress, resolved, dismissed
            $table->text('developer_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bug_reports');
    }
};
