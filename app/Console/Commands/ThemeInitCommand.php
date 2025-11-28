<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class ThemeInitCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'theme:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize the theme system (run migrations, set default themes for users)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🎨 Initializing Theme System...');
        $this->newLine();

        // Step 1: Run migrations
        $this->info('1️⃣  Running migrations...');
        try {
            Artisan::call('migrate', ['--force' => true]);
            $this->info('   ✅ Migrations completed');
        } catch (\Exception $e) {
            $this->warn('   ⚠️  Migration might have already run: ' . $e->getMessage());
        }
        $this->newLine();

        // Step 2: Check if global_theme column exists
        if (!Schema::hasColumn('users', 'global_theme')) {
            $this->error('❌ global_theme column does not exist in users table');
            $this->info('   Please ensure the migration has been created and run successfully.');
            return 1;
        }

        // Step 3: Update existing users
        $this->info('2️⃣  Setting default theme for existing users...');
        
        $usersWithoutTheme = User::whereNull('global_theme')->count();
        
        if ($usersWithoutTheme > 0) {
            User::whereNull('global_theme')->update(['global_theme' => 'purple-modern']);
            $this->info("   ✅ Updated {$usersWithoutTheme} user(s) with default theme 'purple-modern'");
        } else {
            $this->info('   ℹ️  All users already have a theme assigned');
        }
        $this->newLine();

        // Step 4: Clear caches
        $this->info('3️⃣  Clearing caches...');
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        $this->info('   ✅ Caches cleared');
        $this->newLine();

        // Step 5: Summary
        $this->info('✨ Theme System Initialized Successfully!');
        $this->newLine();
        
        $totalUsers = User::count();
        $themeDistribution = User::select('global_theme', DB::raw('count(*) as count'))
            ->groupBy('global_theme')
            ->get();
        
        $this->info('📊 Theme Distribution:');
        foreach ($themeDistribution as $theme) {
            $themeName = $theme->global_theme ?? 'none';
            $percentage = round(($theme->count / $totalUsers) * 100, 1);
            $this->line("   • {$themeName}: {$theme->count} users ({$percentage}%)");
        }
        
        $this->newLine();
        $this->info('Available themes: purple-modern, ocean-blue, forest-green');
        $this->info('Users can change their theme at: /settings/theme');

        return 0;
    }
}
