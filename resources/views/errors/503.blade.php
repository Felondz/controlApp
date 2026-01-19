<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Under Maintenance - controlApp</title>
    <style>
        :root {
            --primary-50: #eef2ff;
            --primary-100: #e0e7ff;
            --primary-500: #6366f1;
            --primary-600: #4f46e5;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-500: #6b7280;
            --gray-900: #111827;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --gray-50: #111827;
                /* Dark bg */
                --gray-100: #1f2937;
                --gray-500: #9ca3af;
                --gray-900: #f9fafb;
                /* Light text */
            }
        }

        body {
            background-color: var(--gray-50);
            color: var(--gray-900);
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            text-align: center;
        }

        .container {
            max-width: 32rem;
            padding: 2rem;
        }

        .icon-wrapper {
            background-color: var(--primary-100);
            color: var(--primary-600);
            width: 4rem;
            height: 4rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }

        .icon-wrapper svg {
            width: 2rem;
            height: 2rem;
        }

        h1 {
            font-size: 1.875rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }

        p {
            color: var(--gray-500);
            font-size: 1.125rem;
            line-height: 1.75rem;
            margin-bottom: 2rem;
        }

        .loader {
            width: 100%;
            height: 4px;
            background-color: var(--primary-100);
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
        }

        .loader::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 30%;
            background-color: var(--primary-500);
            border-radius: 9999px;
            animation: loading 1.5s infinite ease-in-out;
        }

        @keyframes loading {
            0% {
                left: -30%;
            }

            100% {
                left: 100%;
            }
        }

        .status-text {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: var(--gray-500);
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="icon-wrapper">
            <!-- ServerStackIcon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
        </div>
        <h1>@lang('error_pages.503.title')</h1>
        <p>@lang('error_pages.503.message')</p>

        <div class="loader"></div>

        <p class="status-text">
            @lang('error_pages.503.auto_refresh') <br>
            <span id="countdown">30</span>s
        </p>
    </div>

    <script>
        // Auto-refresh script
        let seconds = 30;
        const el = document.getElementById('countdown');

        setInterval(() => {
            seconds--;
            el.innerText = seconds;

            if (seconds <= 0) {
                window.location.reload();
            }
        }, 1000);
    </script>
</body>

</html>