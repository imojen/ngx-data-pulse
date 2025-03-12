# NgxDataPulse

[![npm version](https://badge.fury.io/js/ngx-data-pulse.svg)](https://www.npmjs.com/package/ngx-data-pulse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bibliothèque Angular multi-fonctionnalités.

## 📦 Installation

```bash
npm i ngx-data-pulse
```

## 🚀 Fonctionnalités

### Service API

Service complet pour gérer les appels HTTP avec gestion de l'authentification et des erreurs.

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

````typescript
// Interface de notre modèle
interface User {
  id: number;
  name: string;
  email: string;
}

// Composant de profil utilisateur
@Component({
  selector: 'app-user-profile',
  template: `
    <!-- Affichage du loader -->
    <div *ngIf="userApi.loading()">
      Chargement du profil...
    </div>

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
  `
})
export class UserProfileComponent implements OnInit {
  // Création du signal API
  userApi = api.get<User>();

  async ngOnInit() {
    try {
      // Appel API pour récupérer l'utilisateur 123
      await this.userApi.execute('/users/123');
    } catch (error) {
      console.error('Erreur lors de la récupération du profil');
    }
  }
}

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
````

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

## 💻 Compatibilité

- Angular 18+
- TypeScript 5.4+

## 📖 Documentation

La documentation détaillée de chaque utilitaire sera disponible prochainement.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT © [Imojen]

# Utils API

Bibliothèque d'utilitaires pour les appels API avec gestion de l'authentification.

## Installation

```bash
npm install @your-org/utils
```

## Utilisation

### Appels API sans authentification

```typescript
import { ApiService } from "@your-org/utils";

const { data, status } = await ApiService.get<YourDataType>(
  "https://api.example.com/public"
);
```

### Appels API avec authentification

```typescript
import { ApiService, AuthService } from "@your-org/utils";

// Définir le token d'authentification
AuthService.setToken("votre-jwt-token");

// Les appels suivants incluront automatiquement le token
const { data, status } = await ApiService.get<YourDataType>(
  "https://api.example.com/private"
);

// Pour se déconnecter
AuthService.clearToken();
```

### Headers personnalisés

```typescript
const response = await ApiService.get<YourDataType>(
  "https://api.example.com/endpoint",
  {
    "Custom-Header": "valeur",
  }
);
```

## Types

```typescript
interface ApiHeaders {
  [key: string]: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}
```
