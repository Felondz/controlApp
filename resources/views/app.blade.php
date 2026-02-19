<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'ControlApp') }}</title>
    <meta name="description" content="Gestión inteligente de proyectos y finanzas personales.">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ config('app.url') }}">
    <meta property="og:title" content="{{ config('app.name', 'ControlApp') }}">
    <meta property="og:description"
        content="Gestión inteligente de proyectos y finanzas personales. Organiza tu equipo y tu dinero en un solo lugar.">
    <meta property="og:image" content="{{ asset('favicon.ico') }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary">
    <meta property="twitter:url" content="{{ config('app.url') }}">
    <meta property="twitter:title" content="{{ config('app.name', 'ControlApp') }}">
    <meta property="twitter:description" content="Gestión inteligente de proyectos y finanzas personales.">
    <meta property="twitter:image" content="{{ asset('favicon.ico') }}">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link
        href="https://fonts.bunny.net/css?family=lato:400,700|merriweather:400,700|montserrat:400,700|nunito:400,700|open-sans:400,700|playfair-display:400,700|raleway:400,700|roboto:400,700&display=swap"
        rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>