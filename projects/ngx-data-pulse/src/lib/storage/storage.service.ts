import { StorageOptions, StorageDTO, StorageItem } from "./storage.types";
import { StorageCrypto } from "./storage.crypto";

/**
 * Service de stockage avancé avec gestion de l'expiration et du chiffrement
 */
export class StorageService {
  private static options: StorageOptions = {
    prefix: "ngx_",
  };

  /**
   * Configure les options du service
   */
  static configure(options: StorageOptions): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Stocke des données
   */
  static put<T>(dto: StorageDTO<T>): void {
    const now = Date.now();
    const item: StorageItem<T> = {
      ...dto,
      createdAt: now,
      updatedAt: now,
      expiresAt: dto.ttl ? now + dto.ttl * 1000 : dto.expiresAt,
    };

    const key = this.getKey(dto.key);
    const value = this.encrypt(JSON.stringify(item));
    localStorage.setItem(key, value);
  }

  /**
   * Récupère des données
   */
  static get<T>(key: string): T | null {
    const item = this.getItem<T>(key);
    if (!item) return null;

    // Vérification de l'expiration
    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Récupère un item complet avec ses métadonnées
   */
  static getItem<T>(key: string): StorageItem<T> | null {
    const value = localStorage.getItem(this.getKey(key));
    if (!value) return null;

    try {
      return JSON.parse(this.decrypt(value));
    } catch {
      return null;
    }
  }

  /**
   * Supprime des données
   */
  static delete(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * Supprime toutes les données
   */
  static reset(): void {
    const prefix = this.options.prefix;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix!))
      .forEach((key) => localStorage.removeItem(key));
  }

  /**
   * Récupère toutes les données non expirées
   */
  static getAll<T>(): T[] {
    const prefix = this.options.prefix;
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix!))
      .map((key) => this.get<T>(key.slice(prefix!.length)))
      .filter((item) => item !== null) as T[];
  }

  /**
   * Recherche des données par une fonction de filtre
   */
  static search<T>(predicate: (data: T) => boolean): T[] {
    return this.getAll<T>().filter(predicate);
  }

  /**
   * Vérifie si une clé existe et n'est pas expirée
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Met à jour des données existantes
   */
  static update<T>(key: string, data: T): boolean {
    const item = this.getItem<T>(key);
    if (!item) return false;

    this.put({
      key,
      data,
      expiresAt: item.expiresAt,
      ttl: item.ttl,
    });

    return true;
  }

  /**
   * Prolonge la durée de vie d'un item
   */
  static touch(key: string, ttl?: number): boolean {
    const item = this.getItem(key);
    if (!item) return false;

    this.put({
      ...item,
      ttl,
      expiresAt: ttl ? undefined : item.expiresAt,
    });

    return true;
  }

  private static getKey(key: string): string {
    return `${this.options.prefix}${key}`;
  }

  private static encrypt(value: string): string {
    return this.options.encryptionKey
      ? StorageCrypto.encrypt(value, this.options.encryptionKey)
      : value;
  }

  private static decrypt(value: string): string {
    return this.options.encryptionKey
      ? StorageCrypto.decrypt(value, this.options.encryptionKey)
      : value;
  }
}
