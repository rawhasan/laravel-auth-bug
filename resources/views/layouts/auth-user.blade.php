<!-- sub-view to be included on the authentication views
to display authentication links on the sidebar for everyone -->

<div id="auth-user">
  @guest
    <div class="">
      <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
    </div>
    @if (Route::has('register'))
      <div class="">
        <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
      </div>
    @endif
  @else
    <div class="">
      <!-- <a id="navbarDropdown" class="" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
        {{ Auth::user()->name }} <span class="caret"></span>
      </a> -->

      <div id="user-info">
        {{ Auth::user()->name }} <div class="karma">Karma Score: {{ Auth::user()->karma_score }}</div>
      </div>

      <div class="">
        <a class="" href="{{ route('logout') }}"
            onclick="event.preventDefault();
                          document.getElementById('logout-form').submit();">
            {{ __('Logout') }}
        </a>

        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
          @csrf
        </form>
      </div>
    </div>
  @endguest
</div>