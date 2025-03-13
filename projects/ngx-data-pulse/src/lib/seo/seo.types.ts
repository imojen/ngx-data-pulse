export interface SeoConfig {
  /**
   * Titre par défaut du site
   */
  defaultTitle?: string;

  /**
   * Séparateur pour le titre
   * @default " | "
   */
  titleSeparator?: string;

  /**
   * Description par défaut
   */
  defaultDescription?: string;

  /**
   * Image par défaut
   */
  defaultImage?: string;

  /**
   * Langue par défaut
   * @default "fr"
   */
  defaultLang?: string;
}

export interface SeoData {
  /**
   * Titre de la page
   */
  title?: string;

  /**
   * Description de la page
   */
  description?: string;

  /**
   * URL canonique
   */
  canonical?: string;

  /**
   * Image principale
   */
  image?: string;

  /**
   * Type de contenu (article, website...)
   */
  type?: string;

  /**
   * Langue de la page
   */
  lang?: string;

  /**
   * Mots-clés
   */
  keywords?: string[];

  /**
   * Métadonnées personnalisées
   */
  meta?: {
    [key: string]: string;
  };

  /**
   * Données Open Graph
   */
  og?: {
    [key: string]: string;
  };

  /**
   * Données Twitter Card
   */
  twitter?: {
    [key: string]: string;
  };
}
