const navItems = document.querySelectorAll('.nav-item');

const burger = document.querySelector('.burger');
const primaryBar = document.querySelector('.primary-bar'); // <div>

// slide the nav sidebar
burger.addEventListener('click', () => {
  // toggle nav
  primaryBar.classList.toggle('primary-bar-active');
  // displayBar.classList.toggle('display-bar-active');

  // burger animation
  burger.classList.toggle('toggle');
}); 












