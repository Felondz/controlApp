<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        // Ensure email is lowercased before validation and processing
        if ($request->has('email')) {
            $request->merge(['email' => strtolower($request->email)]);
        }

        Log::info('Registration initiated', ['email' => $request->email]);

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'terms' => 'required|accepted',
            ]);
            Log::info('Validation passed');

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            Log::info('User created in DB', ['id' => $user->id]);

            Log::info('Dispatching Registered event...');
            try {
                event(new Registered($user));
                Log::info('Registered event dispatched successfully');
            } catch (\Exception $e) {
                Log::error('FAILED to dispatch Registered event (Email/Redis issue)', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                // We don't throw here to allow user creation even if email fails
            }

            // NO hacer login automático
            // Auth::login($user);

            if ($request->wantsJson()) {
                return response()->json(['message' => __('auth.account_created_verification_required')], 201);
            }

            Log::info('Redirecting to login with status message');
            return redirect(route('login'))->with('status', __('auth.account_created_verification_required'));

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed during registration', ['errors' => $e->errors()]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('CRITICAL ERROR during registration', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'previous' => $e->getPrevious() ? $e->getPrevious()->getMessage() : null,
            ]);
            // Return back with error to see it in UI if possible, or let standard error handler catch it
            throw $e;
        }
    }
}
