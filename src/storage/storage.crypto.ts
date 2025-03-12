/**
 * Service de chiffrement/déchiffrement pour le stockage
 */
export class StorageCrypto {
  /**
   * Chiffre une valeur
   */
  static encrypt(value: string, key: string): string {
    if (!key) return value;

    // Conversion en base64 pour éviter les problèmes d'encodage
    const encodedValue = btoa(value);
    const encodedKey = btoa(key);

    // XOR entre la valeur et la clé
    let encrypted = "";
    for (let i = 0; i < encodedValue.length; i++) {
      const valueChar = encodedValue.charCodeAt(i);
      const keyChar = encodedKey.charCodeAt(i % encodedKey.length);
      encrypted += String.fromCharCode(valueChar ^ keyChar);
    }

    return btoa(encrypted);
  }

  /**
   * Déchiffre une valeur
   */
  static decrypt(encrypted: string, key: string): string {
    if (!key) return encrypted;

    try {
      // Décodage base64
      const decodedValue = atob(encrypted);
      const encodedKey = btoa(key);

      // XOR inverse
      let decrypted = "";
      for (let i = 0; i < decodedValue.length; i++) {
        const encryptedChar = decodedValue.charCodeAt(i);
        const keyChar = encodedKey.charCodeAt(i % encodedKey.length);
        decrypted += String.fromCharCode(encryptedChar ^ keyChar);
      }

      return atob(decrypted);
    } catch {
      return encrypted;
    }
  }
}
