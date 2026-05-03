@extends('errors.layout')

@section('title', __('error_pages.503.title'))
@section('code', '503')
@section('message', __('error_pages.503.message'))
@section('description', __('error_pages.503.description'))

@section('image')
    <div class="mx-auto w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 relative">
        <svg class="w-12 h-12 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <div class="absolute -bottom-1 -right-1">
            <span class="relative flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
            </span>
        </div>
    </div>
@endsection

@section('extra_actions')
    <a href="mailto:support@controlapp.com"
        class="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ml-3">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {{ __('es.json.Contacto') ?? 'Soporte' }}
    </a>
@endsection

@section('scripts')
    <div class="fixed bottom-8 left-0 right-0 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-500 font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm inline-block px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            {{ __('error_pages.503.auto_refresh') }} 
            <span id="countdown" class="font-bold text-indigo-500">30</span>s
        </p>
    </div>

    <script>
        let seconds = 30;
        const el = document.getElementById('countdown');

        setInterval(() => {
            seconds--;
            if (el) el.innerText = seconds;

            if (seconds <= 0) {
                window.location.reload();
            }
        }, 1000);
    </script>
@endsection