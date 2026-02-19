<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\VerificacionEmailMail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerificacionEmailNotification extends VerifyEmail implements ShouldQueue
{
    use Queueable;
    /**
     * Get the verification URL for the given notifiable.
     * 
     * Override to generate simple hash URLs without signature parameter.
     * This prevents 403 "invalid signature" errors in production.
     */
    protected function verificationUrl($notifiable)
    {
        return \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            \Illuminate\Support\Carbon::now()->addMinutes(\Illuminate\Support\Facades\Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // 1. Web URL (Standard)
        $verificationUrl = $this->verificationUrl($notifiable);

        // 2. Mobile URL (Deep Link)
        // Scheme: controlapp://(auth)/verify-email?id=...&hash=...&expires=...&signature=...
        
        // Generate components
        $id = $notifiable->getKey();
        $hash = sha1($notifiable->getEmailForVerification());
        
        // We reuse the expiration from config, same as verificationUrl method
        $expiration = \Illuminate\Support\Carbon::now()->addMinutes(\Illuminate\Support\Facades\Config::get('auth.verification.expire', 60));
        
        // To get valid signature for the MOBILE route, we actually need to sign the MOBILE URL or similar?
        // NO, the signature validates the *URL parameters*.
        // If the API receives the signature, it must validate against value.
        // The API verify endpoint `api.ts` calls `api.get('/email/verify/...')`.
        // So the mobile app acts as a proxy.
        // The mobile app receives query params and sends them to the API.
        // The API expects the standard Laravel signature which validates the *full URL* (scheme+host+path).
        // If we change the scheme/host in Mobile, the signature breaks!
        {
             // CRITICAL: The API endpoint verification checks the signature against the API URL.
             // We need to generate a signed URL *for the API endpoint*.
             // $verificationUrl is usually for the *Frontend* (Web) Route if using Inertia/SPA, or Backend Route.
             // Here it routes to `verification.verify`.
             
             // Strategies:
             // A. Generate a signed URL for the API route.
             // B. Extract the 'expires' and 'signature' from the existing $verificationUrl (which points to web) 
             //    and hope the API verifies it? NO, API is usually a different route name or path (`api/email/verify...` vs `email/verify...`).
             
             // Quick Fix: Let's assume the API uses the same key and logic.
             // We generate a signed URL for the API endpoint directly.
             // Route name: `verification.verify` is usually WEB.
             // Does `api.php` have a verification route?
             // RegisteredUserController often works with `verification.verify`.
             
             // Let's rely on standard `verificationUrl` ($verificationUrl) and pass THAT to the mobile app.
             // The Mobile App will capture it, parsing query params?
             // No, `verificationUrl` path is `/email/verify/{id}/{hash}`.
             
             // Let's parse the generated $verificationUrl to extract components.
             $parsed = parse_url($verificationUrl);
             parse_str($parsed['query'] ?? '', $queryParams);
             
             // We construct the mobile deep link to pass these exact parameters to the App.
             // The App `verify-email.tsx` takes (id, hash, expires, signature).
             // It calls `authApi.verifyEmail` which constructs: `/email/verify/${id}/${hash}?expires=...&signature=...`.
             // This constructed API request MUST match a valid signed URL structure for the backend to accept it.
             
             // ISSUE: `verificationUrl` is typically `http://web-host/email/verify...`.
             // API request is `http://api-host/api/email/verify...`.
             // The paths differ! Signature will fail if validated strictly against path.
             
             // Laravel's `VerifyEmail` request `hash_equals` checks.
             // Usually it calls `$request->hasValidSignature()`.
             
             // To solve this cleanly for mobile:
             // The Deep Link should carry the *API* Signed URL components.
             // So we generate a URL for the *API* route.
             
             $apiVerificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'verification.verify', // Ensure this route exists for API or we use a custom one
                $expiration,
                ['id' => $id, 'hash' => $hash]
             );
             
             // But wait, `verification.verify` is likely the Web route. 
             // If we don't have a named API route...
             // Let's check `routes/api.php`?
        }
        
        // Fallback: We pass the components of the Web URL.
        // And we hope `authApi.verifyEmail` calls the SAME endpoint or one that accepts this signature.
        // If `api.ts` calls `api.get('/email/verify/...')`, that goes to backend.
        // If backend handles it with `VerificationController` (web), it expects web signature.
        
        $parsed = parse_url($verificationUrl);
        parse_str($parsed['query'] ?? '', $queryParams);
        $signature = $queryParams['signature'] ?? '';
        $expires = $queryParams['expires'] ?? '';

        $mobileUrl = "controlapp://(auth)/verify-email?id={$id}&hash={$hash}&expires={$expires}&signature={$signature}";

        // Enviamos nuestro Mailable personalizado con ambas URLs
        return (new VerificacionEmailMail($verificationUrl, $notifiable))
            ->withMobileUrl($mobileUrl) // We will add this method
            ->to($notifiable->getEmailForVerification());
    }
}
