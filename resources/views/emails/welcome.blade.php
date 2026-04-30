@extends('emails.layout', ['header' => __('Welcome to ControlApp!')])

@section('content')
    <p>@lang('Hello') <span class="greeting">{{ $name }}</span>,</p>

    <p>@lang('We are excited to have you with us. Your account has been successfully created using your Google account.')</p>

    <p>@lang('With ControlApp, you can manage your projects, finances, and tasks all in one place. Start exploring your dashboard now.')</p>

    <div class="button-wrapper">
        <a href="{{ route('dashboard') }}" class="cta-button">
            @lang('Go to Dashboard')
        </a>
    </div>

    <div class="highlight-box">
        <p><strong>@lang('Tip:')</strong> @lang('You can customize your profile and security settings at any time from your account settings.')</p>
    </div>

    <p>@lang('If you have any questions, feel free to reply to this email or visit our help center.')</p>

    <p>@lang('Best regards,')<br>@lang('The ControlApp Team')</p>
@endsection
