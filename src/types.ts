export interface Recipe {
  "@context": "http://schema.org";
  "@type": "Recipe";
  name: string;
  author: {
    "@type": "Person";
    name: string;
  };
  description: string;
  datePublished: string;
  nutrition?: {
    "@type": "NutritionInformation";
    calories?: string;
    fatContent?: string;
  };
  recipeYield?:
    | string
    | {
        "@type": "QuantitativeValue";
        value: number;
        unitText: string;
      };
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  cookingMethod?: string;
  recipeIngredient: string[];
  recipeInstructions: {
    "@type": "HowToSection";
    name: string;
    itemListElement: {
      "@type": "HowToStep";
      text: string;
      url?: string;
      image?: string;
    }[];
  };
  recipeCategory?: string[];
  recipeCuisine?: string[];
  keywords?: string;
  image?: string[];
  suitableForDiet?: string[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
  video?: {
    "@type": "VideoObject";
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    uploadDate: string;
    duration?: string;
  };
}
