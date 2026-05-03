<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - {{ config('app.name') }}</title>
    @vite(['resources/css/app.css'])
    <style>
        @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
        }
    </style>
</head>

<body
    class="antialiased bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex items-center justify-center p-4">
    <div
        class="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden p-10 text-center relative border border-gray-100 dark:border-gray-700">
        <!-- Background Pattern/Decoration -->
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_auto] animate-gradient-x"></div>

        <div class="mb-6">
            @yield('image')
        </div>

        <h1 class="text-6xl font-black text-gray-200 dark:text-gray-700 mb-4 tracking-tighter select-none">
            @yield('code')
        </h1>

        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            @yield('message')
        </h2>

        <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            @yield('description')
        </p>

        <a href="/"
            class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {{ __('error_pages.btn_home') }}
        </a>

        @yield('extra_actions')
    </div>
    @yield('scripts')
</body>

</html>