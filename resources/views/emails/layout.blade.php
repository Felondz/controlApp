<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'ControlApp' }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f3f4f6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .wrapper {
            padding: 2rem 1rem;
            background-color: #f3f4f6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 2.5rem 1.5rem;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
        }

        .logo svg {
            width: 2rem;
            height: 2rem;
            margin-right: 0.5rem;
        }

        .logo-text {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(to right, #ffffff, #e0e7ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: -0.025em;
        }

        .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0.5rem 0 0;
            color: white;
        }

        .header p {
            font-size: 14px;
            opacity: 0.95;
            margin: 0;
        }

        /* Content */
        .content {
            padding: 40px 30px;
        }

        .content h2 {
            color: #333;
            font-size: 22px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            line-height: 1.8;
        }

        .greeting {
            color: #667eea;
        }

        /* Buttons */
        .button-wrapper {
            margin: 2rem 0;
            text-align: center;
        }

        .cta-button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 500;
            font-size: 0.9375rem;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            border: none;
            cursor: pointer;
        }

        .cta-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1);
        }

        /* Highlight Box */
        .highlight-box {
            background-color: #f5f3ff;
            border: 1px solid #e9d5ff;
            border-left: 4px solid #8b5cf6;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 0 0.375rem 0.375rem 0;
            font-size: 0.9375rem;
            color: #4c1d95;
        }

        .highlight-box p {
            margin: 0;
            color: inherit;
        }

        /* Alert Box */
        .alert-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-left: 4px solid #ef4444;
            color: #991b1b;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 0 0.375rem 0.375rem 0;
            font-size: 0.9375rem;
        }

        .alert-box p {
            margin: 0;
            color: inherit;
        }

        /* Link Fallback */
        .link-fallback {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            word-break: break-all;
            color: #4b5563;
        }

        .link-fallback p {
            margin: 0 0 0.5rem 0;
            color: inherit;
        }

        .link-fallback a {
            color: #4f46e5;
            text-decoration: none;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.875rem;
            word-break: break-all;
        }

        .link-fallback a:hover {
            text-decoration: underline;
        }

        /* Greeting */
        .greeting {
            color: #4f46e5;
            font-weight: 600;
        }

        /* Footer */
        .footer {
            background-color: #f9fafb;
            padding: 1.5rem;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .footer a {
            color: #4f46e5;
            text-decoration: none;
            font-weight: 500;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 1.5rem 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
            .content, .header {
                padding: 1.5rem 1rem;
            }
            
            .cta-button {
                display: block;
                width: 100%;
                padding: 0.75rem 1rem;
            }

            h2 {
                font-size: 1.25rem;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="text-white">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span class="logo-text">ControlApp</span>
                </div>
                @if(isset($header))
                    <h1>{{ $header }}</h1>
                @endif
            </div>

            <div class="content">
                @yield('content')
            </div>

            <div class="divider"></div>

            <div class="footer">
                <p>  {{ date('Y') }} ControlApp. @lang('Todos los derechos reservados.')</p>
                <p>
                    <a href="{{ config('app.url') }}/privacy">@lang('Política de Privacidad')</a> · 
                    <a href="{{ config('app.url') }}/terms">@lang('Términos de Servicio')</a> ·
                    <a href="{{ config('app.url') }}/contact">@lang('Contacto')</a>
                </p>
            </div>
        </div>
    </div>
</body>