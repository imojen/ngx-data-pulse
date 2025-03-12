# NgxDataPulse

[![npm version](https://badge.fury.io/js/ngx-data-pulse.svg)](https://www.npmjs.com/package/ngx-data-pulse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Toolkit Angular 18+ pour tous types de projets.

## 📦 Installation

```bash
npm i ngx-data-pulse
```

## 🚀 Fonctionnalités

- API : Service complet pour gérer les appels HTTP avec gestion de l'authentification et des erreurs.
- Storage : Service de stockage local avancé avec gestion de l'expiration et du chiffrement.
- Notification : Service de notification personnalisable.

## 💻 Compatibilité

- Angular 18+
- TypeScript 5.4+

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

```typescript
// Accès à l'historique des événements
const userEvent = events.create<UserEvent>({
  type: "USER_UPDATED",
  keepHistory: true,
  historySize: 5,
});

// Dans un composant
@Component({
  template: `
    <div>Historique des modifications :</div>
    <ul>
      @for (user of userEvent.history(); track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `,
})
export class HistoryComponent {}
````

### Nettoyage

```typescript
// Supprimer un événement spécifique
events.remove("USER_UPDATED");

// Supprimer tous les événements
events.clear();
```

## 📄 Licence

MIT © [Imojen]
