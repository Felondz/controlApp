<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentationController extends Controller
{
    /**
     * Show the Documentation Hub.
     */
    public function index()
    {
        return Inertia::render('Docs/Hub');
    }

    /**
     * Show the User Guide.
     */
    /**
     * Show the User Guide.
     */
    public function user($page = 'user-guide')
    {
        // 1. Determine user locale
        $locale = app()->getLocale();
        
        // 2. Resolve Path (Default to English if Spanish missing)
        $path = base_path("docs/public/{$locale}/{$page}.md");
        if (!File::exists($path)) {
            $path = base_path("docs/public/en/{$page}.md");
        }

        // 3. 404 if still missing
        if (!File::exists($path)) {
            abort(404, 'Documentation page not found.');
        }

        // 4. Read and Parse
        $content = File::get($path);
        
        // Use Laravel's built-in Markdown helper (Github Flavored)
        $htmlContent = Str::markdown($content);

        return Inertia::render('Docs/UserGuide', [
            'content' => $htmlContent,
            'title' => 'Guía de Usuario' // You might parse this from the H1 in the markdown later
        ]);
    }

    /**
     * Show the Developer Documentation (File Explorer).
     */
    public function dev($path = null)
    {
        // Security: Prevent directory traversal
        if ($path && Str::contains($path, '..')) {
            abort(403, 'Invalid path');
        }

        $locale = app()->getLocale();
        $publicPath = "docs/public/{$locale}";

        // Default to English if locale folder missing
        if (!File::exists(base_path($publicPath))) {
            $publicPath = "docs/public/en";
        }

        // --- LANDING PAGE LOGIC ---
        // If no path is provided, show 'dev-overview.md' as the landing page
        if (!$path) {
            $overviewPath = base_path("{$publicPath}/dev-overview.md");
            
            // Fallback to English generic overview if localized one missing
            if (!File::exists($overviewPath)) {
                $overviewPath = base_path("docs/public/en/dev-overview.md");
            }

            if (File::exists($overviewPath)) {
                $content = File::get($overviewPath);
                $htmlContent = Str::markdown($content);

                return Inertia::render('Docs/DevDocs', [
                    'content' => $htmlContent,
                    'currentPath' => null, // Root
                    'isDir' => false, // Treat as file view
                    'fileName' => 'dev-overview.md',
                    'breadcrumbs' => [],
                    // Optional: You might want to pass list of other files for sidebar navigation
                    'items' => $this->getDirectoryItems(base_path($publicPath)) 
                ]);
            }
        }

        $basePath = base_path($publicPath);
        $fullPath = $path ? $basePath . '/' . $path : $basePath;

        if (!File::exists($fullPath)) {
            abort(404);
        }

        if (File::isDirectory($fullPath)) {
            // Check if there's a readme/overview in this directory to show as content
            $readmePath = $fullPath . '/README.md';
            $content = null;
            if (File::exists($readmePath)) {
                $content = Str::markdown(File::get($readmePath));
            }

            return Inertia::render('Docs/DevDocs', [
                'items' => $this->getDirectoryItems($fullPath, $path),
                'content' => $content, // Pass content if README exists
                'currentPath' => $path,
                'isDir' => true,
                'breadcrumbs' => $this->getBreadcrumbs($path),
            ]);
        } else {
            // It's a file. We need to fetch the siblings (items in the parent dir) for the sidebar.
            $parentPath = dirname($fullPath);
            // Calculate relative parent path for getDirectoryItems
            $relativeParentChange = $path ? dirname($path) : null;
            $relativeParent = ($relativeParentChange === '.') ? null : $relativeParentChange;

            $content = File::get($fullPath);
            $htmlContent = Str::markdown($content);

            return Inertia::render('Docs/DevDocs', [
                'items' => $this->getDirectoryItems($parentPath, $relativeParent), // Fetch siblings
                'content' => $htmlContent,
                'currentPath' => $path,
                'isDir' => false,
                'fileName' => basename($fullPath),
                'breadcrumbs' => $this->getBreadcrumbs($path),
            ]);
        }
    }

    private function getDirectoryItems($fullPath, $relativePath = null)
    {
        $files = [];
        $directories = [];

        foreach (File::directories($fullPath) as $dir) {
            $dirname = basename($dir);
            $directories[] = [
                'name' => $dirname,
                'type' => 'directory',
                'path' => $relativePath ? $relativePath . '/' . $dirname : $dirname,
            ];
        }

        foreach (File::files($fullPath) as $file) {
            $filename = $file->getFilename();
            // Skip the overview file from list if you want, or keep it
            if ($filename === 'dev-overview.md') continue;

            $files[] = [
                'name' => $filename,
                'type' => 'file',
                'path' => $relativePath ? $relativePath . '/' . $filename : $filename,
                'size' => $this->formatBytes($file->getSize()),
            ];
        }

        return array_merge($directories, $files);
    }

    private function getBreadcrumbs($path)
    {
        if (!$path) {
            return [];
        }

        $parts = explode('/', $path);
        $breadcrumbs = [];
        $current = '';

        foreach ($parts as $part) {
            $current = $current ? $current . '/' . $part : $part;
            $breadcrumbs[] = [
                'name' => $part,
                'path' => $current,
            ];
        }

        return $breadcrumbs;
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
