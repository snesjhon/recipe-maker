export interface Recipe {
  "@context": string;
  "@type": "Recipe";
  name: string;
  author?: {
    "@type": "Person";
    name: string;
  };
  description?: string;
  datePublished?: string;
  image?: string[];
  video?: {
    "@type": "VideoObject";
    name: string;
    description: string;
    uploadDate: string;
    duration: string;
    thumbnailUrl: string;
    contentUrl: string;
    embedUrl: string;
  };
  recipeYield: string[];
  prepTime?: string;
  cookTime?: string;
  recipeIngredient: string[];
  recipeInstructions: {
    "@type": "HowToStep";
    text: string;
    name?: string;
    url?: string;
    image?: string;
  }[];
  recipeCategory?: string[];
  recipeCuisine?: string[];
  keywords?: string;
}
