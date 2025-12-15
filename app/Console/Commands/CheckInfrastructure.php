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
            
            // Optional: send a raw test email? user might not want spam.
            // keeping it to transport check for now.
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

        if ($hasErrors) {
            $this->error('⚠️  Infrastructure check completed with errors.');
            return 1;
        }

        $this->info('✨ All systems go!');
        return 0;
    }
}
