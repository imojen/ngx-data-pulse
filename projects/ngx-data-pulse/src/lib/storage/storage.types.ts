export interface StorageOptions {
  /**
   * Clé de chiffrement pour le contenu
   */
  encryptionKey?: string;

  /**
   * Préfixe pour les clés de stockage
   * @default 'ngx_'
   */
  prefix?: string;
}

export interface StorageDTO<T = unknown> {
  /**
   * Clé unique de stockage
   */
  key: string;

  /**
   * Données à stocker
   */
  data: T;

  /**
   * Date d'expiration (timestamp)
   * @optional
   */
  expiresAt?: number;

  /**
   * Durée de vie en secondes
   * @optional
   */
  ttl?: number;
}

export interface StorageItem<T = unknown> extends StorageDTO<T> {
  /**
   * Date de création
   */
  createdAt: number;

  /**
   * Date de dernière modification
   */
  updatedAt: number;
}
