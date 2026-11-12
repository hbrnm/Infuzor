# Infuzor — cronometru și parametri pentru ceai (PWA)

React + Vite + Tailwind. Fără backend; datele utilizatorului (ceaiuri proprii, favorite, jurnal) rămân în `localStorage`.

## Rulare locală
    npm install
    npm run dev

## Lansare pe Vercel
1. Urcă folderul pe GitHub, apoi Vercel → Add New Project → importă repo-ul (framework: Vite, setările implicite).
2. Deploy. Aplicația se instalează de pe link:
   - iPhone: Safari → Partajare → „Adaugă pe ecranul de pornire".
   - Android: Chrome → meniu → „Instalează aplicația".
3. Când schimbi fișierele din `public/` sau vrei să forțezi reîncărcarea cache-ului, crește `CACHE` în `public/sw.js`.

## Limitări cunoscute
- Notificările și sunetul funcționează cât aplicația e deschisă (iOS suspendă JavaScript în fundal; alerte garantate în fundal ar cere push server). Ecranul rămâne aprins cât rulează cronometrul.
- Valorile (temperatură, doză, timp, cofeină) sunt orientative.
