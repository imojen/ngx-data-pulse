# NgxDataPulse

[![npm version](https://badge.fury.io/js/ngx-data-pulse.svg)](https://www.npmjs.com/package/ngx-data-pulse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bibliothèque Angular multi-fonctionnalités.

## 📦 Installation

```bash
npm i ngx-data-pulse
```

## 🚀 Fonctionnalités

### Services :

- Service complet pour gérer les appels HTTP avec gestion de l'authentification et des erreurs.
- Service de stockage local avancé avec gestion de l'expiration et du chiffrement.

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
AuthService.setToken("votre-jwt-token");

// Les appels incluront automatiquement le token
const privateApi = api.get<PrivateData>();
await privateApi.execute("/api/private");

// Déconnexion
AuthService.clearToken();
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

## 📖 Documentation

La documentation détaillée de chaque utilitaire sera disponible prochainement.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT © [Imojen]
