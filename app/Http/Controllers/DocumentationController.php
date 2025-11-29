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
    public function user()
    {
        return Inertia::render('Docs/UserGuide');
    }

    /**
     * Show the Developer Documentation (File Explorer).
     */
    public function dev($path = null)
    {
        // Security: Prevent directory traversal
        if (Str::contains($path, '..')) {
            abort(403, 'Invalid path');
        }

        // Serve only PUBLIC documentation based on locale
        $locale = app()->getLocale();
        $publicPath = "docs/public/{$locale}";

        // Fallback to English if locale folder doesn't exist
        if (!File::exists(base_path($publicPath))) {
            $publicPath = "docs/public/en";
        }

        $basePath = base_path($publicPath);
        $fullPath = $path ? $basePath . '/' . $path : $basePath;

        if (!File::exists($fullPath)) {
            abort(404);
        }

        if (File::isDirectory($fullPath)) {
            $files = [];
            $directories = [];

            foreach (File::directories($fullPath) as $dir) {
                $dirname = basename($dir);
                $directories[] = [
                    'name' => $dirname,
                    'type' => 'directory',
                    'path' => $path ? $path . '/' . $dirname : $dirname,
                ];
            }

            foreach (File::files($fullPath) as $file) {
                $filename = $file->getFilename();
                $files[] = [
                    'name' => $filename,
                    'type' => 'file',
                    'path' => $path ? $path . '/' . $filename : $filename,
                    'size' => $this->formatBytes($file->getSize()),
                ];
            }

            // Merge directories first, then files
            $items = array_merge($directories, $files);

            return Inertia::render('Docs/DevDocs', [
                'items' => $items,
                'currentPath' => $path,
                'isDir' => true,
                'breadcrumbs' => $this->getBreadcrumbs($path),
            ]);
        } else {
            // It's a file
            $content = File::get($fullPath);
            $htmlContent = Str::markdown($content);

            return Inertia::render('Docs/DevDocs', [
                'content' => $htmlContent,
                'currentPath' => $path,
                'isDir' => false,
                'fileName' => basename($fullPath),
                'breadcrumbs' => $this->getBreadcrumbs($path),
            ]);
        }
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
