<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateGraphQLDocs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'docs:generate-graphql';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating flat GraphQL schema...');
        
        // Print schema to a temporary file that MagiDoc will read
        \Illuminate\Support\Facades\Artisan::call('lighthouse:print-schema', []);
        $schema = \Illuminate\Support\Facades\Artisan::output();
        
        file_put_contents(base_path('graphql/schema.flat.graphql'), $schema);

        $this->info('Running MagiDoc...');
        
        $process = new \Symfony\Component\Process\Process(['npx', 'magidoc', 'generate']);
        $process->setTimeout(300);
        $process->run(function ($type, $buffer) {
            $this->output->write($buffer);
        });

        if (!$process->isSuccessful()) {
            $this->error('MagiDoc failed.');
            return 1;
        }

        $this->info('GraphQL documentation generated successfully at public/docs/graphql');
        return 0;
    }
}
