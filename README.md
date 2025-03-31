<<<<<<< HEAD
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
# -CN6035-

# Reserveat! - Restaurant Reservation App

Μια mobile εφαρμογή για την εύκολη ανακάλυψη και κράτηση εστιατορίων.

## Περιγραφή Λειτουργικότητας

Το Reserveat! είναι μια mobile εφαρμογή που επιτρέπει στους χρήστες να αναζητούν εστιατόρια, να περιηγούνται σε μια λίστα με διαθέσιμα εστιατόρια με φωτογραφίες και βασικές πληροφορίες (τοποθεσία, περιγραφή), και να προχωρούν σε κρατήσεις για συγκεκριμένες ημερομηνίες και ώρες. Η εφαρμογή παρέχει επίσης τη δυνατότητα στους χρήστες να βλέπουν τις επερχόμενες και τις προηγούμενες κρατήσεις τους, καθώς και να ακυρώνουν τις μελλοντικές κρατήσεις τους. Επιπλέον, προσφέρεται μια απλή διαχείριση προφίλ (προβολή username και email) και πρόσβαση σε πληροφορίες σχετικά με την εφαρμογή και στοιχεία επικοινωνίας.

## Οδηγίες Εγκατάστασης

Για να εγκαταστήσετε και να εκτελέσετε την εφαρμογή Reserveat! στον τοπικό σας υπολογιστή, ακολουθήστε τα παρακάτω βήματα:

### Προαπαιτούμενα

* **Node.js και npm (ή yarn):** Βεβαιωθείτε ότι έχετε εγκατεστημένες τις τελευταίες σταθερές εκδόσεις των Node.js και npm (ή yarn) στο σύστημά σας.
* **Expo CLI:** Αν χρησιμοποιήσατε Expo για την ανάπτυξη του frontend, εγκαταστήστε το Expo CLI παγκοσμίως:
    ```bash
    npm install -g expo-cli
    # ή
    yarn global add expo-cli
    ```
* **React Native CLI (αν δεν χρησιμοποιήσατε Expo):** Αν χρησιμοποιήσατε React Native CLI, βεβαιωθείτε ότι έχετε ρυθμίσει σωστά το περιβάλλον ανάπτυξης για React Native, συμπεριλαμβανομένου του Android Studio ή του Xcode.
* **Git:** Βεβαιωθείτε ότι έχετε εγκατεστημένο το Git για να κλωνοποιήσετε το αποθετήριο.

### Βήματα Εγκατάστασης

1.  **Κλωνοποιήστε το αποθετήριο:**
    ```bash
    git clone <https://github.com/Antoniskapetanakis/-CN6035->
    cd restaurant-reservation-app
    ```

2.  **Εγκατάσταση Backend (Node.js/Express):**
    * Μεταβείτε στον φάκελο του backend (αν έχετε ξεχωριστό φάκελο, π.χ., `backend`):
        ```bash
        cd backend
        ```
    * Εγκαταστήστε τις dependencies του backend:
        ```bash
        npm install
        # ή
        yarn install
        ```
    * **Ρύθμιση Μεταβλητών Περιβάλλοντος (αν υπάρχουν):** Αν το backend σας χρησιμοποιεί μεταβλητές περιβάλλοντος (π.χ., για σύνδεση σε βάση δεδομένων, JWT secret), δημιουργήστε ένα αρχείο `.env` στον φάκελο του backend και ορίστε τις απαραίτητες μεταβλητές.
    * **Εκτέλεση Backend:** Ξεκινήστε τον backend server:
        ```bash
        npm start
        # ή
        npm run dev # αν έχετε ρυθμίσει script για development
        ```
        Το backend αναμένεται να τρέχει στο `http://localhost:3000`.

3.  **Εγκατάσταση Frontend (React Native):**
    * Μεταβείτε στον φάκελο του frontend (αν έχετε ξεχωριστό φάκελο, π.χ., `frontend` ή `mobile-app`):
        ```bash
        cd frontend
        ```
    * Εγκαταστήστε τις dependencies του frontend:
        ```bash
        npm install
        # ή
        yarn install
        ```
    * **Εκτέλεση Frontend (ανάλογα με το αν χρησιμοποιείτε Expo ή React Native CLI):**
        * **Για Expo:**
            ```bash
            npx expo start
            ```
            Αυτό θα ανοίξει το Expo DevTools σε ένα browser. Μπορείτε να τρέξετε την εφαρμογή σε ένα emulator/simulator ή σε μια φυσική συσκευή σαρώνοντας το QR code με την εφαρμογή Expo Go.
        * **Για React Native CLI:**
            * **iOS:**
                ```bash
                npx react-native run-ios
                ```
                (Ενδέχεται να χρειαστεί να μεταβείτε στον φάκελο `ios` και να εκτελέσετε `pod install` αν είναι η πρώτη φορά).
            * **Android:**
                ```bash
                npx react-native run-android
                ```
                (Βεβαιωθείτε ότι έχετε ρυθμίσει σωστά το Android SDK και ένα emulator ή έχετε συνδεδεμένη μια φυσική συσκευή Android).

4.  **Ρύθμιση Backend URL στο Frontend:**
    * Ελέγξτε τον κώδικα του frontend σας (συνήθως σε αρχεία που αφορούν API κλήσεις ή ρυθμίσεις) για να βεβαιωθείτε ότι η βασική URL για τις κλήσεις προς το backend είναι σωστά ρυθμισμένη στο `http://localhost:3000`. Αν το backend σας τρέχει σε διαφορετική διεύθυνση ή port, θα πρέπει να την ενημερώσετε ανάλογα.
    * **Σημείωση για φυσικές συσκευές:** Όταν δοκιμάζετε σε μια φυσική συσκευή, το `localhost` δεν θα αναφέρεται στον υπολογιστή σας. Θα χρειαστεί να χρησιμοποιήσετε την IP διεύθυνση του υπολογιστή σας στο τοπικό δίκτυο αντί για `localhost`.

