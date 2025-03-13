# 🌠 NgxDataPulse 🌠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Boîte à outils Angular 18+ pour vous faciliter la vie dans tous types de projets.

⚠️ Package en cours de développement, les fonctionnalités sont susceptibles d'évoluer.

## 🔧 Installation et Configuration

### Installation via NPM

```bash
npm i ngx-data-pulse
```

## Initialisation de la bibliothèque

Pour utiliser ngx-data-pulse, vous devez initialiser la bibliothèque dans votre application Angular.

### Dans un projet Angular standalone

Dans votre fichier `main.ts` :

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { provideNgxDataPulse } from "ngx-data-pulse";

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, provideNgxDataPulse()],
}).catch((err) => console.error(err));
```

## 💻 Compatibilité

- Angular 18+
- TypeScript 5.4+

## 🚀 Fonctionnalités

- [API](#-service-dapi) : Service complet pour gérer les appels HTTP avec gestion de l'authentification et des erreurs.
- [Storage](#-service-de-stockage) : Service de stockage local avancé avec gestion de l'expiration et du chiffrement.
- [Modal](#-service-modal) : Service de gestion des modals.
- [Notification](#-service-de-notification) : Service de notification personnalisable.
- [Events](#-service-dévénements) : Service de gestion d'événements global avec historique.
- [Date](#-service-de-dates) : Service de manipulation de dates.
- [Number](#-service-de-nombres) : Service de manipulation de nombres.
- [Pipes](#-les-pipes-ngx-data-pulse) : Pipes pour formater des données directement dans le template (date, number, currency, etc.).
- [Network](#-service-réseau) : Service de vérification de la connexion réseau.
- [Idle](#-service-dinactivité) : Service de détection de l'inactivité de l'utilisateur.
- [SEO](#-service-seo) : Service de gestion des métadonnées SEO.
- [Navigation](#-service-de-navigation) : Service de gestion de la navigation.
- [Loader](#-service-de-loader) : Service de gestion des loaders personnalisés.
- [Scroller](#-service-de-scroll) : Service de gestion du défilement.
- [Platform](#-service-de-plateforme) : Service de gestion et détection de la plateforme.

## 🚀 Service d'API

#### Utilisation Simple

```typescript
import { api } from "ngx-data-pulse";

// Création d'un signal pour les appels API
const usersApi = api.get<User[]>();

// Dans votre composant
@Component({
  template: `
    <div *ngIf="usersApi.loading()">Chargement...</div>
    <div *ngIf="usersApi.error()">{{ usersApi.error()?.message }}</div>
    <ul *ngIf="usersApi.data()">
      <li *ngFor="let user of usersApi.data()">{{ user.name }}</li>
    </ul>
  `,
})
export class UsersComponent {
  constructor() {
    // Exécution de la requête
    this.usersApi.execute("/users");
  }
}
```

#### Exemple Concret : Profil Utilisateur

```typescript
// Interface de notre modèle
interface User {
  id: number;
  name: string;
  email: string;
}

