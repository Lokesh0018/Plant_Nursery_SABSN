import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/fonts.css'
import './styles/global.css'

// A refresh anywhere on the page reopens it at the top.
// 1. tell the browser not to restore the old position; 2. drop any #hash so nothing jumps to a
// section; 3. pin to the top now, again once everything has loaded, and once more on the next
// frame (images and fonts can change the layout after load); 4. also scroll to the top just
// before leaving, so browsers that ignore manual restoration still have nothing to restore.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
const toTop = () => window.scrollTo(0, 0);
toTop();
window.addEventListener('load', () => {
  toTop();
  requestAnimationFrame(toTop);
  setTimeout(toTop, 120);
});
window.addEventListener('pageshow', toTop);
window.addEventListener('beforeunload', toTop);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
