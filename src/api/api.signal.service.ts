import { computed, signal } from "@angular/core";
import { ApiHeaders, ApiResponse, HttpMethod } from "./api.types";
import { ApiService } from "./api.service";
import { ApiError } from "./api.error";

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  status: number | null;
}

type ApiMethod<T> = (url: string, ...args: any[]) => Promise<ApiResponse<T>>;

/**
 * Service pour gérer les appels API avec les signaux Angular
 * @class ApiSignalService
 */
export class ApiSignalService {
  private static getApiMethod<T>(method: HttpMethod): ApiMethod<T> {
    switch (method) {
      case "GET":
        return ApiService.get.bind(ApiService);
      case "POST":
        return ApiService.post.bind(ApiService);
      case "PUT":
        return ApiService.put.bind(ApiService);
      case "PATCH":
        return ApiService.patch.bind(ApiService);
      case "DELETE":
        return ApiService.delete.bind(ApiService);
      default:
        throw new Error(`Méthode HTTP non supportée: ${method}`);
    }
  }

  /**
   * Crée un signal pour une requête API
   * @template T - Type de la réponse attendue
   * @returns Un objet contenant le signal et les méthodes pour le manipuler
   */
  static createSignal<T>() {
    const state = signal<ApiState<T>>({
      data: null,
      loading: false,
      error: null,
      status: null,
    });

    // Signal en lecture seule pour la donnée
    const data = computed(() => state().data);
    // Signal en lecture seule pour le statut de chargement
    const loading = computed(() => state().loading);
    // Signal en lecture seule pour les erreurs
    const error = computed(() => state().error);
    // Signal en lecture seule pour le status HTTP
    const status = computed(() => state().status);

    /**
     * Exécute une requête API et met à jour le signal
     */
    const execute = async (
      method: HttpMethod,
      url: string,
      requestData?: unknown,
      headers?: ApiHeaders,
      responseType?: "json" | "text" | "blob" | "arraybuffer"
    ) => {
      try {
        // Mise à jour du state loading
        state.set({ ...state(), loading: true, error: null });

        // Récupération de la méthode API appropriée
        const apiMethod = this.getApiMethod<T>(method);

        // Exécution de la requête
        const response = await apiMethod(
          url,
          requestData,
          headers,
          responseType
        );

        // Mise à jour du state avec la réponse
        state.set({
          data: response.data,
          loading: false,
          error: null,
          status: response.status,
        });

        return response;
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(500, "Erreur inconnue");

        // Mise à jour du state avec l'erreur
        state.set({
          data: null,
          loading: false,
          error: apiError,
          status: apiError.status,
        });

        throw apiError;
      }
    };

    /**
     * Réinitialise le state du signal
     */
    const reset = () => {
      state.set({
        data: null,
        loading: false,
        error: null,
        status: null,
      });
    };

    return {
      data,
      loading,
      error,
      status,
      execute,
      reset,
    };
  }

  /**
   * Crée un signal pour une requête GET
   */
  static get<T>() {
    const signal = this.createSignal<T>();
    return {
      ...signal,
      execute: (
        url: string,
        headers?: ApiHeaders,
        responseType?: "json" | "text" | "blob" | "arraybuffer"
      ) => signal.execute("GET", url, undefined, headers, responseType),
    };
  }

  /**
   * Crée un signal pour une requête POST
   */
  static post<T, D>() {
    const signal = this.createSignal<T>();
    return {
      ...signal,
      execute: (
        url: string,
        data: D,
        headers?: ApiHeaders,
        responseType?: "json" | "text" | "blob" | "arraybuffer"
      ) => signal.execute("POST", url, data, headers, responseType),
    };
  }

  /**
   * Crée un signal pour une requête PUT
   */
  static put<T, D>() {
    const signal = this.createSignal<T>();
    return {
      ...signal,
      execute: (
        url: string,
        data: D,
        headers?: ApiHeaders,
        responseType?: "json" | "text" | "blob" | "arraybuffer"
      ) => signal.execute("PUT", url, data, headers, responseType),
    };
  }

  /**
   * Crée un signal pour une requête PATCH
   */
  static patch<T, D>() {
    const signal = this.createSignal<T>();
    return {
      ...signal,
      execute: (
        url: string,
        data: D,
        headers?: ApiHeaders,
        responseType?: "json" | "text" | "blob" | "arraybuffer"
      ) => signal.execute("PATCH", url, data, headers, responseType),
    };
  }

  /**
   * Crée un signal pour une requête DELETE
   */
  static delete<T>() {
    const signal = this.createSignal<T>();
    return {
      ...signal,
      execute: (
        url: string,
        headers?: ApiHeaders,
        responseType?: "json" | "text" | "blob" | "arraybuffer"
      ) => signal.execute("DELETE", url, undefined, headers, responseType),
    };
  }
}

export const api = ApiSignalService;
export default api;
