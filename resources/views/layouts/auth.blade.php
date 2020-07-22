<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><!-- minimum-scale=1.0 added to hide overflow-x on mobile -->

  <!-- CSRF Token -->
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name', 'Laravel') }}</title>

  <!-- Scripts -->
  <script src="{{ asset('js/app.js') }}" defer></script>  
  <script src="/scripts/menu.js" type="text/javascript" defer></script>

  <!-- Fonts -->
  <link rel="dns-prefetch" href="//fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;900&display=swap" rel="stylesheet">
	
  <!-- Styles -->
  <link rel="stylesheet" href="../css/style.css" type="text/css">

</head>
<body>
<!-- navbar on top -->
<nav>
  <div class="logo">
  <h4><a href="/"><span>Geo</span><span>Rail</span> <span>| Bangladesh</span></a></h4>
  </div>

  <div class="burger">
    <div class="line1"></div>
    <div class="line2"></div>
    <div class="line3"></div>
  </div>
</nav>
<!-- end of navbar on top -->

<!-- right sidebar -->
<div class="primary-bar bar">
  <div id="auth-user">
    @if (Route::has('login'))
      <div class="auth-links">
        @auth
          <a href="{{ url('/railway') }}">Railway Information</a>
        @else
          <a href="{{ route('login') }}">Login</a>

          @if (Route::has('register'))
            <a href="{{ route('register') }}">Register</a>
          @endif
        @endauth
      </div>
    @endif
  </div>
</div>
<!-- end of right sidebar -->

<div id="app" class="auth-container">
  <main id="auth-form" class="py-4">
    @yield('content')
  </main>
</div>

</body>
</html>
