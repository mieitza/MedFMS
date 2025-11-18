# Manual de Utilizare MedFMS
## Sistem de Management al Flotei Medicale

**Versiune:** 1.0
**Data:** Noiembrie 2025

---

## Cuprins

1. [Introducere](#1-introducere)
2. [Autentificare și Profil Utilizator](#2-autentificare-și-profil-utilizator)
3. [Tablou de Bord](#3-tablou-de-bord)
4. [Gestionarea Vehiculelor](#4-gestionarea-vehiculelor)
5. [Gestionarea Șoferilor](#5-gestionarea-șoferilor)
6. [Modulul Combustibil](#6-modulul-combustibil)
7. [Modulul Mentenanță](#7-modulul-mentenanță)
8. [Modulul Materiale și Depozite](#8-modulul-materiale-și-depozite)
9. [Inventarul Vehiculelor](#9-inventarul-vehiculelor)
10. [Rapoarte și Analize](#10-rapoarte-și-analize)
11. [Administrare](#11-administrare)
12. [Roluri și Permisiuni](#12-roluri-și-permisiuni)

---

## 1. Introducere

### 1.1 Despre MedFMS

MedFMS (Medical Fleet Management System) este o platformă completă de management al flotei de vehicule medicale, special concepută pentru serviciile de ambulanță și instituțiile medicale. Sistemul oferă funcționalități avansate pentru:

- Gestionarea vehiculelor și documentelor asociate
- Urmărirea consumului de combustibil
- Programarea și monitorizarea mentenanței
- Gestionarea inventarului de materiale și echipamente
- Generarea de rapoarte și analize detaliate

### 1.2 Caracteristici Principale

- **Interfață intuitivă**: Design modern și ușor de utilizat
- **Acces bazat pe roluri**: Permisiuni diferențiate pentru Admin, Manager și Operator
- **Raportare completă**: Rapoarte detaliate pentru toate modulele
- **Gestionare documente**: Upload și stocare sigură a documentelor
- **Alerte automate**: Notificări pentru stocuri mici, expirări, mentenanță
- **Multi-depozit**: Suport pentru gestionarea mai multor depozite

---

## 2. Autentificare și Profil Utilizator

### 2.1 Autentificare

1. Accesați aplicația la adresa: `https://medfms.cognitcube.com`
2. Introduceți **PIN-ul** dvs. de acces (4-6 cifre)
3. Apăsați butonul **"Autentificare"**

**Notă:** În caz de probleme cu PIN-ul, contactați administratorul pentru resetare.

### 2.2 Gestionarea Profilului

Pentru a accesa profilul personal:
1. Click pe pictograma profilului din colțul dreapta sus
2. Selectați **"Profil"**

**Opțiuni disponibile:**
- **Vizualizare date personale**: Nume, email, telefon, rol
- **Editare informații**: Modificați datele de contact
- **Schimbare PIN**: Setați un nou PIN pentru autentificare

**Cum schimb PIN-ul:**
1. Accesați Profil → **"Schimbă PIN"**
2. Introduceți PIN-ul actual
3. Introduceți noul PIN (minim 4 cifre)
4. Confirmați noul PIN
5. Apăsați **"Salvează"**

### 2.3 Deconectare

Pentru a vă deconecta:
- Click pe pictograma profilului → **"Deconectare"**

---

## 3. Tablou de Bord

Tabloul de bord oferă o vedere generală asupra sistemului și statistici în timp real.

### 3.1 Statistici Principale

**Carduri afișate:**
- **Total Vehicule**: Numărul total de vehicule înregistrate
- **Tranzacții Combustibil**: Total tranzacții de alimentare
- **Materiale**: Numărul de articole din inventar
- **Șoferi Activi**: Numărul de șoferi cu status activ

### 3.2 Navigare Rapidă

Din tabloul de bord puteți accesa rapid toate modulele principale prin intermediul meniului din stânga.

---

## 4. Gestionarea Vehiculelor

### 4.1 Lista Vehiculelor

**Acces:** Meniu principal → **"Vehicule"**

**Funcționalități:**
- **Căutare**: Căutați după cod vehicul, număr înmatriculare, marcă sau model
- **Filtrare**: Filtrați după status, tip vehicul, locație, departament
- **Sortare**: Sortați după orice coloană (cod, număr înmatriculare, marcă, an, etc.)
- **Paginare**: Navigați prin liste mari cu 10, 25, 50 sau 100 înregistrări per pagină

### 4.2 Adăugare Vehicul Nou

1. Click pe butonul **"+ Adaugă Vehicul"**
2. Completați informațiile obligatorii:
   - **Cod Vehicul**: Identificator unic (ex: AMB-001)
   - **Număr Înmatriculare**: Plăcuță (ex: B-123-ABC)
   - **Marcă**: Selectați marca din listă (Mercedes, Ford, etc.)
   - **Model**: Selectați modelul corespunzător
   - **An Fabricație**: Anul producției
   - **Tip Combustibil**: Diesel, Benzină, GPL, etc.
   - **Tip Vehicul**: Ambulanță Tip A, B, C, etc.
   - **Status**: Activ, În Mentenanță, Rezervat, Scos din Uz

3. Completați informații suplimentare:
   - **Locație**: Punct de dislocare
   - **Departament**: Departamentul de care aparține
   - **Șofer Asignat**: Șoferul principal
   - **Kilometraj**: Citirea odometrului
   - **Număr Șasiu**: Identificator șasiu (VIN)
   - **Număr Motor**: Seria motorului
   - **Capacitate Cilindree**: În cm³
   - **Putere Motor**: În CP sau kW
   - **Capacitate Rezervor**: În litri

4. **Date Achiziție și Valoare:**
   - **Preț Achiziție**: Valoarea de cumpărare
   - **Valoare Curentă**: Valoarea actuală estimată
   - **Data Achiziției**: Data cumpărării

5. **Autorizație ANMDM** (Autoritatea Națională pentru Administrare și Reglementare în Transporturi):
   - **Număr Aviz**: Numărul autorizației
   - **Tip Aviz**: Categoria autorizației
   - **Data Emiterii**: Când a fost eliberată
   - **Data Expirării**: Scadența autorizației
   - **Autoritate Emitentă**: Instituția care a eliberat avizul
   - **Note**: Observații suplimentare

6. **Câmpuri Personalizate** (12 câmpuri configurabile pentru date specifice organizației)

7. Click **"Salvează"** pentru a crea vehiculul

### 4.3 Vizualizare și Editare Vehicul

**Pentru a vedea detaliile unui vehicul:**
1. Click pe vehiculul dorit din listă
2. Se afișează pagina cu informații complete

**Secțiuni disponibile:**
- **Informații Generale**: Toate datele vehiculului
- **Documente**: Documente asociate (înmatriculare, asigurare, ITP)
- **Fotografii**: Galerie foto (față, spate, lateral, interior, motor)
- **Istoric Mentenanță**: Lista lucrărilor efectuate
- **Consum Combustibil**: Tranzacții alimentare

**Pentru a edita:**
1. Click pe butonul **"Editează"**
2. Modificați informațiile dorite
3. Click **"Salvează"**

### 4.4 Gestionarea Documentelor

**Tipuri de documente acceptate:**
- Certificat de înmatriculare
- Poliță de asigurare
- Certificat ITP (Inspecție Tehnică Periodică)
- Viză tehnică
- Contract de leasing/cumpărare
- Alte documente (facturi, rapoarte tehnice, etc.)

**Pentru a încărca un document:**
1. Accesați pagina vehiculului
2. Navigați la secțiunea **"Documente"**
3. Click **"+ Adaugă Document"**
4. Selectați tipul documentului
5. Alegeți fișierul (PDF, DOC, JPG, PNG)
6. Adăugați descriere și data documentului
7. Click **"Încarcă"**

**Pentru a vizualiza/descărca:**
- Click pe numele documentului pentru previzualizare
- Click pe pictograma de download pentru salvare locală

### 4.5 Gestionarea Fotografiilor

**Categorii fotografii:**
- Față
- Spate
- Lateral stânga
- Lateral dreapta
- Interior
- Motor
- Tablou bord
- Alte detalii

**Pentru a adăuga fotografii:**
1. Accesați vehiculul → Secțiunea **"Fotografii"**
2. Click **"+ Adaugă Fotografie"**
3. Selectați categoria
4. Alegeți fișierul imagine (JPG, PNG, max 5MB)
5. Click **"Încarcă"**

**Funcții disponibile:**
- **Previzualizare**: Click pe miniatură pentru vizualizare mărită
- **Ștergere**: Eliminați fotografii învechite
- **Download**: Salvați fotografiile local

### 4.6 Ștergere Vehicul

**Doar administratorii** pot șterge vehicule.

1. Accesați vehiculul dorit
2. Click **"Șterge"**
3. Confirmați acțiunea

**Atenție:** Ștergerea este permanentă și va elimina toate datele asociate (documente, fotografii, istoric).

---

## 5. Gestionarea Șoferilor

### 5.1 Lista Șoferilor

**Acces:** Meniu principal → **"Șoferi"**

**Informații afișate:**
- Cod șofer
- Nume complet
- Permis de conducere (număr, categorie)
- Telefon și email
- Locație și departament
- Status (Activ/Inactiv)

### 5.2 Adăugare Șofer Nou

1. Click **"+ Adaugă Șofer"**
2. Completați formularul:
   - **Cod Șofer**: Identificator unic (ex: SOF-001)
   - **Nume Complet**: Prenume și nume
   - **CNP**: Cod numeric personal
   - **Date Contact**:
     - Telefon
     - Email
     - Adresă
   - **Permis Conducere**:
     - Număr permis
     - Categorie (B, C, D, etc.)
     - Data obținerii
     - Data expirării
   - **Departament**: Departamentul de încadrare
   - **Locație**: Punctul de lucru
   - **Status**: Activ/Inactiv

3. Click **"Salvează"**

### 5.3 Editare și Ștergere

**Editare:**
1. Click pe șofer din listă
2. Modificați informațiile
3. Click **"Salvează"**

**Ștergere:**
1. Accesați șoferul
2. Click **"Șterge"** (doar admin)
3. Confirmați

---

## 6. Modulul Combustibil

### 6.1 Tranzacții Combustibil

**Acces:** Meniu → **"Combustibil"** → **"Tranzacții"**

### 6.2 Înregistrare Alimentare

1. Click **"+ Adaugă Alimentare"**
2. Completați detaliile:
   - **Vehicul**: Selectați vehiculul alimentat
   - **Șofer**: Șoferul care a efectuat alimentarea
   - **Stație**: Stația de alimentare
   - **Data și Ora**: Momentul alimentării
   - **Kilometraj**: Citirea odometrului
   - **Tip Combustibil**: Diesel, Benzină, GPL, etc.
   - **Cantitate**: Litri alimentați
   - **Preț/Litru**: Tariful practicat
   - **Cost Total**: Se calculează automat (cantitate × preț)
   - **Metoda de Plată**: Card, Cash, Bon valoric
   - **Număr Bon/Factură**: Referință document

3. Adăugați **observații** dacă este necesar
4. Click **"Salvează"**

**Notă:** Tranzacțiile pot fi salvate ca **"În așteptare"** pentru aprobare ulterioară.

### 6.3 Aprobare Tranzacții

**Pentru manageri și administratori:**

1. Accesați **"Combustibil"** → **"Aprobări"**
2. Veți vedea lista tranzacțiilor în așteptare
3. Pentru fiecare tranzacție:
   - **Revizuiți detaliile**: Verificați corectitudinea datelor
   - **Aprobați**: Click **"Aprobă"** dacă totul este corect
   - **Respingeți**: Click **"Respinge"** și adăugați motiv dacă sunt probleme

### 6.4 Rapoarte Combustibil

**Acces:** **"Combustibil"** → **"Rapoarte"**

**Tipuri de rapoarte disponibile:**

#### 6.4.1 Raport General

- **Perioade predefinite**: 7 zile, 30 zile, 90 zile, 1 an
- **Perioadă personalizată**: Selectați interval specific
- **Date afișate**:
  - Total litri consumați
  - Cost total
  - Consum mediu/vehicul
  - Eficiență combustibil (km/litru)
  - Top vehicule consumatoare

#### 6.4.2 Raport Zilnic pe Vehicul

- Vedere detaliată a consumului zilnic pentru fiecare vehicul
- Identificare anomalii în consum
- Comparații între zile

#### 6.4.3 Raport Alimentări Duminica

Raport special pentru identificarea alimentărilor efectuate duminica (pentru analiză conformitate).

**Informații incluse:**
- Vehicule alimentate duminica
- Cantități și costuri
- Șoferi implicați
- Justificări (dacă există)

### 6.5 Import UTA (Card Combustibil)

**Acces:** **"Combustibil"** → **"Import"**

Pentru organizații care folosesc carduri de combustibil UTA:

1. Click **"Import UTA"**
2. Selectați fișierul exportat de la furnizor
3. Click **"Încarcă și Procesează"**
4. Sistemul va:
   - Valida datele
   - Asocia automat tranzacțiile cu vehiculele
   - Importa tranzacțiile în sistem
5. Revizuiți istoricul importurilor în secțiunea **"Loturi Import"**

### 6.6 Gestionare Stații Combustibil

**Acces:** **"Combustibil"** → **"Stații"**

**Adăugare stație nouă:**
1. Click **"+ Adaugă Stație"**
2. Completați:
   - Nume stație (ex: Petrom, OMV, Rompetrol)
   - Adresă completă
   - Oraș
   - Program funcționare
   - Metode de plată acceptate
   - Servicii disponibile
   - Contact

3. Click **"Salvează"**

---

## 7. Modulul Mentenanță

### 7.1 Ordine de Lucru (Work Orders)

**Acces:** Meniu → **"Mentenanță"** → **"Ordine Lucru"**

### 7.2 Creare Ordin de Lucru

1. Click **"+ Ordin Nou"**
2. Completați informațiile:

   **Date Generale:**
   - **Număr Ordin**: Se generează automat (ex: WO-2025-001)
   - **Vehicul**: Selectați vehiculul
   - **Tip Mentenanță**: Selectați din listă:
     - Service periodic
     - Reparație
     - Revizii tehnice (ITP)
     - Schimb anvelope
     - Intervenție urgentă
     - Alte

   **Detalii Lucrare:**
   - **Titlu**: Descriere scurtă (ex: "Schimb ulei și filtre")
   - **Descriere**: Detalii complete ale lucrării necesare
   - **Prioritate**: 1 (Urgentă) - 5 (Scăzută)
   - **Kilometraj Vehicul**: Citirea odometrului
   - **Ore Motor**: Dacă aplicabil

   **Programare:**
   - **Data Solicitării**: Când a fost identificată nevoia
   - **Data Programată**: Când este planificată intervenția
   - **Termen Limită**: Data până la care trebuie finalizată
   - **Facilitație**: Service-ul unde se execută
   - **Alocat către**: Tehnician/Echipă responsabilă

   **Costuri:**
   - **Cost Estimat**: Valoare aproximativă totală
   - **Ore Manoperă**: Estimare ore necesare

   **Piese Necesare:**
   - Listați piesele/materialele necesare
   - Cantități estimate

3. Click **"Salvează"**

**Status-uri posibile:**
- **În așteptare**: Creat, așteaptă aprobare
- **Aprobat**: Aprobat pentru execuție
- **În progres**: În curs de execuție
- **Suspendat**: Temporar oprit
- **Finalizat**: Complet executat
- **Anulat**: Nu se mai execută

### 7.3 Actualizare Ordin de Lucru

**În timpul execuției:**

1. Accesați ordinul de lucru
2. Click **"Editează"**
3. Actualizați:
   - **Status**: Schimbați după progres
   - **Data Începerii**: Când s-a început lucrarea
   - **Data Finalizării**: Când s-a terminat
   - **Cost Real**: Costul efectiv
   - **Piese Folosite**: Ce s-a montat efectiv
   - **Ore Manoperă Reale**: Timpul efectiv
   - **Note Finalizare**: Observații despre lucrarea executată

4. **Verificare Calitate** (opțional):
   - Marcare verificare calitate
   - Cine a verificat
   - Data verificării
   - Note verificare

5. Click **"Salvează"**

### 7.4 Aprobare Ordine de Lucru

**Acces:** **"Mentenanță"** → **"Aprobări"**

**Pentru manageri și administratori:**

1. Vedeți lista ordinelor în așteptare
2. Pentru fiecare ordin:
   - Revizuiți detaliile și costul estimat
   - **Aprobați**: Dacă sunteți de acord cu intervenția
   - **Respingeți**: Dacă nu este justificat sau e nevoie de clarificări
   - Adăugați **note de aprobare/respingere**

### 7.5 Gestionare Fișiere Ordin

**Atașarea documentelor:**
1. Accesați ordinul de lucru
2. Secțiunea **"Fișiere"**
3. Click **"+ Adaugă Fișier"**
4. Selectați tipul:
   - Factură
   - Bon fiscal
   - Raport tehnic
   - Fotografii înainte/după
   - Certificate garanție
   - Alte documente

5. Încărcați fișierul
6. Adăugați descriere
7. Click **"Salvează"**

### 7.6 Programări Mentenanță

**Acces:** **"Mentenanță"** → **"Programări"**

**Crearea unei programări recurente:**

1. Click **"+ Programare Nouă"**
2. Selectați:
   - **Vehicul**
   - **Tip Mentenanță**: Ce lucrare se execută periodic
   - **Interval**: Tipul de recurență:
     - Zile (ex: la fiecare 90 de zile)
     - Kilometri (ex: la fiecare 10.000 km)
     - Ore motor (ex: la fiecare 500 ore)
     - Luni (ex: la fiecare 6 luni)

3. Setați **valoarea intervalului** (ex: 10000 pentru kilometri)
4. Configurați **alertele**:
   - Amintire cu X zile înainte
   - Amintire cu Y km înainte
   - Email notificare (opțional)

5. Click **"Salvează"**

**Sistemul va:**
- Calcula automat următoarea mentenanță
- Genera alerte la apropierea termenului
- Crea automat ordine de lucru (opțional)

### 7.7 Alerte Mentenanță

**Acces:** **"Mentenanță"** → **"Alerte"**

**Tipuri de alerte:**
- Mentenanță scadentă (termen aproape)
- Mentenanță întârziată (termen depășit)
- Revizie ITP apropiată
- Expirare asigurare
- Expirare autorizații

**Gestionarea alertelor:**
1. Vedeți lista alertelor active
2. Click pe alertă pentru detalii
3. **Acțiuni posibile**:
   - **Confirmă**: Am văzut alerta
   - **Creează Ordin**: Generați direct un ordin de lucru
   - **Amână**: Setați o amânare justificată
   - **Rezolvă**: Marcați ca rezolvată

### 7.8 Rapoarte Mentenanță

**Acces:** **"Mentenanță"** → **"Rapoarte"**

**Rapoarte disponibile:**

#### 7.8.1 Analiza Mentenanței
- Total ordine pe perioade
- Costuri totale și medii
- Timp mediu de execuție
- Rate de finalizare la timp

#### 7.8.2 Performanța Flotei
- Disponibilitate vehicule
- Timp de imobilizare
- Costuri mentenanță/vehicul
- Tendințe costuri

#### 7.8.3 Raport Executiv
- Rezumat pentru management
- Indicatori cheie (KPI)
- Comparații cu perioade anterioare
- Recomandări

---

## 8. Modulul Materiale și Depozite

### 8.1 Gestionare Materiale

**Acces:** Meniu → **"Materiale"** → **"Lista Materiale"**

### 8.2 Adăugare Material Nou

1. Click **"+ Material Nou"**
2. Completați informațiile:

   **Identificare:**
   - **Cod Material**: Cod unic (ex: MAT-001, MED-012)
   - **Denumire**: Numele complet al materialului
   - **Categorie**: Selectați din listă:
     - Medicamente
     - Consumabile medicale
     - Echipamente
     - Piese de schimb
     - Combustibili și lubrifianti
     - Alte

   - **Tip Material**: Subcategorie specifică
   - **Descriere**: Detalii suplimentare

   **Date Tehnice:**
   - **Producător**: Firma producătoare
   - **Cod Producător**: Codul din catalog
   - **Unitate Măsură**: Buc, Litri, Kg, Set, etc.
   - **Cod Bare**: Pentru scanare (opțional)
   - **Număr Serie**: Dacă aplicabil

   **Stocuri:**
   - **Stoc Curent**: Cantitatea disponibilă (se calculează automat)
   - **Stoc Minim**: Nivelul de alertă pentru reaprovizionare
   - **Stoc Maxim**: Nivelul maxim recomandat
   - **Nivel Critic**: Sub acest nivel se generează alertă urgentă

   **Prețuri:**
   - **Preț Standard**: Prețul de referință
   - **Preț Ultima Achiziție**: Ultimul preț de cumpărare
   - **Preț Ultima Vânzare**: Ultimul preț de ieșire

   **Localizare:**
   - **Depozit**: Depozitul principal
   - **Raft**: Locația fizică în depozit
   - **Furnizor Principal**: Furnizorul preferat

   **Caracteristici Speciale:**
   - **Necesită Expirare**: Da/Nu
   - **Data Expirării**: Dacă aplicabil (OBLIGATORIU pentru depozit)
   - **Necesită Serie**: Da/Nu
   - **Necesită Certificare**: Da/Nu

3. Click **"Salvează"**

### 8.3 Tranzacții Materiale

**Tipuri de tranzacții:**

#### 8.3.1 Intrare (Recepție)

1. Accesați materialul
2. Click **"+ Intrare"**
3. Completați:
   - **Cantitate**: Câte unități intră
   - **Depozit Destinație**: Unde se stochează
   - **Furnizor**: De la cine se achiziționează
   - **Document**: Număr factură/aviz
   - **Preț Unitar**: Costul/unitate
   - **Data Recepție**: Când a fost recepționat
   - **Data Expirare**: Pentru produse perisabile (OBLIGATORIU)
   - **Lot**: Numărul lotului
   - **Observații**

4. Click **"Salvează"**

#### 8.3.2 Ieșire (Consum)

1. Accesați materialul
2. Click **"+ Ieșire"**
3. Completați:
   - **Cantitate**: Câte unități ies
   - **Depozit Sursă**: De unde se extrage
   - **Destinație**:
     - Vehicul (specificați care)
     - Departament
     - Angajat
     - Pacient (pentru consumabile medicale)
   - **Motiv**: Pentru ce se folosește
   - **Document**: Bon de consum
   - **Data**: Când s-a consumat

4. Click **"Salvează"**

#### 8.3.3 Transfer între Depozite

1. Accesați materialul
2. Click **"Transfer"** sau creați **Cerere Transfer** (vezi secțiunea 8.5)

### 8.4 Gestionare Depozite

**Acces:** **"Materiale"** → **"Depozite"**

#### 8.4.1 Adăugare Depozit

1. Click **"+ Depozit Nou"**
2. Completați:
   - **Cod Depozit**: Identificator unic (ex: DEP-01)
   - **Denumire**: Numele depozitului
   - **Tip**: Central, Secundar, Vehicul
   - **Locație**: Adresa fizică
   - **Oraș**
   - **Responsabil**: Persoana care gestionează
   - **Contact**: Telefon, email
   - **Capacitate**: Spațiu disponibil (m² sau m³)
   - **Suprafață**: Dimensiuni
   - **Condiții Stocare**: Temperatură, umiditate (pentru medicamente)

3. Click **"Salvează"**

#### 8.4.2 Vizualizare Stocuri Depozit

1. Accesați depozitul dorit
2. Vedeți lista completă de materiale stocate
3. **Informații afișate**:
   - Material
   - Cantitate disponibilă
   - Valoare totală
   - Data ultimei mișcări
   - Status stoc (OK, Minim, Critic)
   - Materiale cu expirare apropiată

### 8.5 Cereri de Transfer

**Acces:** **"Materiale"** → **"Cereri Transfer"**

#### 8.5.1 Creare Cerere Transfer

1. Click **"+ Cerere Nouă"**
2. Selectați **tipul transferului**:
   - **Depozit → Depozit**: Transfer între locații fixe
   - **Depozit → Vehicul**: Aprovizionare vehicul
   - **Vehicul → Depozit**: Returnare de la vehicul
   - **Depozit → Angajat**: Distribuire personală

3. Completați detaliile:
   - **Număr Cerere**: Se generează automat (ex: TR-2025-001)
   - **Sursă**: De unde se transferă
   - **Destinație**: Unde se transferă
   - **Material**: Ce se transferă
   - **Cantitate Solicitată**: Câte unități
   - **Prioritate**: 1 (Urgentă) - 5 (Normală)
   - **Data Necesară**: Până când trebuie livrat
   - **Motiv**: Justificarea transferului
   - **Observații**

4. **Aprobare Automată** (opțional):
   - Bifați dacă transferul nu necesită aprobare
   - Disponibil doar pentru transferuri de rutină și utilizatori autorizați

5. Click **"Trimite Cerere"**

**Status-uri cerere:**
- **În așteptare**: Așteaptă aprobare
- **Aprobat**: Autorizat pentru execuție
- **În tranzit**: În curs de transfer
- **Finalizat**: Primit la destinație
- **Respins**: Nu a fost aprobat
- **Anulat**: Cerere retrasă

#### 8.5.2 Aprobare Cereri

**Pentru manageri și administratori:**

1. Accesați **"Materiale"** → **"Aprobări Transferuri"**
2. Vedeți lista cererilor în așteptare
3. Pentru fiecare cerere:
   - Verificați disponibilitatea stocului
   - Validați justificarea
   - **Aprobați** sau **Respingeți**
   - Adăugați observații

4. După aprobare:
   - **Cantitate Aprobată**: Poate diferi de cantitatea solicitată
   - **Note Aprobare**: Instrucțiuni suplimentare

#### 8.5.3 Execuție Transfer

**Pentru operatori depozit:**

1. Accesați cererea aprobată
2. Click **"Începe Transfer"**
3. Pregătiți materialele:
   - Extrageți din depozit sursă
   - Verificați calitatea
   - Ambalați corespunzător

4. **Verificare Calitate** (dacă este activată):
   - Bifați verificare efectuată
   - Adăugați observații despre starea produselor

5. Click **"Marchează ca Transferat"**
   - Introduceți **cantitatea transferată** (efectivă)
   - Adăugați **data transferului**
   - Note suplimentare

6. **La recepție** (destinatar):
   - Click **"Confirmă Recepție"**
   - Introduceți **cantitatea primită**
   - Verificați **calitatea**
   - Note recepție
   - **Data primirii**

7. Sistemul actualizează automat stocurile în ambele depozite

### 8.6 Alerte Stocuri

**Acces:** **"Materiale"** → **"Alerte"**

**Tipuri de alerte:**

#### 8.6.1 Stoc Minim
- Materiale cu cantitate sub nivelul minim
- Acțiune recomandată: Comandă de reaprovizionare

#### 8.6.2 Stoc Critic
- Materiale cu cantitate sub nivelul critic (urgent)
- Acțiune obligatorie: Comandă urgentă

#### 8.6.3 Expirări Apropiate
- Materiale care expiră în următoarele 30/60/90 zile
- Acțiune: Folosire prioritară sau returnare la furnizor

#### 8.6.4 Materiale Expirate
- Produse cu data de expirare depășită
- Acțiune: Eliminare din stoc, procedură de casare

**Gestionarea alertelor:**
1. Click pe alertă pentru detalii
2. **Acțiuni disponibile**:
   - Creează comandă de reaprovizionare
   - Marchează pentru utilizare prioritară
   - Inițiază procedură de casare
   - Confirmă alertă (am luat la cunoștință)

### 8.7 Rapoarte Materiale

**Acces:** **"Materiale"** → **"Rapoarte"**

#### 8.7.1 Raport Stocuri

**Informații afișate:**
- Inventar curent pe depozit
- Valoarea totală a stocurilor
- Materiale cu stoc minim/critic
- Distribuție stocuri pe categorii
- Top materiale cu rotație mare/mică

**Filtre disponibile:**
- Depozit specific sau toate
- Categorie material
- Status stoc (OK, Minim, Critic, Expirat)
- Interval valoare

**Export:**
- PDF pentru raportare
- Excel pentru analiză

#### 8.7.2 Raport Prețuri

**Analize prețuri:**
- Evoluția prețurilor în timp
- Prețuri minime, maxime, medii per material
- Varianță prețuri între furnizori
- Oportunități economii

**Utilizare:**
- Negociere cu furnizori
- Bugetare
- Identificare anomalii de preț

#### 8.7.3 Raport Transferuri

**Statistici transferuri:**
- Număr transferuri pe tip și status
- Timp mediu de procesare
- Volumul transferurilor pe rută
- Eficiența procesului

**Analize:**
- Identificare rute frecvente
- Optimizare fluxuri
- Evaluare performanță

#### 8.7.4 Raport Expirări

**Monitorizare expirări:**
- Valoare materiale expirate (pierderi)
- Materiale care expiră în următoarele perioade
- Rata de expirare pe categorie
- Recomandări comenzi

**Configurare:**
- Praguri de alertare personalizabile (30/60/90 zile)
- Filtrare pe categorie/depozit
- Export pentru audit

### 8.8 Import Materiale

**Acces:** **"Materiale"** → **"Import"**

Pentru importul în masă al inventarului:

1. Descărcați șablonul Excel
2. Completați cu datele materialelor
3. Încărcați fișierul
4. Validați datele
5. Confirmați importul

**Coloane obligatorii în șablon:**
- Cod material
- Denumire
- Categorie
- Unitate măsură
- Stoc curent
- Data expirării (pentru materiale care necesită)

---

## 9. Inventarul Vehiculelor

Modul pentru gestionarea echipamentelor și consumabilelor stocate în vehicule (ambulanțe).

### 9.1 Categorii Inventar Vehicul

**Acces:** **"Inventar Vehicule"** → **"Categorii"**

**Categorii tipice:**
- Echipamente Medicale (defibrilator, monitor, oxigen)
- Consumabile Medicale (seringi, comprese, soluții)
- Medicamente (analgezice, cardiotonics, etc.)
- Echipamente de Protecție (mănuși, măști, combinezoane)
- Echipamente Tehnice (scule, piese de schimb)
- Comunicații (radio, telefoane)

**Gestionare categorii:**
- Administratorii pot adăuga/modifica categorii
- Configurare cerințe: expirare, număr serie, certificare

### 9.2 Articole Inventar

**Acces:** **"Inventar Vehicule"** → **"Articole"**

#### 9.2.1 Adăugare Articol

1. Click **"+ Articol Nou"**
2. Completați:
   - **Cod Articol**: Identificator unic (ex: VEQ-001)
   - **Denumire**: Numele articolului
   - **Categorie**: Din lista definită
   - **Descriere**: Detalii tehnice
   - **Producător și Model**
   - **Unitate Măsură**: Buc, Set, etc.
   - **Cantitate Min/Max**: Pentru gestionare stocuri
   - **Preț Standard**: Valoarea de referință
   - **Caracteristici**:
     - Necesită expirare: Da/Nu
     - Necesită serie: Da/Nu
     - Necesită certificare: Da/Nu

3. Click **"Salvează"**

### 9.3 Alocări pe Vehicule

**Acces:** Vehicul → **"Inventar"** sau **"Inventar Vehicule"** → **"Alocări"**

#### 9.3.1 Alocare Echipament

1. Selectați vehiculul
2. Click **"+ Alocă Echipament"**
3. Completați:
   - **Articol**: Ce echipament se alocă
   - **Cantitate**: Câte bucăți
   - **Număr Serie**: Dacă articolul necesită
   - **Lot**: Pentru consumabile
   - **Stare**: Nou, Bună, Uzat
   - **Status**: Activ, Inactiv, În Reparație
   - **Date Achiziție**:
     - Data cumpărării
     - Preț achiziție
     - Furnizor
   - **Data Alocării**: Când s-a montat pe vehicul
   - **Expirare**: Pentru consumabile
   - **Certificări** (dacă aplicabil):
     - Număr certificat
     - Data certificării
     - Data expirării certificării
   - **Inspecții**:
     - Ultima inspecție
     - Următoarea inspecție
   - **Locație**: Unde este montat/stocat în vehicul
   - **Observații**

4. Click **"Salvează"**

#### 9.3.2 Eliminare din Vehicul

Când un echipament se retrage:

1. Accesați alocarea
2. Click **"Elimină"**
3. Completați:
   - **Data Eliminării**
   - **Motiv**: Defect, Expirat, Transfer, Altul
   - **Observații detaliate**

4. Click **"Confirmă"**

### 9.4 Dispensare Consumabile

**Acces:** Vehicul → **"Dispensări"** sau **"Inventar Vehicule"** → **"Dispensări"**

Pentru înregistrarea consumului de materiale la pacienți:

1. Click **"+ Dispensare Nouă"**
2. Completați **datele intervenției**:

   **Vehicul și Echipaj:**
   - Vehicul care a intervenit
   - Dispensat de (paramedic/medic)
   - Data și ora

   **Date Pacient:**
   - Nume pacient (opțional, conform GDPR)
   - Identificator pacient (dacă există)
   - Vârstă
   - Sex
   - Informații medicale relevante

   **Detalii Intervenție:**
   - Tip incident (Accident, Urgență medicală, Transfer, etc.)
   - Locația incidentului
   - Descrierea incidentului
   - Diagnostic prezumtiv
   - Simptome observate
   - Tratament administrat

   **Consumabile Folosite:**
   - Selectați articolul din inventarul vehiculului
   - Cantitate dispensată
   - Lot și expirare (dacă aplicabil)

   **Referințe:**
   - Număr apel/dispecerat
   - ID misiune (dacă există)
   - Observații suplimentare

3. Click **"Salvează"**

**Sistemul va:**
- Scădea automat cantitatea din inventarul vehiculului
- Genera alertă dacă stocul scade sub minim
- Înregistra istoric pentru raportare și audit

### 9.5 Inspecții Inventar Vehicul

**Acces:** Vehicul → **"Inspecții Inventar"**

Pentru verificarea periodică a echipamentelor:

1. Click **"+ Inspecție Nouă"**
2. Selectați:
   - **Data Inspecției**
   - **Inspector**: Cine efectuează verificarea
   - **Tip Inspecție**: Zilnică, Săptămânală, Lunară, Anuală, Ad-hoc

3. Pentru fiecare **articol alocat**:
   - Verificați **prezența**: Da/Nu
   - Verificați **starea**: Bună, Uzată, Defectă
   - Verificați **cantitatea**: Dacă corespunde cu evidența
   - Verificați **expirarea**: Pentru consumabile
   - **Note**: Observații specifice

4. **Probleme Identificate**:
   - Listați articolele lipsă
   - Listați articolele defecte
   - Listați articolele expirate
   - Acțiuni recomandate

5. **Aprobare**:
   - Inspector semnează (confirmare)
   - Supervizor (opțional)

6. Click **"Finalizează Inspecția"**

**După inspecție:**
- Sistemul generează raport de inspecție
- Se creează automat task-uri pentru remedieri
- Alertează managementul despre problemele critice

### 9.6 Rapoarte Inventar Vehicule

**Rapoarte disponibile:**

#### 9.6.1 Raport Dotare Vehicule
- Lista completă echipamente per vehicul
- Comparație cu standardele de dotare
- Identificare lipsuri
- Valoarea inventarului per vehicul

#### 9.6.2 Raport Consumuri
- Consumabile folosite per vehicul/perioadă
- Top consumuri pe categorie
- Costuri consumabile
- Tendințe utilizare

#### 9.6.3 Raport Inspecții
- Istoric inspecții efectuate
- Probleme identificate și rezolvate
- Conformitate cu programul de inspecții
- Vehicule cu inspecții restante

---

## 10. Rapoarte și Analize

### 10.1 Acces Rapoarte

**Meniu principal → "Rapoarte"**

Sistemul oferă rapoarte comprehensive pentru toate modulele.

### 10.2 Tipuri de Rapoarte

#### 10.2.1 Prezentare Generală Flotă

**Informații incluse:**
- Total vehicule și distribuția pe statusuri
- Vehicule pe locații
- Vehicule pe tipuri
- Vehicule pe departamente
- Vârsta medie a flotei
- Kilometraj total și mediu

**Grafice:**
- Distribuție vehicule pe brand
- Distribuție pe tip combustibil
- Evoluție achiziții în timp

#### 10.2.2 Analiză Mentenanță

**Indicatori cheie:**
- Total ordine lucru (pe perioade)
- Costuri totale mentenanță
- Cost mediu per vehicul
- Timp mediu de execuție
- Rate finalizare la timp
- Top vehicule cu cele mai multe defecțiuni

**Analize:**
- Tendințe costuri mentenanță
- Analiza costurilor pe tip mentenanță
- Vehicule problematice
- Eficiență mentenanță preventivă vs. corectivă

#### 10.2.3 Performanța Flotei

**Metrici operaționali:**
- Disponibilitate vehicule (% timp operațional)
- Timp de imobilizare
- Utilizare vehicule (km parcurși)
- Eficiență consumului combustibil
- Costuri operaționale per km

**Comparații:**
- Performanță vehicul vs. medie flotă
- Evoluție indicatori în timp
- Benchmarking între vehicule similare

#### 10.2.4 Analiză Costuri

**Categorii de costuri:**
- Costuri combustibil
- Costuri mentenanță (piese și manoperă)
- Costuri asigurări
- Costuri taxe și impozite
- Alte costuri operaționale

**Analize:**
- Cost total per vehicul
- Cost per km parcurs
- Distribuția costurilor pe categorii
- Comparații cu bugete
- Proiecții costuri

#### 10.2.5 Metrici de Performanță

**KPI-uri afișate:**
- Utilizare flotă (%)
- Disponibilitate (%)
- Fiabilitate vehicule (MTBF - Mean Time Between Failures)
- Eficiență combustibil (km/l)
- Cost per km
- Vârstă medie flotă
- Rata de mentenanță preventivă

**Tendințe:**
- Evoluție KPI-uri în timp
- Comparații cu ținte
- Identificare zone de îmbunătățire

#### 10.2.6 Rezumat Executiv

**Raport de management** cu:
- Rezumat general stare flotă
- Indicatori cheie (top 10 KPI-uri)
- Alerte și probleme critice
- Realizări perioada
- Recomandări acțiuni
- Comparații cu perioada anterioară

**Destinat:** Management de nivel superior pentru decizii strategice

### 10.3 Utilizarea Rapoartelor

#### 10.3.1 Filtrare Date

Pentru toate rapoartele puteți configura:

**Perioade:**
- Ultimele 7 zile
- Ultimele 30 zile
- Ultimele 90 zile
- Ultimul an
- Perioadă personalizată (selectați start și sfârșit)

**Filtre specifice:**
- Vehicule specifice sau toată flota
- Locații
- Departamente
- Tipuri vehicule
- Statusuri

#### 10.3.2 Vizualizări

**Moduri de afișare:**
- **Tabele**: Date detaliate, sortabile, paginare
- **Grafice**:
  - Bare (comparații)
  - Linii (tendințe)
  - Pie/Donut (distribuții)
  - Aria (evoluție multipli indicatori)
- **Carduri statistice**: Valori sumare importante

**Interactivitate:**
- Click pe grafice pentru detalii
- Hover pentru tooltips cu informații
- Zoom pe perioade
- Legendă click pentru ascundere serii

#### 10.3.3 Export Rapoarte

**Formate disponibile:**

1. **PDF**:
   - Layout profesional pentru printare
   - Include grafice și tabele
   - Antet cu logo și date organizație
   - Footer cu data generării

2. **Excel**:
   - Date brute pentru analiză ulterioară
   - Multiple foi pentru secțiuni diferite
   - Formule calculate
   - Formatare condiționată

3. **CSV**:
   - Date brute simple
   - Import în alte sisteme
   - Analiză cu alte tool-uri

**Cum exportați:**
1. Configurați raportul (filtre, perioade)
2. Click pe butonul **"Export"**
3. Selectați formatul dorit
4. Raportul se descarcă automat

#### 10.3.4 Rapoarte Programate (Feature viitor)

Opțiune pentru generarea și trimiterea automată de rapoarte:
- Configurare frecvență (zilnic, săptămânal, lunar)
- Selectare destinatari email
- Alegere format (PDF/Excel)
- Personalizare conținut

---

## 11. Administrare

**Acces:** Meniu → **"Admin"** (doar pentru utilizatori cu rol **Administrator**)

### 11.1 Gestionare Utilizatori

**Acces:** **"Admin"** → **"Utilizatori"**

#### 11.1.1 Lista Utilizatori

**Informații afișate:**
- Nume utilizator
- Email și telefon
- Rol (Admin, Manager, Operator)
- Status (Activ/Inactiv)
- Data creării
- Ultimul login

**Funcții disponibile:**
- Căutare utilizatori
- Filtrare după rol și status
- Sortare

#### 11.1.2 Adăugare Utilizator Nou

1. Click **"+ Utilizator Nou"**
2. Completați formularul:
   - **Nume Complet**: Prenume și nume
   - **Email**: Adresa de email (va fi username)
   - **Telefon**: Număr contact
   - **Rol**: Selectați:
     - **Admin**: Acces complet, poate gestiona utilizatori și date de referință
     - **Manager**: Poate gestiona date operaționale, aproba solicitări
     - **Operator**: Acces limitat, introducere date zilnice
   - **PIN**: Setați PIN-ul inițial (minim 4 cifre)
   - **Departament**: Departamentul de încadrare
   - **Status**: Activ (poate accesa) sau Inactiv (blocat)

3. Click **"Creează Utilizator"**

**Notă:** Utilizatorul va primi email cu detaliile de acces (dacă funcția email este activată).

#### 11.1.3 Editare Utilizator

1. Click pe utilizatorul din listă
2. Modificați informațiile necesare:
   - Date contact
   - Rol (promovare/retrogradare)
   - Status (activare/dezactivare)
   - Departament

3. Click **"Salvează"**

#### 11.1.4 Resetare PIN

Pentru utilizatori care au uitat PIN-ul:

1. Accesați utilizatorul
2. Click **"Resetează PIN"**
3. Introduceți noul PIN
4. Confirmați
5. Click **"Salvează"**

**Opțional:** Bifați "Forțează schimbare PIN la următorul login" pentru securitate.

#### 11.1.5 Dezactivare Utilizator

Pentru utilizatori care nu mai trebuie să aibă acces:

1. Accesați utilizatorul
2. Schimbați Status în **"Inactiv"**
3. Salvați

**Notă:** Contul rămâne în sistem (istoric), dar utilizatorul nu se mai poate autentifica.

### 11.2 Date de Referință

**Acces:** **"Admin"** → **"Date Referință"**

Gestionarea listelor de valori folosite în întreg sistemul.

#### 11.2.1 Mărci Vehicule

**Gestionare mărci** (Mercedes, Ford, Volkswagen, etc.):

1. Accesați **"Date Referință"** → **"Mărci"**
2. Click **"+ Marcă Nouă"**
3. Introduceți:
   - **Cod Marcă**: Cod scurt (ex: MERC, FORD)
   - **Nume Marcă**: Numele complet
   - **Țară Origine**: Unde se produce
   - **Descriere**: Detalii suplimentare
   - **Status**: Activ/Inactiv

4. Click **"Salvează"**

**Editare/Ștergere:**
- Click pe marcă → Editează → Salvează
- Click Șterge (doar dacă nu sunt vehicule asociate)

#### 11.2.2 Modele Vehicule

**Gestionare modele** (Sprinter, Transit, etc.):

1. Accesați **"Modele"**
2. Click **"+ Model Nou"**
3. Completați:
   - **Marcă**: Selectați marca (relație parent)
   - **Cod Model**: Cod identificare
   - **Nume Model**: Numele modelului
   - **Tip Caroserie**: Van, SUV, Sedan, etc.
   - **Ani Producție**: Perioada de fabricație
   - **Descriere**

4. Salvați

**Notă:** Modelele sunt legate de mărci. Când selectați marca la un vehicul, vor apărea doar modelele acelei mărci.

#### 11.2.3 Tipuri Vehicule

**Gestionare tipuri** (Ambulanță Tip A, B, C, etc.):

Definește categoriile de vehicule din flotă:
- Ambulanță Tip A (Transport pacienți)
- Ambulanță Tip B (Suport vital de bază)
- Ambulanță Tip C (Suport vital avansat)
- SMURD
- Vehicul logistic
- Alte

**Adăugare:**
1. **"Date Referință"** → **"Tipuri Vehicule"**
2. **"+ Tip Nou"**
3. Cod, Denumire, Descriere, Standarde echipare
4. Salvează

#### 11.2.4 Statusuri Vehicule

**Gestionare statusuri operaționale**:
- Activ (Operațional)
- În Mentenanță
- În Reparații
- Rezervat
- Scos din Uz
- În Transfer

**Configurare:**
1. **"Statusuri Vehicule"**
2. Adăugați/Editați statusuri
3. Setați **culoare** pentru fiecare status (pentru identificare vizuală)
4. Setați dacă statusul permite **utilizare operațională**

#### 11.2.5 Tipuri Combustibil

**Gestionare combustibili**:
- Motorină (Diesel)
- Benzină (Unleaded 95, 98, 100)
- GPL (Gaz Petrolier Lichefiat)
- CNG (Gaz Natural Comprimat)
- Electric
- Hybrid

**Configurare:**
1. **"Tipuri Combustibil"**
2. Adăugați tip nou
3. Setați:
   - Cod și denumire
   - Unitate măsură (Litri, kWh)
   - Preț mediu (pentru estimări)
   - Densitate energetică (pentru calcule eficiență)

#### 11.2.6 Locații

**Gestionare puncte operaționale**:

Structură ierarhică pentru organizarea locațiilor:
- Regiune → Județ → Oraș → Punct de lucru

**Adăugare locație:**
1. **"Locații"**
2. **"+ Locație Nouă"**
3. Completați:
   - **Cod Locație**: Identificator (ex: BUC-CENT)
   - **Nume**: Denumirea punctului
   - **Tip**: Sediu central, Punct operațional, Depozit, etc.
   - **Locație Părinte**: Dacă este sub-locație (ex: Punct sub Oraș)
   - **Adresă Completă**
   - **Oraș și Județ**
   - **Coordonate GPS**: Latitudine, Longitudine (pentru hartă)
   - **Contact**: Telefon, email punct
   - **Responsabil**: Șef punct

4. Salvează

**Utilizare:**
- Alocare vehicule la puncte
- Alocare șoferi
- Raportare pe locații
- Vizualizare hartă flotă

#### 11.2.7 Departamente

**Gestionare structură organizațională**:

Departamentele organizației:
- Operațiuni
- Mentenanță
- Logistică
- Administrativ
- Management
- etc.

**Configurare:**
1. **"Departamente"**
2. Adăugați departamente
3. Setați:
   - Cod și denumire
   - Departament părinte (pentru ierarhii)
   - Șef departament
   - Buget (opțional)
   - Contact

**Utilizare:**
- Alocare utilizatori
- Alocare vehicule și resurse
- Raportare pe departamente
- Gestionare bugete

#### 11.2.8 Orașe

**Bază de date orașe**:

Pentru standardizarea adreselor:
1. **"Orașe"**
2. Importați lista orașelor sau adăugați manual
3. Informații:
   - Nume oraș
   - Județ
   - Regiune
   - Țară
   - Cod poștal

#### 11.2.9 Furnizori

**Bază de date furnizori și parteneri**:

1. **"Furnizori"**
2. **"+ Furnizor Nou"**
3. Completați:
   - **Cod Furnizor**: Identificator (ex: FURN-001)
   - **Nume Companie**: Denumirea oficială
   - **Tip**: Service auto, Furnizor piese, Stație combustibil, etc.
   - **CUI/CIF**: Cod identificare fiscală
   - **Nr. Reg. Com.**: Număr registru comerțului
   - **Adresă Completă**
   - **Contact**:
     - Persoană contact
     - Telefon, email
     - Website
   - **Date Bancare**:
     - IBAN
     - Bancă
   - **Condiții Comerciale**:
     - Discount acordat
     - Termen plată
     - Zile credit
   - **Observații**

4. Salvează

**Utilizare:**
- Selectare furnizori în comenzi
- Urmărire facturi
- Evaluare furnizori
- Rapoarte achiziții

#### 11.2.10 Unități de Măsură Materiale

**Gestionare unități personalizate**:

Pentru materiale medicale și consumabile:
- Pastilă / Pastile
- Fiolă / Fiole
- Seringă / Seringi
- Cutie / Cutii
- Litru / Litri
- Bucată / Bucăți
- Set / Seturi

**Configurare:**
1. **"Unități Măsură"**
2. **"+ Unitate Nouă"**
3. Setați:
   - **Cod**: Identificator (ex: PAST, FIOLE)
   - **Denumire Singular**: Pastilă
   - **Denumire Plural**: Pastile
   - **Abreviere**: past., fiole
   - **Descriere**: Explicație utilizare

4. Salvează

**Utilizare:**
- Sistemul va folosi automat forma corectă (singular/plural) în interfață

### 11.3 Gestionare Date de Referință - Operațiuni în Masă

Pentru **toate tipurile de date de referință**, administratorii pot efectua:

**Operațiuni disponibile:**

1. **Căutare și Filtrare**:
   - Căutare text în toate câmpurile
   - Filtrare după status (Activ/Inactiv)
   - Sortare după orice coloană

2. **Activare/Dezactivare în Masă**:
   - Selectați multiple înregistrări (checkbox)
   - Click **"Acțiuni"** → **"Activează"** sau **"Dezactivează"**
   - Confirmați

3. **Export Date**:
   - Click **"Export"**
   - Selectați format (Excel, CSV)
   - Toate datele filtrate se exportă

4. **Import Date** (pentru unele tipuri):
   - Descărcați șablon
   - Completați în Excel
   - Încărcați fișier
   - Validare și confirmare import

**Notă:** Datele inactive nu mai apar în liste dropdown, dar rămân în sistem pentru istoric.

---

## 12. Roluri și Permisiuni

### 12.1 Tipuri de Roluri

Sistemul MedFMS are 3 roluri principale cu permisiuni diferențiate:

#### 12.1.1 Administrator

**Acces Complet** la toate funcționalitățile sistemului.

**Permisiuni:**
✅ Toate operațiunile Operator și Manager
✅ Gestionare utilizatori (create, edit, delete, reset PIN)
✅ Gestionare date de referință (toate tipurile)
✅ Configurări sistem
✅ Vizualizare audit logs
✅ Acces la toate datele din toate departamentele
✅ Export complet date
✅ Ștergere înregistrări (vehicule, șoferi, etc.)

**Utilizare tipică:**
- Director IT
- Administrator sistem
- Responsabil implementare

#### 12.1.2 Manager

**Acces Operațional Complet** cu drepturi de aprobare.

**Permisiuni:**
✅ Toate operațiunile Operator
✅ Aprobare tranzacții combustibil
✅ Aprobare ordine de mentenanță
✅ Aprobare cereri de transfer materiale
✅ Vizualizare toate rapoartele
✅ Export rapoarte complete
✅ Adăugare/editare vehicule, șoferi
✅ Adăugare/editare materiale și depozite
✅ Gestionare complete module operaționale
✅ Vizualizare date din toate departamentele (cross-departament)

❌ Gestionare utilizatori
❌ Modificare date de referință
❌ Ștergere înregistrări majore

**Utilizare tipică:**
- Director Operațiuni
- Șef Departament Logistică
- Coordinator Flotă
- Responsabil Mentenanță

#### 12.1.3 Operator

**Acces Operațional de Bază** pentru introducerea zilnică a datelor.

**Permisiuni:**
✅ Vizualizare vehicule, șoferi, materiale
✅ Adăugare tranzacții combustibil (status: în așteptare)
✅ Creare ordine de mentenanță (status: în așteptare)
✅ Creare cereri de transfer materiale
✅ Înregistrare consumuri materiale
✅ Înregistrare dispensări inventar vehicule
✅ Vizualizare rapoarte de bază
✅ Editare propriul profil și schimbare PIN

❌ Aprobare tranzacții/ordine/transferuri
❌ Modificare vehicule și date master
❌ Ștergere date
❌ Acces la module administrare
❌ Export date complete
❌ Vizualizare date din alte departamente (doar departamentul propriu)

**Utilizare tipică:**
- Operator dispecerat
- Tehnician mentenanță (introducere date lucrări)
- Gestionar depozit (mișcări materiale)
- Personal operațional

### 12.2 Matrice Permisiuni Detaliate

| Funcționalitate | Admin | Manager | Operator |
|-----------------|-------|---------|----------|
| **VEHICULE** |
| Vizualizare vehicule | ✅ | ✅ | ✅ (doar departament) |
| Adăugare vehicule | ✅ | ✅ | ❌ |
| Editare vehicule | ✅ | ✅ | ❌ |
| Ștergere vehicule | ✅ | ❌ | ❌ |
| Upload documente/fotografii | ✅ | ✅ | ✅ |
| **ȘOFERI** |
| Vizualizare șoferi | ✅ | ✅ | ✅ |
| Adăugare/Editare șoferi | ✅ | ✅ | ❌ |
| Ștergere șoferi | ✅ | ❌ | ❌ |
| **COMBUSTIBIL** |
| Înregistrare alimentări | ✅ | ✅ | ✅ (status: pending) |
| Aprobare alimentări | ✅ | ✅ | ❌ |
| Vizualizare rapoarte combustibil | ✅ | ✅ | ✅ (bază) |
| Import UTA | ✅ | ✅ | ❌ |
| Gestionare stații | ✅ | ✅ | ❌ |
| **MENTENANȚĂ** |
| Creare ordine lucru | ✅ | ✅ | ✅ (status: pending) |
| Aprobare ordine | ✅ | ✅ | ❌ |
| Actualizare ordine (în progres) | ✅ | ✅ | ✅ |
| Finalizare ordine | ✅ | ✅ | ✅ |
| Ștergere ordine | ✅ | ❌ | ❌ |
| Gestionare programări | ✅ | ✅ | ❌ |
| Vizualizare rapoarte mentenanță | ✅ | ✅ | ✅ (bază) |
| **MATERIALE & DEPOZITE** |
| Vizualizare materiale | ✅ | ✅ | ✅ |
| Adăugare/Editare materiale | ✅ | ✅ | ❌ |
| Ștergere materiale | ✅ | ❌ | ❌ |
| Înregistrare intrări/ieșiri | ✅ | ✅ | ✅ |
| Creare cereri transfer | ✅ | ✅ | ✅ |
| Aprobare cereri transfer | ✅ | ✅ | ❌ |
| Execuție transferuri | ✅ | ✅ | ✅ |
| Gestionare depozite | ✅ | ✅ | ❌ |
| Vizualizare rapoarte materiale | ✅ | ✅ | ✅ (bază) |
| Import materiale | ✅ | ✅ | ❌ |
| **INVENTAR VEHICULE** |
| Vizualizare inventar | ✅ | ✅ | ✅ |
| Alocare echipamente | ✅ | ✅ | ✅ |
| Dispensare consumabile | ✅ | ✅ | ✅ |
| Gestionare categorii | ✅ | ❌ | ❌ |
| Efectuare inspecții | ✅ | ✅ | ✅ |
| **RAPOARTE** |
| Rapoarte operaționale | ✅ | ✅ | ✅ (bază) |
| Rapoarte analitice complexe | ✅ | ✅ | ❌ |
| Rapoarte executive | ✅ | ✅ | ❌ |
| Export PDF | ✅ | ✅ | ✅ |
| Export Excel complet | ✅ | ✅ | ❌ |
| **ADMINISTRARE** |
| Gestionare utilizatori | ✅ | ❌ | ❌ |
| Resetare PIN utilizatori | ✅ | ❌ | ❌ |
| Gestionare date referință | ✅ | ❌ | ❌ |
| Configurări sistem | ✅ | ❌ | ❌ |
| Audit logs | ✅ | ❌ | ❌ |

### 12.3 Bune Practici Securitate

**Pentru Administratori:**
1. ✅ Creați conturi separate pentru fiecare utilizator (nu partajați credențiale)
2. ✅ Acordați cel mai mic rol necesar pentru taskurile utilizatorului
3. ✅ Revizuiți periodic utilizatorii activi și dezactivați conturile neutilizate
4. ✅ Folosiți PIN-uri puternice (minim 6 cifre recomandat)
5. ✅ Forțați schimbarea PIN-ului la prima autentificare pentru utilizatori noi
6. ✅ Monitorizați audit log-urile pentru activități neobișnuite

**Pentru Toți Utilizatorii:**
1. ✅ Nu partajați PIN-ul cu alte persoane
2. ✅ Deconectați-vă când părăsiți calculatorul
3. ✅ Schimbați PIN-ul periodic (recomandat: la 3 luni)
4. ✅ Nu notați PIN-ul pe hârtie sau în fișiere nesecurizate
5. ✅ Raportați imediat administratorului dacă suspectați că PIN-ul a fost compromis

---

## 13. Întrebări Frecvente (FAQ)

### 13.1 Autentificare și Acces

**Î: Am uitat PIN-ul. Ce fac?**
R: Contactați administratorul de sistem pentru resetarea PIN-ului. Doar administratorii pot reseta PIN-urile.

**Î: Pot să-mi schimb singur PIN-ul?**
R: Da. Accesați Profil → Schimbă PIN și urmați pașii.

**Î: De ce nu mă pot autentifica deși PIN-ul este corect?**
R: Verificați dacă contul este activ. Contactați administratorul - contul poate fi dezactivat.

### 13.2 Vehicule

**Î: Cum adaug fotografii la un vehicul?**
R: Accesați vehiculul → Secțiunea "Fotografii" → "+ Adaugă Fotografie" → Selectați categoria și fișierul.

**Î: Pot șterge un vehicul?**
R: Doar administratorii pot șterge vehicule. Utilizați funcția "Inactiv" în loc de ștergere pentru păstrarea istoricului.

**Î: Ce înseamnă "ANMDM" în detaliile vehiculului?**
R: ANMDM = Autoritatea Națională pentru Administrare și Reglementare în Transporturi. Aici se introduc detaliile avizelor/autorizațiilor de transport sanitar.

### 13.3 Combustibil

**Î: De ce tranzacția mea de combustibil este "În așteptare"?**
R: Operatorii pot doar crea tranzacții care necesită aprobare. Un Manager sau Administrator trebuie să le aprobe.

**Î: Cum se calculează consumul mediu?**
R: Sistem: Total litri / Total kilometri parcurși = litri/100km sau km/litru, în funcție de setări.

**Î: Pot modifica o tranzacție după ce a fost aprobată?**
R: Nu direct. Contactați un Manager sau Administrator pentru modificări după aprobare.

### 13.4 Mentenanță

**Î: Diferența dintre "Service periodic" și "Reparație"?**
R: Service periodic = mentenanță preventivă planificată. Reparație = intervenție corectivă pentru defecțiuni.

**Î: Cum setez mentenanța recurentă?**
R: Accesați Mentenanță → Programări → "+ Programare Nouă" și configurați intervalul (zile/km/ore).

**Î: Pot atașa facturi la ordine de lucru?**
R: Da. În pagina ordinului → Secțiunea "Fișiere" → "+ Adaugă Fișier" → Selectați "Factură".

### 13.5 Materiale și Depozite

**Î: De ce trebuie să introduc data expirării pentru toate materialele din depozit?**
R: Pentru siguranța pacienților și conformitate, toate materialele medicale trebuie să aibă data expirării monitorizată.

**Î: Cum mă notifică sistemul despre stocurile mici?**
R: Accesați Materiale → Alerte. Veți vedea toate materialele sub nivelul minim sau critic.

**Î: Pot transfera direct între depozite sau trebuie cerere?**
R: Depinde de politica organizației. În general, se recomandă cereri pentru audit trail, dar transferurile simple pot fi făcute direct cu drepturile potrivite.

**Î: Ce fac cu materialele expirate?**
R: Marcați-le în sistem (ieșire cu motiv "Expirat"), generați raport pentru casare conform procedurilor organizației.

### 13.6 Rapoarte

**Î: Cum exportez un raport în Excel?**
R: Deschideți raportul → Click "Export" → Selectați "Excel" → Fișierul se descarcă automat.

**Î: Pot programa rapoarte automate?**
R: Funcționalitatea de rapoarte programate este în dezvoltare. Momentan, rapoartele trebuie generate manual.

**Î: De ce nu văd date pentru toate vehiculele în raport?**
R: Verificați filtrele aplicate și drepturile dvs. Operatorii văd doar datele din propriul departament.

### 13.7 Probleme Tehnice

**Î: Pagina se încarcă lent. Ce pot face?**
R:
- Verificați conexiunea la internet
- Închideți alte tab-uri ale browserului
- Ștergeți cache-ul browserului
- Dacă problema persistă, contactați IT

**Î: Nu pot încărca un fișier. Ce se întâmplă?**
R:
- Verificați dimensiunea (max 5MB pentru imagini, 10MB pentru documente)
- Verificați formatul (PDF, JPG, PNG, DOC acceptate)
- Încercați alt browser
- Verificați conexiunea la internet

**Î: Am introdus date greșite. Pot anula?**
R: Depinde de tipul datei și statusul. Pentru tranzacții în așteptare, le puteți șterge. Pentru date aprobate, contactați Manager/Administrator.

---

## 14. Suport și Asistență

### 14.1 Contact Suport Tehnic

Pentru probleme tehnice, bug-uri sau întrebări:

**Email:** support@medfms.ro
**Telefon:** [Număr suport]
**Program:** Luni-Vineri, 08:00 - 17:00

### 14.2 Solicitări Funcționalități Noi

Pentru sugestii de îmbunătățire sau funcționalități noi:

**Email:** feedback@medfms.ro

Vă rugăm includeți:
- Descrierea detaliată a funcționalității dorite
- Cazul de utilizare (de ce este necesară)
- Prioritatea (critică, importantă, nice-to-have)

### 14.3 Raportare Probleme

Când raportați o problemă, includeți:

1. **Descrierea problemei**: Ce s-a întâmplat
2. **Pașii de reproducere**: Cum se ajunge la problemă
3. **Comportament așteptat**: Ce ar trebui să se întâmple
4. **Browser și versiune**: Chrome 120, Firefox 121, etc.
5. **Capturi ecran**: Dacă sunt relevante
6. **Data și ora**: Când s-a întâmplat

### 14.4 Documentație Suplimentară

**Portal Documentație:** https://docs.medfms.ro
- Tutoriale video
- Ghiduri pas-cu-pas
- Bune practici
- Update notes (noutăți versiuni)

### 14.5 Training

Pentru sesiuni de training:
- Training inițial: La implementare, pentru toți utilizatorii
- Training personalizat: La cerere pentru module specifice
- Webinare: Lunar, pentru funcționalități noi

Contactați departamentul de suport pentru programare.

---

## 15. Glosar Termeni

**Alocare**: Asignarea unui echipament sau material unui vehicul sau utilizator

**Aprobare**: Validarea unei solicitări de către un utilizator cu drepturi (Manager/Admin)

**Aviz ANMDM**: Autorizație de transport sanitar eliberată de autoritate

**Cerere Transfer**: Solicitare pentru mutarea materialelor între locații

**CUI/CIF**: Cod Unic de Identificare / Cod Identificare Fiscală

**Dispensare**: Folosirea consumabilelor medicale la pacienți

**Depozit**: Locație fizică de stocare materiale

**ITP**: Inspecție Tehnică Periodică

**KPI**: Key Performance Indicator (Indicator Cheie de Performanță)

**Lot**: Număr de identificare pentru un grup de produse fabricate împreună

**Mentenanță Preventivă**: Mentenanță planificată pentru prevenirea defectelor

**Mentenanță Corectivă**: Reparații efectuate după apariția defectului

**MTBF**: Mean Time Between Failures (Timp Mediu Între Defecțiuni)

**Număr Serie**: Identificator unic al unui produs individual

**Odometru**: Dispozitiv care măsoară kilometrii parcurși

**Ordin de Lucru**: Document care autorizează și urmărește o lucrare de mentenanță

**PIN**: Personal Identification Number (Cod de Acces Personal)

**Stoc Critic**: Nivel de stoc sub care se generează alertă urgentă

**Stoc Minim**: Nivel de stoc sub care trebuie reaprovizionat

**Status**: Starea curentă (Activ, În așteptare, Finalizat, etc.)

**Transfer**: Mutarea fizică a materialelor între locații

**UTA**: Card de combustibil pentru flote

**VIN**: Vehicle Identification Number (Număr Identificare Vehicul/Șasiu)

---

## 16. Anexe

### 16.1 Scurtături Tastatură

| Acțiune | Scurtătură |
|---------|-----------|
| Căutare rapidă | Ctrl + K |
| Salvare formular | Ctrl + S |
| Anulare | Esc |
| Navigare înapoi | Alt + ← |
| Navigare înainte | Alt + → |
| Refresh pagină | F5 |
| Profil utilizator | Alt + P |
| Deconectare | Alt + L |

### 16.2 Formate Acceptate Fișiere

**Documente:**
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Text (.txt)

**Imagini:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)

**Dimensiuni maxime:**
- Imagini: 5 MB
- Documente: 10 MB

### 16.3 Browsere Suportate

**Recomandate:**
- Google Chrome (ultimele 2 versiuni)
- Mozilla Firefox (ultimele 2 versiuni)
- Microsoft Edge (ultimele 2 versiuni)

**Compatibile:**
- Safari (ultimele 2 versiuni)
- Opera (ultimele 2 versiuni)

**Notă:** Pentru experiență optimă, folosiți ultimele versiuni ale browserelor.

### 16.4 Cerințe Sistem

**Minim:**
- Procesor: Dual Core 2.0 GHz
- RAM: 4 GB
- Rezoluție ecran: 1366x768
- Conexiune internet: 2 Mbps

**Recomandat:**
- Procesor: Quad Core 2.5 GHz+
- RAM: 8 GB+
- Rezoluție ecran: 1920x1080+
- Conexiune internet: 10 Mbps+

---

## 17. Note Finale

### 17.1 Actualizări Manual

Acest manual este actualizat periodic pentru a reflecta noile funcționalități și îmbunătățiri.

**Verificați versiunea:**
- Data actualizării este menționată pe prima pagină
- Versiunea actuală: 1.0

**Obțineți ultima versiune:**
- Portal documentație: https://docs.medfms.ro
- Sau contactați suportul tehnic

### 17.2 Feedback

Feedback-ul dvs. ne ajută să îmbunătățim atât sistemul, cât și documentația.

Dacă aveți sugestii pentru:
- Clarificări în manual
- Secțiuni suplimentare necesare
- Erori sau informații învechite

Vă rugăm trimiteți-ne un email la: feedback@medfms.ro

### 17.3 Mulțumiri

Vă mulțumim pentru utilizarea sistemului MedFMS. Echipa noastră este dedicată să vă ofere cele mai bune instrumente pentru gestionarea eficientă a flotei medicale.

---

**© 2025 MedFMS - Medical Fleet Management System**
**Toate drepturile rezervate**

---

*Acest document este proprietate intelectuală și confidențială. Nu distribuiți fără autorizare.*