// Composant de profil utilisateur
@Component({
  selector: "app-user-profile",
  template: `
    <!-- Affichage du loader -->
    <div *ngIf="userApi.loading()">Chargement du profil...</div>

    <!-- Affichage des erreurs -->
    <div *ngIf="userApi.error()" class="error">
      {{ userApi.error()?.message }}
    </div>

    <!-- Affichage des données -->
    <div *ngIf="userApi.data()" class="profile">
      <h2>{{ userApi.data()?.name }}</h2>
      <p>Email: {{ userApi.data()?.email }}</p>
      <p>ID: {{ userApi.data()?.id }}</p>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  // Création du signal API
  userApi = api.get<User>();

  async ngOnInit() {
    try {
      // Appel API pour récupérer l'utilisateur 123
      await this.userApi.execute("/users/123");
    } catch (error) {
      console.error("Erreur lors de la récupération du profil");
    }
  }
}
```

#### Méthodes HTTP disponibles

```typescript
// GET
const getUsers = api.get<User[]>();
await getUsers.execute("/users");

// POST avec body typé
const createUser = api.post<User, CreateUserDto>();
await createUser.execute("/users", {
  name: "John",
  email: "john@example.com",
});

// PUT avec body typé
const updateUser = api.put<User, UpdateUserDto>();
await updateUser.execute("/users/123", {
  name: "Jane",
});

// PATCH avec body typé
const patchUser = api.patch<User, Partial<User>>();
await patchUser.execute("/users/123", {
  email: "jane@example.com",
});

// DELETE
const deleteUser = api.delete<void>();
await deleteUser.execute("/users/123");
```

#### Gestion des types de réponse

```typescript
// JSON (par défaut)
const jsonApi = api.get<JsonData>();
await jsonApi.execute("/api/data");

// Texte
const textApi = api.get<string>();
await textApi.execute("/api/text", {}, "text");

// Blob (fichiers)
const fileApi = api.get<Blob>();
await fileApi.execute("/api/file", {}, "blob");

// ArrayBuffer
const binaryApi = api.get<ArrayBuffer>();
await binaryApi.execute("/api/binary", {}, "arraybuffer");
```

#### Gestion de l'authentification

```typescript
// Configuration du token
api.setToken("votre-jwt-token");

// Les appels incluront automatiquement le token
const privateApi = api.get<PrivateData>();
await privateApi.execute("/api/private");

// Déconnexion
api.clearToken();
```

#### Gestion des erreurs

```typescript
const dataApi = api.get<Data>();

try {
  await dataApi.execute("/api/data");
} catch (error) {
  if (dataApi.error()) {
    console.error(`${dataApi.error()?.status}: ${dataApi.error()?.message}`);
  }
}

// Réinitialisation
dataApi.reset();
```

#### États disponibles

Chaque signal API fournit :

- `data()` : Données de la réponse
- `loading()` : État de chargement
- `error()` : Erreur éventuelle
- `status()` : Code HTTP
- `reset()` : Réinitialisation
- `execute()` : Exécution de la requête

## 🚀 Service de Stockage

#### Configuration

```typescript
import { storage } from "ngx-data-pulse";

// Configuration optionnelle
storage.configure({
  prefix: "app_", // Préfixe pour les clés (défaut: 'ngx_')
  encryptionKey: "ma-clé-secrète", // Active le chiffrement
});
```

#### Stockage Simple

```typescript
// Stockage basique
storage.put({
  key: "user",
  data: { id: 1, name: "John" },
});

// Avec durée de vie (TTL)
storage.put({
  key: "session",
  data: { token: "xyz" },
  ttl: 3600, // Expire dans 1 heure
});

// Avec date d'expiration
storage.put({
  key: "promo",
  data: { code: "SUMMER" },
  expiresAt: new Date("2024-12-31").getTime(),
});
```

#### Récupération

```typescript
interface User {
  id: number;
  name: string;
}

// Récupération simple
const user = storage.get<User>("user");
if (user) {
  console.log(user.name); // 'John'
}

// Vérification d'existence
if (storage.has("session")) {
  // La clé existe et n'est pas expirée
}

// Récupération avec métadonnées
const item = storage.getItem<User>("user");
if (item) {
  console.log(item.data.name); // 'John'
  console.log(new Date(item.createdAt)); // Date de création
  console.log(new Date(item.updatedAt)); // Date de modification
}
```

#### Recherche et Filtrage

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

// Récupérer tous les produits
const products = storage.getAll<Product>();

// Recherche avec filtre
const cheapProducts = storage.search<Product>((product) => product.price < 10);
```

#### Mise à jour

```typescript
// Mise à jour des données
storage.update("user", {
  id: 1,
  name: "John Doe", // Nouveau nom
});

// Prolonger la durée de vie
storage.touch("session", 1800); // +30 minutes
```

#### Suppression

```typescript
// Supprimer une entrée
storage.delete("user");

// Supprimer toutes les entrées
storage.reset();
```

#### Exemple Complet

```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

// Configuration avec chiffrement
storage.configure({
  prefix: "myapp_",
  encryptionKey: "clé-très-secrète",
});

// Stockage d'un profil utilisateur
storage.put<UserProfile>({
  key: "profile",
  data: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  },
  ttl: 86400, // Expire dans 24h
});

// Recherche d'administrateurs
const admins = storage.search<UserProfile>(
  (profile) => profile.role === "admin"
);

// Mise à jour du profil
if (storage.has("profile")) {
  const profile = storage.get<UserProfile>("profile");
  if (profile) {
    storage.update("profile", {
      ...profile,
      name: "John Smith",
    });
  }
}

// Nettoyage à la déconnexion
storage.reset();
```

## 🚀 Service de Notification

Le service de notification permet d'afficher des notifications personnalisables dans votre application.

### Configuration

```typescript
import { notif } from "ngx-data-pulse";

// Configuration globale (optionnelle)
notif.configure({
  position: "top-right", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  duration: 5000, // durée en ms
  maxWidth: "400px",
  gap: "10px",
  styles: {
    success: {
      background: "#4caf50",
      color: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    // ... autres styles
  },
  icons: {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  },
});
```

### Utilisation

```typescript
import { notif } from "ngx-data-pulse";

@Component({
  selector: "app-root",
  template: `
    <ngx-notifications></ngx-notifications>
    <button (click)="showNotification()">Afficher</button>
  `,
})
export class AppComponent {
  showNotification() {
    // Notifications prédéfinies
    notif.success("Opération réussie !");
    notif.error("Une erreur est survenue");
    notif.warning("Attention");
    notif.info("Information");

    // Notification personnalisée
    notif.show("Message", {
      type: "success",
      duration: 3000,
      icon: "🚀",
      style: {
        background: "#000",
        color: "#fff",
      },
      closable: true,
    });
  }
}
```

### Exemple Concret : Formulaire de Contact

```typescript
@Component({
  selector: "app-contact",
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="email" name="email" type="email" />
      <button type="submit">Envoyer</button>
    </form>
  `,
})
export class ContactComponent {
  async onSubmit() {
    try {
      await this.sendEmail();
      notif.success("Email envoyé avec succès !");
    } catch (error) {
      notif.error("Erreur lors de l'envoi de l'email");
    }
  }
}
```

## 🚀 Service d'Événements

Le service d'événements permet une communication entre composants sans couplage direct, basée sur les Signals.

### Configuration et Utilisation

````typescript
import { events } from "ngx-data-pulse";

// Définition d'un type d'événement
interface UserEvent {
  id: number;
  name: string;
}

// Création d'un événement typé
const userEvent = events.create<UserEvent>({
  type: "USER_UPDATED",
  initialData: { id: 0, name: "" }, // Optionnel
  keepHistory: true, // Optionnel
  historySize: 5, // Optionnel
});

// Dans un composant émetteur
@Component({
  template: `<button (click)="updateUser()">Mettre à jour</button>`,
})
export class SenderComponent {
  updateUser() {
    userEvent.emit({
      id: 1,
      name: "John Doe",
    });
  }
}

// Dans un composant récepteur
@Component({
  template: `
    <div>Utilisateur : {{ userEvent.data()?.name }}</div>
    <div>Dernière mise à jour : {{ userEvent.lastEmitted() | date }}</div>
  `,
})
export class ReceiverComponent implements OnInit, OnDestroy {
  userEvent = events.create<UserEvent>({ type: "USER_UPDATED" });
  private unsubscribe: () => void;

  ngOnInit() {
    // S'abonner aux changements
    this.unsubscribe = this.userEvent.on((user) => {
      console.log("Utilisateur mis à jour:", user);
    });
  }

  ngOnDestroy() {
    // Se désabonner
    this.unsubscribe();
  }
}

### Gestion de l'Historique

L'historique des événements permet de suivre l'évolution des données dans le temps.

```typescript
// Configuration avec historique
const userEvent = events.create<UserEvent>({
  type: "USER_UPDATED",
  keepHistory: true, // Active l'historique
  historySize: 5, // Limite la taille de l'historique
  initialData: { id: 0, name: "" }, // Données initiales
});

// Composant avec historique
@Component({
  template: `
    <!-- Données actuelles -->
    <div class="current">
      Utilisateur actuel : {{ userEvent.data()?.name }}
      <small>Mis à jour le {{ userEvent.lastEmitted() | date:'short' }}</small>
    </div>

    <!-- Historique des modifications -->
    <div class="history">
      <h3>Historique ({{ userEvent.history().length }} modifications)</h3>

      <div class="timeline">
        @for (user of userEvent.history(); track user.id) {
          <div class="timeline-item">
            <div class="name">{{ user.name }}</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      border-left: 2px solid #ccc;
      padding-left: 1rem;
    }
    .timeline-item {
      margin: 1rem 0;
      padding: 0.5rem;
      border-radius: 4px;
      background: #f5f5f5;
    }
  `]
})
export class UserHistoryComponent {
  userEvent = events.create<UserEvent>({
    type: "USER_UPDATED",
    keepHistory: true,
    historySize: 5
  });

  // Exemple d'utilisation
  updateUser() {
    this.userEvent.emit({
      id: Date.now(),
      name: `John Doe ${new Date().toLocaleTimeString()}`
    });
  }

  // Accès programmatique à l'historique
  logHistory() {
    console.log("Données actuelles:", this.userEvent.data());
    console.log("Historique:", this.userEvent.history());
    console.log("Dernière mise à jour:", new Date(this.userEvent.lastEmitted() || 0));
  }
}
````

#### Fonctionnement de l'Historique

- `keepHistory`: Active la conservation de l'historique
- `historySize`: Nombre maximum d'entrées dans l'historique (par défaut: 10)
- `history()`: Signal contenant le tableau des anciennes valeurs
- `lastEmitted()`: Signal contenant le timestamp de la dernière émission

#### Exemple avec Plusieurs Composants

````typescript
// Composant émetteur
@Component({
  template: `
    <div class="actions">
      <button (click)="updateName('John')">John</button>
      <button (click)="updateName('Jane')">Jane</button>
      <button (click)="updateName('Bob')">Bob</button>
    </div>
  `
})
export class UserEditorComponent {
  userEvent = events.create<UserEvent>({ type: "USER_UPDATED" });

  updateName(name: string) {
    this.userEvent.emit({
      id: Date.now(),
      name: name
    });
  }
}

// Composant d'historique
@Component({
  template: `
    <div class="history-widget">
      <h4>Modifications Récentes</h4>
      <ul class="changes">
        @for (user of userEvent.history().slice().reverse(); track user.id) {
          <li>
            <span class="name">{{ user.name }}</span>
            <span class="time">{{ getRelativeTime(user.id) }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .history-widget {
      border: 1px solid #eee;
      padding: 1rem;
      border-radius: 8px;
    }
    .changes {
      list-style: none;
      padding: 0;
    }
    .changes li {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class UserHistoryWidgetComponent {
  userEvent = events.create<UserEvent>({
    type: "USER_UPDATED",
    keepHistory: true,
    historySize: 5
  });

  getRelativeTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "À l'instant";
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    return new Date(timestamp).toLocaleTimeString();
  }
}

### Nettoyage

```typescript
// Supprimer un événement spécifique
events.remove("USER_UPDATED");

// Supprimer tous les événements
events.clear();
````

## 🚀 Service de Dates

Le service de dates permet de manipuler facilement les dates en français.

```typescript
import { date } from "ngx-data-pulse";

// Formatage de dates
date.format(new Date(), { format: "short" }); // "01/01/2024"
date.format(new Date(), { format: "medium" }); // "1 janvier 2024"
date.format(new Date(), { format: "long" }); // "1 janvier 2024 14:30"
date.format(new Date(), { format: "full" }); // "mardi 1 janvier 2024 14:30:00"

// Calcul de différences
date.diff("2024-01-01", "2024-02-01", { unit: "days" }); // 31
date.diff("2024-01-01", "2025-01-01", { unit: "months" }); // 12

// Temps relatif
date.fromNow("2024-01-01"); // "il y a 2 mois"
date.fromNow(date.add(new Date(), 1, "days")); // "dans 1 jour"

// Vérifications
date.isToday("2024-01-01"); // false
date.isFuture("2025-01-01"); // true
date.isPast("2023-01-01"); // true

// Manipulation
date.add("2024-01-01", 1, "months"); // 2024-02-01
date.subtract("2024-01-01", 1, "years"); // 2023-01-01

// Conversions de formats
date.frToIso("01/01/2024"); // "2024-01-01"
date.isoToFr("2024-01-01"); // "01/01/2024"
date.usToFr("01/31/2024"); // "31/01/2024"
date.frToUs("31/01/2024"); // "01/31/2024"

// Conversions avec timestamps
date.isoToTimestamp("2024-01-01"); // 1704067200000
date.timestampToIso(1704067200000); // "2024-01-01"
date.frToTimestamp("01/01/2024"); // 1704067200000
date.timestampToFr(1704067200000); // "01/01/2024"

// Conversions pour API
date.toApiDate("01/01/2024"); // "2024-01-01T00:00:00.000Z"
date.fromApiDate("2024-01-01T00:00:00.000Z"); // Date object
```

## 🔢 Service de Nombres

Le service de nombres permet de manipuler et formater facilement les nombres en français.

```typescript
import { num } from "ngx-data-pulse";

// Formatage simple
num.format(1234.5678); // "1 234,57"
num.format(1234.5678, { decimals: 3 }); // "1 234,568"
num.format(1234, { forceDecimals: true }); // "1 234,00"

// Formatage monétaire
num.currency(1234.56); // "1 234,56 €"
num.currency(1234.56, { currency: "USD", symbolPosition: "before" }); // "$ 1 234,56"
num.currency(1234.56, { symbolSpace: false }); // "1 234,56€"

// Conversion de devises
num.convert(100, { from: "EUR", to: "USD", rate: 1.1 }); // 110

// Arrondis et troncature
num.round(1234.5678, 2); // 1234.57
num.truncate(1234.5678, 2); // 1234.56

// Parsing
num.parse("1 234,56"); // 1234.56
num.parse("1.234,56", ","); // 1234.56

// Pourcentages
num.percentage(25, 100); // 25
num.percentage(25, 100, 1); // 25.0
```

## ⭐Les Pipes NgX-Data-Pulse

Les pipes sont des composants Angular qui permettent de formater des données directement dans le template.

```typescript
import {
  NumberPipe,
  CurrencyPipe,
  PercentPipe,
  DatePipe,
  FromNowPipe,
  ApiDatePipe,
} from "ngx-data-pulse";

@Component({
  standalone: true,
  imports: [
    NumberPipe,
    CurrencyPipe,
    PercentPipe,
    DatePipe,
    FromNowPipe,
    ApiDatePipe,
  ],
  template: `
    <!-- Formatage de nombres -->
    <div>{{ 1234.5678 | ngxNumber }}</div>
    <!-- "1 234,57" -->
    <div>{{ 1234.5678 | ngxNumber : { decimals: 3 } }}</div>
    <!-- "1 234,568" -->

    <!-- Formatage de devises -->
    <div>{{ 1234.56 | ngxCurrency }}</div>
    <!-- "1 234,56 €" -->
    <div>
      {{
        1234.56 | ngxCurrency : { currency: "USD", symbolPosition: "before" }
      }}
    </div>
    <!-- "$ 1 234,56" -->

    <!-- Pourcentages -->
    <div>{{ 25 | ngxPercent }}</div>
    <!-- "25 %" -->
    <div>{{ 25 | ngxPercent : 100 : 1 }}</div>
    <!-- "25,0 %" -->

    <!-- Formatage de dates -->
    <div>{{ date | ngxDate }}</div>
    <!-- "01/01/2024" -->
    <div>{{ date | ngxDate : { format: "full" } }}</div>
    <!-- "mardi 1 janvier 2024 14:30:00" -->

    <!-- Temps relatif -->
    <div>{{ date | ngxFromNow }}</div>
    <!-- "il y a 2 mois" -->

    <!-- Format API -->
    <div>{{ date | ngxApiDate }}</div>
    <!-- "2024-01-01T00:00:00.000Z" -->
  `,
})
export class AppComponent {
  date = new Date();
}
```

## 🌐 Service Réseau

Le service réseau permet de détecter l'état de la connexion et de réagir aux changements.

```typescript
import { network } from "ngx-data-pulse";

// Configuration (optionnelle)
network.configure({
  checkInterval: 30000, // Intervalle de vérification (30s)
  testUrl: "https://api.example.com/health", // URL de test
  timeout: 5000, // Timeout des requêtes (5s)
});

// Dans un composant
@Component({
  template: `
    <div class="status" [class]="network.state().status">
      {{ network.state().status === "online" ? "Connecté" : "Hors ligne" }}
      @if (network.state().latency) {
      <small>{{ network.state().latency }}ms</small>
      }
    </div>
  `,
  styles: [
    `
      .status {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .online {
        background: #4caf50;
        color: white;
      }
      .offline {
        background: #f44336;
        color: white;
      }
    `,
  ],
})
export class NetworkStatusComponent {
  network = network;
}

// Vérification manuelle
const isOnline = await network.check();

// Écoute des changements avec les événements
const networkEvent = events.create<NetworkState>({ type: "NETWORK_STATUS" });
networkEvent.on((state) => {
  console.log(`Réseau ${state.status} - Latence: ${state.latency}ms`);
});
```

## 🕒 Service d'Inactivité

Le service d'inactivité permet de détecter l'inactivité de l'utilisateur et de déclencher des actions.

```typescript
import { idle } from "ngx-data-pulse";

// Configuration simple
idle.configure({
  timeout: 900000, // Délai d'inactivité (15min)
  warningDelay: 60000, // Délai d'avertissement (1min)
  events: ["mousemove", "keydown", "click", "scroll", "touchstart"],
  autoLogout: true,
  showWarning: true,
});

// Configuration avec déconnexion personnalisée
idle.configure({
  timeout: 900000,
  autoLogout: true,
  onLogout: () => {
    // Exemple avec un service d'authentification
    authService.logout();

    // Ou avec un store NgRx/Redux
    store.dispatch(logout());

    // Ou avec le router Angular
    router.navigate(["/auth/logout"]);

    // Ou une combinaison d'actions
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/connexion";
  },
});

// Dans un composant
@Component({
  template: `
    <div class="idle-status" [class]="getStatusClass()">
      @if (idle.state().isWarning) {
      <div class="warning">Déconnexion dans {{ getRemainingTime() }}s</div>
      } @if (idle.state().isIdle) {
      <div class="idle">Session expirée</div>
      }

      <div class="last-activity">
        Dernière activité : {{ getLastActivity() }}
      </div>
    </div>
  `,
  styles: [
    `
      .idle-status {
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
      }
      .warning {
        color: #ff9800;
        font-weight: bold;
      }
      .idle {
        color: #f44336;
        font-weight: bold;
      }
      .last-activity {
        font-size: 0.9em;
        color: #666;
      }
    `,
  ],
})
export class IdleStatusComponent {
  idle = idle;

  getStatusClass(): string {
    if (this.idle.state().isIdle) return "idle";
    if (this.idle.state().isWarning) return "warning";
    return "active";
  }

  getRemainingTime(): number {
    return Math.round(this.idle.state().remainingTime / 1000);
  }

  getLastActivity(): string {
    return new Date(this.idle.state().lastActivity).toLocaleTimeString();
  }
}

// Écoute des changements avec les événements
const idleEvent = events.create<IdleState>({ type: "IDLE_STATUS" });
idleEvent.on((state) => {
  if (state.isWarning) {
    console.log(
      `Avertissement : déconnexion dans ${state.remainingTime / 1000}s`
    );
  }
  if (state.isIdle) {
    console.log("Session expirée");
  }
});
```

### Configuration

| Option         | Type         | Défaut              | Description                           |
| -------------- | ------------ | ------------------- | ------------------------------------- |
| `timeout`      | `number`     | `900000`            | Délai d'inactivité en ms (15min)      |
| `warningDelay` | `number`     | `60000`             | Délai d'avertissement en ms (1min)    |
| `events`       | `string[]`   | `["mousemove",...]` | Actions à surveiller                  |
| `autoLogout`   | `boolean`    | `true`              | Déconnexion automatique               |
| `onLogout`     | `() => void` | `undefined`         | Fonction de déconnexion personnalisée |
| `showWarning`  | `boolean`    | `true`              | Afficher un avertissement             |

### Actions personnalisées

Le service permet de définir des actions qui seront déclenchées après un délai d'inactivité spécifique :

```typescript
idle.configure({
  timeout: 900000, // 15min
  actions: [
    {
      timeout: 120000, // 2min
      description: "Sauvegarde automatique",
      callback: () => saveCurrentWork(),
    },
    {
      timeout: 300000, // 5min
      description: "Mode économie d'énergie",
      callback: () => enablePowerSaveMode(),
    },
  ],
});
```

Chaque action est définie par :

- `timeout`: délai en ms avant déclenchement
- `callback`: fonction à exécuter
- `description`: description optionnelle de l'action

## 🔍 Service SEO

Le service SEO permet de gérer dynamiquement les métadonnées pour le référencement.

```typescript
import { seo } from "ngx-data-pulse";

// Configuration globale
seo.configure({
  defaultTitle: "Mon Site",
  titleSeparator: " | ",
  defaultDescription: "Description par défaut du site",
  defaultImage: "https://monsite.com/image.jpg",
  defaultLang: "fr",
});

// Dans un composant
@Component({
  template: `<h1>{{ title }}</h1>`,
})
export class ArticleComponent implements OnInit {
  title = "Mon Article";

  ngOnInit() {
    // Mise à jour des métadonnées
    seo.update({
      title: this.title,
      description: "Description détaillée de l'article",
      image: "https://monsite.com/article.jpg",
      type: "article",
      keywords: ["article", "blog", "actualités"],
      canonical: "https://monsite.com/article",
      meta: {
        author: "John Doe",
        "article:published_time": "2024-01-01",
      },
      og: {
        site_name: "Mon Blog",
        locale: "fr_FR",
      },
      twitter: {
        card: "summary_large_image",
        creator: "@johndoe",
      },
    });
  }
}
```

### Résultat HTML

```html
<html lang="fr">
  <head>
    <title>Mon Article | Mon Site</title>
    <meta name="description" content="Description détaillée de l'article" />
    <meta name="keywords" content="article, blog, actualités" />
    <meta name="author" content="John Doe" />
    <meta name="article:published_time" content="2024-01-01" />

    <link rel="canonical" href="https://monsite.com/article" />

    <!-- Open Graph -->
    <meta property="og:title" content="Mon Article" />
    <meta
      property="og:description"
      content="Description détaillée de l'article"
    />
    <meta property="og:image" content="https://monsite.com/article.jpg" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Mon Blog" />
    <meta property="og:locale" content="fr_FR" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Mon Article" />
    <meta
      name="twitter:description"
      content="Description détaillée de l'article"
    />
    <meta name="twitter:image" content="https://monsite.com/article.jpg" />
    <meta name="twitter:creator" content="@johndoe" />
  </head>
  <body>
    <h1>Mon Article</h1>
  </body>
</html>
```

## 🎯 Service Modal

Le service modal permet d'afficher des fenêtres modales personnalisables.

```typescript
import { modal } from "ngx-data-pulse";

// Configuration globale
modal.configure({
  defaultStyles: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  buttons: {
    close: "Fermer",
    confirm: "Valider",
    cancel: "Annuler",
  },
});

// Dans un composant
@Component({
  template: `
    <ngx-modal></ngx-modal>
    <button (click)="showModal()">Ouvrir</button>
  `,
})
export class AppComponent {
  showModal() {
    // Modal d'information
    modal.info("Votre message ici", {
      title: "Information",
      classes: {
        modal: "custom-modal",
        header: "custom-header",
      },
    });

    // Modal de confirmation
    modal.confirm("Êtes-vous sûr ?", {
      onConfirm: () => console.log("Confirmé"),
      onCancel: () => console.log("Annulé"),
    });

    // Modal d'erreur
    modal.error("Une erreur est survenue", {
      closeOnOverlay: false,
    });

    // Modal d'alerte
    modal.alert("Attention !", {
      showClose: false,
    });

    // Modal personnalisée
    modal.open({
      type: "info",
      title: "Titre",
      content: "<h3>Contenu HTML</h3><p>Votre contenu ici...</p>",
      classes: {
        container: "modal-container",
        overlay: "modal-overlay",
        modal: "modal-content",
        header: "modal-header",
        body: "modal-body",
        footer: "modal-footer",
        closeButton: "modal-close",
        actionButton: "modal-button",
      },
      onOpen: () => console.log("Modal ouverte"),
      onClose: () => console.log("Modal fermée"),
    });
  }
}
```

### Types de Modales

- `info`: Modal d'information simple
- `alert`: Modal d'alerte (sans fermeture par overlay)
- `error`: Modal d'erreur (sans fermeture par overlay)
- `confirm`: Modal de confirmation avec boutons Confirmer/Annuler

### Personnalisation

Chaque modal peut être personnalisée avec :

- Classes CSS personnalisées
- Callbacks (onOpen, onClose, onConfirm, onCancel)
- Textes des boutons
- Animations d'entrée/sortie
- Comportement (fermeture par overlay/escape)
- Styles par défaut activables/désactivables

### Configuration des classes CSS globales

Vous pouvez définir des classes CSS globales pour chaque type de modal lors de la configuration du service :

```typescript
modalService.configure({
  classes: {
    default: {
      container: "modal-container",
      overlay: "modal-overlay",
      modal: "modal-base",
      header: "modal-header",
      body: "modal-body",
      footer: "modal-footer",
    },
    info: {
      modal: "modal-info",
      actionButton: "btn-info",
    },
    error: {
      modal: "modal-error",
      actionButton: "btn-error",
    },
    alert: {
      modal: "modal-alert",
      actionButton: "btn-warning",
    },
    confirm: {
      modal: "modal-confirm",
      actionButton: "btn-primary",
    },
  },
});
```

Les classes définies dans `default` s'appliquent à tous les types de modals. Les classes spécifiques à chaque type (`info`, `error`, `alert`, `confirm`) héritent et peuvent surcharger les classes par défaut.

Vous pouvez toujours surcharger ces classes globales lors de l'ouverture d'une modal spécifique :

```typescript
modalService.info("Message", {
  classes: {
    modal: "custom-modal",
    actionButton: "custom-button",
  },
});
```

## 🧭 Service de Navigation

Le service de navigation permet de gérer la navigation de manière centralisée avec :

- Historique de navigation
- Redirection sécurisée après login/logout
- Gardes de navigation

```typescript
import { navigation } from "ngx-data-pulse";

// Configuration globale
navigation.configure({
  afterLoginUrl: "/dashboard",
  afterLogoutUrl: "/login",
  maxHistorySize: 50,
  guards: [
    {
      canNavigate: () => !hasUnsavedChanges(),
      message:
        "Vous avez des modifications non sauvegardées. Voulez-vous quitter ?",
    },
  ],
});

// Navigation simple
await navigation.navigate("/users");

// Navigation avec garde spécifique
await navigation.navigate("/settings", {
  guards: [
    {
      canNavigate: () => isAdmin(),
      message: "Accès réservé aux administrateurs",
    },
  ],
});

// Navigation forcée (ignore les gardes)
await navigation.navigate("/logout", { force: true });

// Historique
navigation.back();
navigation.forward();

// Redirection après login
navigation.saveRedirectUrl();
await navigation.redirectAfterLogin();

// État de la navigation
const state = navigation.state();
console.log(state.currentUrl);
console.log(state.previousUrl);
console.log(state.history);

// Exemple dans un composant formulaire
@Component({
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="data" name="data" />
      <button type="submit">Enregistrer</button>
    </form>
  `,
})
export class FormComponent implements OnInit, OnDestroy {
  private hasChanges = false;
  private guard: NavigationGuard = {
    canNavigate: () => !this.hasChanges,
    message: "Formulaire non sauvegardé. Continuer ?",
  };

  ngOnInit() {
    navigation.addGuard(this.guard);
  }

  ngOnDestroy() {
    navigation.removeGuard(this.guard);
  }

  onSubmit() {
    this.hasChanges = false;
    navigation.navigate("/success");
  }
}
```

### Configuration

| Option           | Type                | Défaut         | Description                     |
| ---------------- | ------------------- | -------------- | ------------------------------- |
| `afterLoginUrl`  | `string`            | `"/dashboard"` | URL de redirection après login  |
| `afterLogoutUrl` | `string`            | `"/login"`     | URL de redirection après logout |
| `maxHistorySize` | `number`            | `50`           | Taille max de l'historique      |
| `guards`         | `NavigationGuard[]` | `[]`           | Gardes de navigation globaux    |

### Options de Navigation

| Option    | Type                | Défaut      | Description             |
| --------- | ------------------- | ----------- | ----------------------- |
| `guards`  | `NavigationGuard[]` | `undefined` | Gardes spécifiques      |
| `force`   | `boolean`           | `false`     | Ignore les gardes       |
| `replace` | `boolean`           | `false`     | Remplace l'URL actuelle |

## 📝 Service de Logs

Service de logs centralisé pour le debug et la surveillance.

```typescript
import { logs } from "ngx-data-pulse";

// Configuration
logs.configure({
  enabled: true,
  minLevel: "warn",
  externalServiceUrl: "https://api.sentry.io/v1",
  apiKey: "votre-clé-api",
  environment: "production",
  tags: { version: "1.0.0" },
});

// Utilisation
logs.debug("Message de debug", { data: "optionnelle" });
logs.info("Information importante");
logs.warn("Attention !", { détails: "..." });
logs.error("Erreur critique", new Error("détails"));

// Accès à l'historique (signal)
const history = logs.history();
```

### Configuration

| Option             | Type                                   | Défaut        | Description                                 |
| ------------------ | -------------------------------------- | ------------- | ------------------------------------------- |
| enabled            | boolean                                | true          | Active/désactive les logs                   |
| minLevel           | "debug" \| "info" \| "warn" \| "error" | "debug"       | Niveau minimum des logs                     |
| externalServiceUrl | string                                 | -             | URL du service externe (Sentry, Datadog...) |
| apiKey             | string                                 | -             | Clé d'API du service externe                |
| environment        | string                                 | "development" | Environnement (dev, prod...)                |
| tags               | Record<string, string>                 | -             | Tags additionnels                           |

### Fonctionnalités

- 🎯 4 niveaux de logs : debug, info, warn, error
- 📊 Historique complet accessible via signal
- 🔄 Envoi automatique des erreurs vers Sentry/Datadog
- 🏷️ Support des tags et métadonnées
- 🕒 Horodatage automatique
- 🎨 Formatage console avec couleurs
- 🔍 Filtrage par niveau minimum
- 💾 Conservation de l'historique

### Structure d'une entrée

```typescript
interface LogEntry {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  data?: unknown;
  timestamp: number;
  tags?: Record<string, string>;
}
```

## 🖥️ Service de Plateforme

Service de détection de plateforme pour adapter l'interface utilisateur.

```typescript
import { platform } from "ngx-data-pulse";

// Configuration
platform.configure({
  mobile: 768, // Breakpoint mobile en px
  tablet: 1024, // Breakpoint tablette en px
  autoUpdate: true, // Mise à jour auto sur resize
  debounceDelay: 250, // Délai de debounce en ms
});

// Utilisation
const info = platform.info(); // Signal avec les infos
console.log(info.type); // mobile, tablet, desktop
console.log(info.os); // ios, android, windows...
console.log(info.browser); // chrome, firefox, safari...

// Méthodes utilitaires
if (platform.isMobile()) {
  // Logique mobile
}

if (platform.isIOS()) {
  // Logique iOS
}

if (platform.isTouchEnabled()) {
  // Support tactile
}
```

### Configuration

| Option          | Type      | Défaut | Description         |
| --------------- | --------- | ------ | ------------------- |
| `mobile`        | `number`  | `768`  | Breakpoint mobile   |
| `tablet`        | `number`  | `1024` | Breakpoint tablette |
| `autoUpdate`    | `boolean` | `true` | Mise à jour auto    |
| `debounceDelay` | `number`  | `250`  | Délai de debounce   |

### Informations disponibles

| Propriété        | Type          | Description            |
| ---------------- | ------------- | ---------------------- |
| `type`           | `DeviceType`  | Type d'appareil        |
| `os`             | `OSType`      | Système d'exploitation |
| `browser`        | `BrowserType` | Navigateur utilisé     |
| `browserVersion` | `string`      | Version du navigateur  |
| `screenWidth`    | `number`      | Largeur de l'écran     |
| `screenHeight`   | `number`      | Hauteur de l'écran     |
| `orientation`    | `string`      | Portrait ou paysage    |
| `touchEnabled`   | `boolean`     | Support tactile        |
| `pixelRatio`     | `number`      | Densité de pixels      |

## 🔄 Service de Loader

Service de chargement personnalisable avec différents types d'animations.

```typescript
import { loader } from "ngx-data-pulse";

// Configuration globale
loader.configure({
  type: "spinner",
  mode: "fullscreen",
  position: "center",
  delay: 200,
  minDuration: 500,
  overlay: true,
  overlayOpacity: 0.5,
  style: {
    colors: {
      primary: "#2196f3",
      secondary: "#bbdefb",
    },
    size: {
      width: "48px",
      height: "48px",
      thickness: "4px",
    },
  },
  animation: {
    name: "rotate",
    duration: 1000,
    timing: "linear",
    iterations: Infinity,
  },
});

// Dans un composant
@Component({
  template: `
    <ngx-loader></ngx-loader>
    <button (click)="showLoader()">Charger</button>
  `,
})
export class AppComponent {
  showLoader() {
    // Loader simple
    const id = loader.show();

    // Loader avec texte
    loader.show({
      text: "Chargement en cours...",
    });

    // Loader avec barre de progression
    loader.show({
      type: "progress",
      mode: "block",
      text: "Téléchargement...",
    });

    // Loader avec points
    loader.show({
      type: "dots",
      mode: "inline",
      animation: {
        name: "bounce",
        duration: 500,
      },
    });

    // Loader avec pulse
    loader.show({
      type: "pulse",
      style: {
        colors: {
          primary: "#4caf50",
        },
      },
    });

    // Loader personnalisé
    loader.show({
      type: "custom",
      template: "<div class='custom-loader'>...</div>",
    });

    // Cacher un loader
    loader.hide(id);

    // Cacher tous les loaders
    loader.hideAll();
  }
}
```

### Types de Loaders

| Type     | Description                |
| -------- | -------------------------- |
| spinner  | Spinner rotatif            |
| progress | Barre de progression       |
| dots     | Points animés              |
| pulse    | Cercle pulsant             |
| custom   | Template HTML personnalisé |

### Modes d'affichage

| Mode       | Description                |
| ---------- | -------------------------- |
| fullscreen | Plein écran avec overlay   |
| block      | Bloc avec position absolue |
| inline     | En ligne avec le contenu   |

### Positions

| Position | Description     |
| -------- | --------------- |
| center   | Centré (défaut) |
| top      | En haut         |
| bottom   | En bas          |
| left     | À gauche        |
| right    | À droite        |

### Animations disponibles

| Animation | Description             |
| --------- | ----------------------- |
| rotate    | Rotation continue       |
| progress  | Translation horizontale |
| bounce    | Rebond vertical         |
| pulse     | Pulsation avec opacité  |

### Styles personnalisables

```typescript
interface LoaderStyle {
  classes?: {
    container?: string;
    overlay?: string;
    loader?: string;
    text?: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  size?: {
    width?: string;
    height?: string;
    thickness?: string;
  };
}
```

### Exemple avec API

```typescript
@Component({
  template: `
    <div class="users" [class.loading]="loading">
      <ngx-loader></ngx-loader>
      <button (click)="loadUsers()">Charger</button>
      <ul>
        @for (user of users; track user.id) {
        <li>{{ user.name }}</li>
        }
      </ul>
    </div>
  `,
  styles: [
    `
      .users {
        position: relative;
        min-height: 200px;
      }
      .loading {
        opacity: 0.7;
        pointer-events: none;
      }
    `,
  ],
})
export class UsersComponent {
  async loadUsers() {
    const loaderId = loader.show({
      mode: "block",
      text: "Chargement des utilisateurs...",
      minDuration: 500,
    });

    try {
      const response = await fetch("/api/users");
      const users = await response.json();
      this.users = users;
    } finally {
      loader.hide(loaderId);
    }
  }
}
```

## 🌀 Service de Scroll

Service de gestion du scroll et des animations avec détection de position.

```typescript
import { scroller } from "ngx-data-pulse";

// Configuration globale
scroller.configure({
  topThreshold: 100,
  bottomThreshold: 100,
  behavior: "smooth",
  debounceDelay: 100,
  offset: { top: 0, left: 0 },
});

// Scroll vers un élément
scroller.scrollTo("#section-1", {
  offsetTop: -60, // Offset pour le header
  behavior: "smooth",
});

// Verrouillage du scroll (ex: modal)
scroller.lock();
scroller.unlock();

// Animation au scroll
scroller.animate(element, {
  effect: "fade",
  threshold: 0.5,
  duration: 500,
  timing: "ease",
  delay: 0,
  once: true,
});

// Surveillance de l'état
const scrollState = scroller.state();
console.log(scrollState.position); // "top" | "middle" | "bottom"
console.log(scrollState.direction); // "up" | "down" | "none"
console.log(scrollState.progress); // 0-100
```

### Effets d'animation disponibles

| Effet         | Description               |
| ------------- | ------------------------- |
| `fade`        | Fondu à l'apparition      |
| `slide-up`    | Glissement vers le haut   |
| `slide-down`  | Glissement vers le bas    |
| `slide-left`  | Glissement vers la gauche |
| `slide-right` | Glissement vers la droite |
| `zoom`        | Effet de zoom             |

### Configuration

| Option            | Type              | Défaut                | Description                 |
| ----------------- | ----------------- | --------------------- | --------------------------- |
| `topThreshold`    | `number`          | `100`                 | Seuil pour détecter le haut |
| `bottomThreshold` | `number`          | `100`                 | Seuil pour détecter le bas  |
| `behavior`        | `ScrollBehavior`  | `"smooth"`            | Comportement du scroll      |
| `debounceDelay`   | `number`          | `100`                 | Délai de debounce           |
| `offset`          | `{ top?, left? }` | `{ top: 0, left: 0 }` | Offset de scroll            |

### Exemple avec animations

```typescript
import { Component } from "@angular/core";
import { scroller } from "ngx-data-pulse";

@Component({
  selector: "app-home",
  template: `
    <section class="hero">
      <h1 #title>Titre</h1>
      <p #description>Description</p>
      <button (click)="scrollToContent()">Voir plus</button>
    </section>

    <section #content class="content">
      <div #card1 class="card">...</div>
      <div #card2 class="card">...</div>
      <div #card3 class="card">...</div>
    </section>
  `,
})
export class HomeComponent {
  ngAfterViewInit() {
    // Animation du titre
    scroller.animate(this.title.nativeElement, {
      effect: "fade",
      duration: 800,
    });

    // Animation de la description
    scroller.animate(this.description.nativeElement, {
      effect: "slide-up",
      delay: 200,
    });

    // Animation des cartes
    [this.card1, this.card2, this.card3].forEach((card, i) => {
      scroller.animate(card.nativeElement, {
        effect: "slide-up",
        threshold: 0.3,
        delay: i * 200,
      });
    });
  }

  scrollToContent() {
    scroller.scrollTo(this.content.nativeElement, {
      offsetTop: -60,
    });
  }
}
```
