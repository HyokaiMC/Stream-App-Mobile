# Stream Deck Mobile

Deux morceaux :
- `server/` : un petit serveur Node a lancer sur le PC. Il ecoute sur le reseau local et execute les actions (ouvrir un programme, un dossier, un site, fermer un programme).
- `mobile/` : une app Android (webview Capacitor) avec une grille de boutons, qui appelle le serveur du PC en Wi-Fi.

## 1. Lancer le serveur sur le PC

```
cd server
npm install
npm start
```

Note l'adresse IP locale de ton PC (`ipconfig`, ligne "Adresse IPv4") et le port (4567 par defaut).

Personnalise tes boutons dans `server/config.json` :
- `open_app` : chemin vers un .exe
- `open_folder` : chemin vers un dossier
- `open_url` : une URL a ouvrir dans le navigateur par defaut
- `close_app` : nom du processus a tuer (ex: `notepad.exe`)

Change aussi le `token` dans `config.json` pour un secret perso (evite de laisser la valeur par defaut).

## 2. Construire l'APK

Le build se fait via GitHub Actions (`.github/workflows/build-apk.yml`) :
1. Pousse ce repo sur GitHub.
2. Va dans l'onglet Actions du repo, l'action "Build Android APK" se lance automatiquement sur push (ou lance-la a la main via "Run workflow").
3. Une fois termine, telecharge l'artifact `streamdeck-debug-apk` -> `app-debug.apk`.
4. Transfere l'APK sur ton telephone (cable, drive, etc.) et installe-le (autoriser "sources inconnues" si demande).

## 3. Connecter le telephone au PC

1. Assure-toi que le telephone et le PC sont sur le meme Wi-Fi.
2. Ouvre l'app sur le telephone, tape sur l'icone reglages.
3. Renseigne `IP-du-PC:4567` et le token defini dans `config.json`.
4. Les boutons de `config.json` apparaissent dans la grille.
