### StadtPuffKings OwnerBot


## Installation


###  VPS oder PC (Beispiel auf Ubuntu)

   1. Installiere git ffmpeg curl
      ```
       sudo apt -y update &&  sudo apt -y upgrade
       sudo apt -y install git ffmpeg curl
      ```
   2. Installiere nodejs

      ```
      sudo apt -y remove nodejs
      curl -fsSl https://deb.nodesource.com/setup_lts.x | sudo bash - && sudo apt -y install nodejs
      ```

   3. Installiere yarn

      ```
      curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
      echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
      sudo apt -y update && sudo apt -y install yarn
      ```

   4. Installiere pm2

      ```
      sudo yarn global add pm2
      ```

   5. Klone Repo und installiere die Pakete

      ```
      git clone https://github.com/keva4ko/whatsapp_bot_md
      cd whatsapp_bot_md
      yarn install --network-concurrency 1
      ```

   6. Konfiguration öffnen

      ```
      touch config.env
      nano config.env
      ```

      Kopiere und füge es in die Konfiguration ein (entferne SESSION_ID wenn du es nicht brauchst)

      ```
      SESSION_ID =
      PREFIX = .
      STICKER_PACKNAME = SPKings
      ALWAYS_ONLINE = false
      RMBG_KEY = null
      LANGUAG = de
      WARN_LIMIT = 3
      FORCE_LOGOUT = false
      BRAINSHOP = 159501,6pq8dPiYt7PdqHz3
      MAX_UPLOAD = 200
      REJECT_CALL = false
      SUDO = 491632328802,4915110689548
      TZ = Europe/Germany
      VPS = true
      AUTO_STATUS_VIEW = false
      SEND_READ = false
      ```

      [Read More](https://github.com/lyfe00011/whatsapp-bot-md/wiki/Environment_Variables)

      strg + o und strg + x zum speichern und schließen

   7. Start und Stop des Bots

      Um den Bot zu starten tippe `npm start`,
      zum stoppen `npm stop`

### Keva4ko
