<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Transport\TransportInterface;

class CheckInfrastructure extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'infra:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks connection to critical infrastructure services (DB, Redis, Mail)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting infrastructure check...');
        $hasErrors = false;

        // 1. DATABASE CHECK
        try {
            $this->comment('Checking Database...');
            $pdo = DB::connection()->getPdo();
            $this->info("✅ Database Connected: " . DB::connection()->getDatabaseName());
        } catch (\Exception $e) {
            $this->error("❌ Database Error: " . $e->getMessage());
            $hasErrors = true;
        }

        // 2. REDIS CHECK
        try {
            $this->comment('Checking Redis...');
            $redis = Redis::connection();
            $response = $redis->ping();
            $this->info("✅ Redis Connected: " . $response);
        } catch (\Exception $e) {
            $this->error("❌ Redis Error: " . $e->getMessage());
            $hasErrors = true;
        }

        // 3. MAIL CHECK
        try {
            $this->comment('Checking Mail Transport...');
            $mailer = Mail::getSymfonyTransport();
            $this->info("✅ Mail Transport Ready: " . (string) $mailer);
        } catch (\Exception $e) {
            $this->error("❌ Mail Error: " . $e->getMessage());
            $hasErrors = true;
        }

        // 4. MEILISEARCH CHECK
        try {
            $this->comment('Checking Meilisearch...');
            $host = config('scout.meilisearch.host') ?? 'http://localhost:7700';
            $key = config('scout.meilisearch.key');
            
            // Parsed host
            if (!str_starts_with($host, 'http')) {
                 $host = 'http://' . $host;
            }

            $ch = curl_init("$host/health");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 2);
            if ($key) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $key"]);
            }
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                 $this->info("✅ Meilisearch Connected: $host");
            } else {
                 throw new \Exception("HTTP $httpCode - $error");
            }

        } catch (\Exception $e) {
            $this->error("❌ Meilisearch Error: " . $e->getMessage());
            $hasErrors = true;
        }

        // 5. SIGNED URL & TRANSLATION CHECK
        try {
             $this->comment('Checking Signed URLs & Translations...');
             
             // Check Translation
             $testKey = 'error_pages.500.message';
             $trans = __($testKey);
             if ($trans === $testKey) {
                 $this->warn("⚠️  Translation key '$testKey' failed to resolve. Current locale: " . app()->getLocale());
                 $this->line("   - Expected path: resources/lang/" . app()->getLocale() . ".json");
                 $this->line("   - Actual path check: " . (file_exists(resource_path("lang/".app()->getLocale()."/".app()->getLocale().".json")) ? "Found inside subfolder (Wrong)" : "Not found in subfolder"));
             } else {
                 $this->info("✅ Translation Works: '$trans'");
             }

             // Check Signed URL
             $url = \Illuminate\Support\Facades\URL::signedRoute('login', ['test' => 1]);
             $request = \Illuminate\Http\Request::create($url);
             if (\Illuminate\Support\Facades\URL::hasValidSignature($request)) {
                  $this->info("✅ Signed URL Validates correctly. App URL: " . config('app.url'));
             } else {
                  $this->error("❌ Signed URL Validation FAILED. App URL: " . config('app.url'));
                  $this->line("   - Generated: $url");
             }

        } catch (\Exception $e) {
             $this->error("❌ Logic Check Error: " . $e->getMessage());
        }

        if ($hasErrors) {
            $this->error('⚠️  Infrastructure check completed with errors.');
            return 1;
        }

        $this->info('✨ All systems go!');
        return 0;
    }
}
