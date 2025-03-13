import {
  ApiHeaders,
  ApiResponse,
  HttpMethod,
  ApiRequestConfig,
} from "./api.types";
import { AuthService } from "./auth.service";
import { ApiError, ApiErrorHandler } from "./api.error";

/**
 * Service pour gérer les appels API HTTP
 * @class ApiService
 */
export class ApiService {
  /**
   * Analyse la réponse selon son type
   * @private
   */
  private static async parseResponse(
    response: Response,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<unknown> {
    try {
      switch (responseType) {
        case "text":
          return await response.text();
        case "blob":
          return await response.blob();
        case "arraybuffer":
          return await response.arrayBuffer();
        case "json":
        default:
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return await response.json();
          }
          // Si le serveur ne renvoie pas du JSON mais qu'on l'attend
          if (responseType === "json") {
            throw new Error("La réponse n'est pas au format JSON");
          }
          // Par défaut, on essaie de parser en JSON, sinon on retourne le texte
          return await response.json().catch(() => response.text());
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(response.status, error.message);
      }
      throw error;
    }
  }

  /**
   * Méthode générique pour effectuer des requêtes HTTP
   * @template T - Type de la réponse attendue
   * @template D - Type des données envoyées (body)
   * @param {HttpMethod} method - Méthode HTTP (GET, POST, PUT, PATCH, DELETE)
   * @param {string} url - URL de l'endpoint
   * @param {D} [data] - Données à envoyer dans le body
   * @param {ApiHeaders} [headers] - Headers HTTP additionnels
   * @param {string} [responseType] - Type de réponse attendu (json, text, blob, arraybuffer)
   * @returns {Promise<ApiResponse<T>>} Réponse API typée
   * @throws {ApiError} En cas d'erreur HTTP ou réseau
   * @private
   */
  private static async request<T, D = unknown>(
    method: HttpMethod,
    url: string,
    data?: D,
    headers?: ApiHeaders,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<ApiResponse<T>> {
    const config: ApiRequestConfig<D> = {
      method,
      url,
      data,
      headers: {
        "Content-Type": "application/json",
        ...AuthService.getAuthHeader(),
        ...headers,
      },
      responseType,
    };

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        ...(config.data && { body: JSON.stringify(config.data) }),
      });

      if (!response.ok) {
        const errorData = await this.parseResponse(response, "json").catch(
          () => null
        );
        throw new ApiError(
          response.status,
          `Erreur HTTP: ${response.status}`,
          errorData
        );
      }

      const responseData = await this.parseResponse(
        response,
        config.responseType
      );
      return {
        data: responseData as T,
        status: response.status,
      };
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  }

  /**
   * Effectue une requête GET
   * @template T - Type de la réponse attendue
   * @param {string} url - URL de l'endpoint
   * @param {ApiHeaders} [headers] - Headers HTTP additionnels
   * @param {string} [responseType] - Type de réponse attendu
   * @returns {Promise<ApiResponse<T>>} Réponse API typée
   * @throws {ApiError} En cas d'erreur HTTP ou réseau
   */
  static async get<T>(
    url: string,
    headers?: ApiHeaders,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url, undefined, headers, responseType);
  }

  /**
   * Effectue une requête POST
   * @template T - Type de la réponse attendue
   * @template D - Type des données envoyées
   * @param {string} url - URL de l'endpoint
   * @param {D} data - Données à envoyer
   * @param {ApiHeaders} [headers] - Headers HTTP additionnels
   * @param {string} [responseType] - Type de réponse attendu
   * @returns {Promise<ApiResponse<T>>} Réponse API typée
   * @throws {ApiError} En cas d'erreur HTTP ou réseau
   */
  static async post<T, D>(
    url: string,
    data: D,
    headers?: ApiHeaders,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<ApiResponse<T>> {
    return this.request<T, D>("POST", url, data, headers, responseType);
  }

  /**
   * Effectue une requête PUT
   * @template T - Type de la réponse attendue
   * @template D - Type des données envoyées
   * @param {string} url - URL de l'endpoint
   * @param {D} data - Données à envoyer
   * @param {ApiHeaders} [headers] - Headers HTTP additionnels
   * @param {string} [responseType] - Type de réponse attendu
   * @returns {Promise<ApiResponse<T>>} Réponse API typée
   * @throws {ApiError} En cas d'erreur HTTP ou réseau
   */
  static async put<T, D>(
    url: string,
    data: D,
    headers?: ApiHeaders,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<ApiResponse<T>> {
    return this.request<T, D>("PUT", url, data, headers, responseType);
  }

  /**
   * Effectue une requête PATCH
   * @template T - Type de la réponse attendue
   * @template D - Type des données envoyées
   * @param {string} url - URL de l'endpoint
   * @param {D} data - Données à envoyer
   * @param {ApiHeaders} [headers] - Headers HTTP additionnels
   * @param {string} [responseType] - Type de réponse attendu
   * @returns {Promise<ApiResponse<T>>} Réponse API typée
   * @throws {ApiError} En cas d'erreur HTTP ou réseau
   */
  static async patch<T, D>(
    url: string,
    data: D,
    headers?: ApiHeaders,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<ApiResponse<T>> {
    return this.request<T, D>("PATCH", url, data, headers, responseType);
  }

  /**
   * Effectue une requête DELETE
   * @template T - Type de la réponse attendue
   * @param {string} url - URL de l'endpoint
   * @param {ApiHeaders} [headers] - Headers HTTP additionnels
   * @param {string} [responseType] - Type de réponse attendu
   * @returns {Promise<ApiResponse<T>>} Réponse API typée
   * @throws {ApiError} En cas d'erreur HTTP ou réseau
   */
  static async delete<T>(
    url: string,
    headers?: ApiHeaders,
    responseType?: "json" | "text" | "blob" | "arraybuffer"
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url, undefined, headers, responseType);
  }
}
