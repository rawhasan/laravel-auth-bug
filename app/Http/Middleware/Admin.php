<?php

namespace App\Http\Middleware;

use Auth;
use Closure;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    // public function handle($request, Closure $next)
    // {
    //   // return $next($request);

    //   if (!Auth::check()) {
    //       return redirect()->route('login');
    //   }

    //   if (Auth::user()->role == 0) {
    //     return redirect()->route('railway');
    //   }

    //   if (Auth::user()->role == 5) {
    //     return redirect()->route('admin');
    //   }
    // }

    public function handle($request, Closure $next)
    {
      if (Auth::user()->role == 0) {
        return redirect()->route('railway');
      }

      if (Auth::user()->role == 5) {
        return redirect()->route('admin');
      }
      return $next($request);
    }

}
