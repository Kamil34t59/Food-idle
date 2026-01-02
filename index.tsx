
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Bezpieczna rejestracja Service Workera
 * Naprawia błąd: "The origin of the provided scriptURL does not match the current origin"
 */
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Budujemy pełną ścieżkę do sw.js na podstawie bieżącej lokalizacji
      const swUrl = new URL('sw.js', window.location.href).href;

      // Sprawdzamy czy plik sw.js faktycznie istnieje i jest dostępny na tym samym originie
      // Zapobiega to błędom, gdy serwer przekierowuje 404 na inną domenę (np. ai.studio)
      const response = await fetch(swUrl, { method: 'HEAD' });
      
      if (!response.ok || response.redirected) {
        console.warn('Food Idle PWA: sw.js nie jest dostępny lub został przekierowany. Pomijam rejestrację.');
        return;
      }

      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: '/',
      });
      
      console.log('Food Idle PWA: Rejestracja udana na scope:', registration.scope);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Food Idle PWA: Nowa zawartość jest dostępna; odśwież stronę.');
              } else {
                console.log('Food Idle PWA: Zawartość jest buforowana do użytku offline.');
              }
            }
          };
        }
      };
    } catch (error) {
      // Wyłapujemy błędy pochodzenia i inne błędy rejestracji bez przerywania działania aplikacji
      console.warn('Food Idle PWA: Service Worker nie mógł zostać zarejestrowany (może to być specyfika środowiska deweloperskiego):', error);
    }
  }
};

// Rejestrujemy tylko jeśli nie jesteśmy wewnątrz iframe (częsty problem w edytorach)
if (window.self === window.top) {
  window.addEventListener('load', registerServiceWorker);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
