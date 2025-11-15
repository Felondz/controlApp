<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'ControlApp' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        .wrapper {
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #667eea;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
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
            font-weight: 600;
        }

        /* Highlight Box */
        .highlight-box {
            background-color: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }

        .highlight-box p {
            margin-bottom: 10px;
            font-size: 15px;
        }

        .highlight-box p:last-child {
            margin-bottom: 0;
        }

        /* Action Button */
        .button-wrapper {
            text-align: center;
            margin: 35px 0;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }

        /* Fallback Link */
        .link-fallback {
            margin: 25px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 13px;
            word-break: break-all;
        }

        .link-fallback p {
            margin-bottom: 10px;
            color: #666;
            font-size: 13px;
        }

        .link-fallback a {
            color: #667eea;
            text-decoration: none;
        }

        /* Alert Box */
        .alert-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            color: #856404;
            font-size: 14px;
        }

        .alert-box strong {
            color: #856404;
        }

        /* Info Box */
        .info-box {
            background-color: #e8f4f8;
            border-left: 4px solid #0288d1;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #01579b;
        }

        /* Divider */
        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 30px 0;
        }

        /* Footer */
        .footer {
            background-color: #f8f8f8;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            font-size: 13px;
            color: #666;
        }

        .footer p {
            margin-bottom: 8px;
            font-size: 13px;
        }

        .footer p:last-child {
            margin-bottom: 0;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        /* Utility Classes */
        .text-center {
            text-align: center;
        }

        .text-muted {
            color: #999;
            font-size: 14px;
        }

        .mt-20 {
            margin-top: 20px;
        }

        .mb-20 {
            margin-bottom: 20px;
        }

        strong {
            color: #667eea;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>{{ $headerTitle ?? 'ControlApp' }}</h1>
                @if(isset($headerSubtitle))
                <p>{{ $headerSubtitle }}</p>
                @endif
            </div>

            <!-- Content -->
            <div class="content">
                @yield('content')
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>© {{ date('Y') }} ControlApp. Todos los derechos reservados.</p>
                <p style="font-size: 12px; color: #999;">Este es un correo automático, por favor no respondas directamente.</p>
            </div>
        </div>
    </div>
</body>

</html>