## Περιγραφή Λειτουργικότητας

Η εφαρμογή Reserveat! προσφέρει τις ακόλουθες κύριες λειτουργίες:

* **Προβολή Λίστας Εστιατορίων:** Η αρχική οθόνη εμφανίζει μια οριζόντια λίστα με κάρτες εστιατορίων. Κάθε κάρτα περιλαμβάνει μια φωτογραφία του εστιατορίου (αν υπάρχει), το όνομά του, την τοποθεσία και μια σύντομη περιγραφή.
* **Αναζήτηση Εστιατορίων:** Οι χρήστες μπορούν να χρησιμοποιήσουν ένα πεδίο αναζήτησης για να φιλτράρουν τα εστιατόρια βάσει του ονόματός τους.
* **Πλοήγηση Εστιατορίων:** Η οριζόντια λίστα εστιατορίων είναι σε μορφή καρουζέλ, επιτρέποντας στους χρήστες να περιηγούνται σύροντας ή χρησιμοποιώντας τα κουμπιά αριστερά και δεξιά. Εμφανίζονται τρεις κουκκίδες pagination που υποδεικνύουν την τρέχουσα θέση στην λίστα.
* **Λεπτομέρειες Εστιατορίου:** Πατώντας το κουμπί "Reserve" σε μια κάρτα εστιατορίου, ο χρήστης μεταφέρεται στην οθόνη κράτησης για το συγκεκριμένο εστιατόριο (αν και η συγκεκριμένη οθόνη και η διαδικασία κράτησης δεν περιγράφονται λεπτομερώς στον παρεχόμενο κώδικα, υπονοείται η μετάβαση σε μια τέτοια οθόνη).
* **Προβολή Επερχόμενων Κρατήσεων:** Στην κύρια οθόνη, υπάρχει μια ενότητα που εμφανίζει τις επερχόμενες κρατήσεις του συνδεδεμένου χρήστη. Εμφανίζονται πληροφορίες όπως το όνομα του εστιατορίου, η ημερομηνία και η ώρα της κράτησης.
* **Προβολή Ιστορικού Κρατήσεων:** Υπάρχει επίσης μια ενότητα που εμφανίζει τις προηγούμενες κρατήσεις του χρήστη.
* **Ακύρωση Κρατήσεων:** Οι χρήστες έχουν τη δυνατότητα να ακυρώσουν τις επερχόμενες κρατήσεις τους μέσω ενός κουμπιού "trash" δίπλα σε κάθε κράτηση.
* **Επεξεργασία Κρατήσεων:** Υπάρχει η δυνατότητα επεξεργασίας των επερχόμενων κρατήσεων μέσω ενός εικονιδίου "edit".
* **Προφίλ Χρήστη:** Μέσω ενός κουμπιού "Profile" στο μενού, οι χρήστες μπορούν να δουν το username και το email τους.
* **Πληροφορίες Εφαρμογής:** Υπάρχουν κουμπιά "About" και "Contact" στο μενού που οδηγούν σε απλές οθόνες πληροφοριών για την εφαρμογή και στοιχεία επικοινωνίας.
* **Αποσύνδεση:** Οι χρήστες μπορούν να αποσυνδεθούν από την εφαρμογή μέσω ενός κουμπιού "Logout" στο μενού.
* **Ένδειξη Φόρτωσης:** Κατά τη φόρτωση δεδομένων εστιατορίων από το backend, εμφανίζεται ένα indicator φόρτωσης.
* **Διαχείριση Σφαλμάτων:** Η εφαρμογή διαχειρίζεται σφάλματα κατά την ανάκτηση δεδομένων και εμφανίζει κατάλληλα μηνύματα στους χρήστες.

## Τεχνολογίες

* **Frontend:**
    * React Native
    * React
    * JavaScript
    * `@react-navigation/native`
    * `@react-native-async-storage/async-storage`
    * `react-native-vector-icons`
    * Expo (αν χρησιμοποιήθηκε)
* **Backend:**
    * Node.js
    * Express.js
* **Βάση Δεδομένων:** (Η βάση δεδομένων που χρησιμοποιείται για την αποθήκευση των δεδομένων των εστιατορίων και των κρατήσεων δεν καθορίζεται ρητά στον παρεχόμενο κώδικα. Θα μπορούσε να είναι οποιαδήποτε συμβατή βάση δεδομένων όπως MongoDB, PostgreSQL, MySQL, κ.λπ.)

## Σημαντικές Σημειώσεις

* Αυτή είναι μια βασική έκδοση της εφαρμογής και ενδέχεται να μην περιλαμβάνει όλες τις λειτουργίες μιας πλήρους εφαρμογής κράτησης εστιατορίων (π.χ., επιλογή ώρας κράτησης, αριθμός ατόμων, επιβεβαιώσεις, κ.λπ.).
* Η επικοινωνία με το backend γίνεται μέσω της διεύθυνσης `http://localhost:3000`. Βεβαιωθείτε ότι ο backend server τρέχει σε αυτή τη διεύθυνση κατά την εκτέλεση του frontend.
* Για την προβολή των φωτογραφιών των εστιατορίων, ο backend server πρέπει να έχει πρόσβαση στον φάκελο `images` όπου αποθηκεύονται οι φωτογραφίες.
>>>>>>> origin/main
