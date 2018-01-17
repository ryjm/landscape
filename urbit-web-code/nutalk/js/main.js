// if (window.runapp) {
//   window.runapp();
//   console.log('app loading!');
// }

window.interval = setInterval(function() {
  if (window.runapp) {
    console.log('app loaded');
    window.runapp();
    clearInterval(window.interval);
  } else {
    console.log('app loading...');
  }
}, 500);
