import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { SeoConfig, SeoData } from "./seo.types";

@Injectable({ providedIn: "root" })
export class SeoService {
  private config: SeoConfig = {
    defaultTitle: "",
    titleSeparator: " | ",
    defaultDescription: "",
    defaultImage: "",
    defaultLang: "fr",
  };

  constructor(private title: Title, private meta: Meta) {}

  /**
   * Configure le service
   */
  configure(config: SeoConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Met à jour les métadonnées de la page
   */
  update(data: SeoData): void {
    // Titre
    this.updateTitle(data.title);

    // Description
    this.updateMeta(
      "description",
      data.description || this.config.defaultDescription
    );

    // URL canonique
    this.updateLink("canonical", data.canonical);

    // Langue
    this.updateHtmlLang(data.lang || this.config.defaultLang);

    // Mots-clés
    if (data.keywords?.length) {
      this.updateMeta("keywords", data.keywords.join(", "));
    }

    // Image
    const image = data.image || this.config.defaultImage;
    if (image) {
      this.updateMeta("image", image);
    }

    // Type de contenu
    if (data.type) {
      this.updateMeta("og:type", data.type);
    }

    // Métadonnées personnalisées
    if (data.meta) {
      Object.entries(data.meta).forEach(([name, content]) => {
        this.updateMeta(name, content);
      });
    }

    // Open Graph
    if (data.og) {
      Object.entries(data.og).forEach(([property, content]) => {
        this.updateMeta(`og:${property}`, content);
      });
    }

    // Twitter Card
    if (data.twitter) {
      Object.entries(data.twitter).forEach(([name, content]) => {
        this.updateMeta(`twitter:${name}`, content);
      });
    }

    // Open Graph par défaut
    this.updateMeta("og:title", data.title || this.config.defaultTitle);
    this.updateMeta(
      "og:description",
      data.description || this.config.defaultDescription
    );
    if (image) {
      this.updateMeta("og:image", image);
    }

    // Twitter Card par défaut
    this.updateMeta("twitter:card", "summary_large_image");
    this.updateMeta("twitter:title", data.title || this.config.defaultTitle);
    this.updateMeta(
      "twitter:description",
      data.description || this.config.defaultDescription
    );
    if (image) {
      this.updateMeta("twitter:image", image);
    }
  }

  /**
   * Met à jour le titre
   */
  private updateTitle(title?: string): void {
    if (!title) {
      this.title.setTitle(this.config.defaultTitle || "");
      return;
    }

    if (this.config.defaultTitle) {
      this.title.setTitle(
        `${title}${this.config.titleSeparator}${this.config.defaultTitle}`
      );
    } else {
      this.title.setTitle(title);
    }
  }

  /**
   * Met à jour une balise meta
   */
  private updateMeta(name: string, content?: string): void {
    if (!content) {
      this.meta.removeTag(`name="${name}"`);
      this.meta.removeTag(`property="${name}"`);
      return;
    }

    // Gestion des propriétés Open Graph
    if (name.startsWith("og:")) {
      this.meta.updateTag({ property: name, content });
    } else {
      this.meta.updateTag({ name, content });
    }
  }

  /**
   * Met à jour une balise link
   */
  private updateLink(rel: string, href?: string): void {
    const selector = `link[rel="${rel}"]`;
    if (!href) {
      const element = document.querySelector(selector);
      if (element) {
        element.remove();
      }
      return;
    }

    const link = document.querySelector(selector) as HTMLLinkElement;
    if (link) {
      link.href = href;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = rel;
      newLink.href = href;
      document.head.appendChild(newLink);
    }
  }

  /**
   * Met à jour la langue du document
   */
  private updateHtmlLang(lang?: string): void {
    if (lang) {
      document.documentElement.lang = lang;
    }
  }
}
