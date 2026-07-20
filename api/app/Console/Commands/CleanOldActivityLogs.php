<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use Illuminate\Console\Command;

class CleanOldActivityLogs extends Command
{
    protected $signature = 'audit:clean {days=90 : Days to keep}';
    protected $description = 'Delete old activity logs';

    public function handle()
    {
        $days = $this->argument('days');
        $date = now()->subDays($days);
        
        $deleted = AuditLog::where('created_at', '<', $date)->delete();
        
        $this->info("Deleted {$deleted} log records older than {$days} days.");
        
        return Command::SUCCESS;
    }
}