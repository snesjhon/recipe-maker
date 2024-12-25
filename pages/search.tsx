import React from "react";
import Link from "next/link";
import { marked } from "marked";
import Head from "next/head";
import type { Recipe } from "../src/types";
import type { GetServerSideProps } from "next";
import OpenAI from "openai";

interface Props {
  recipe?: Recipe;
  slug?: string;
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const searchQuery = query.q;

  if (!searchQuery || typeof searchQuery !== "string") {
    return { props: {} };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful cooking assistant. Return recipes in the following JSON format:
            {
              "@context": "http://schema.org",
              "@type": "Recipe",
              "name": "Recipe Name",
              "author": {
                "@type": "Person",
                "name": "snesjhon"
              },
              "description": "Brief description",
              "datePublished": "${new Date().toISOString()}",
              "recipeYield": "4",
              "prepTime": "PTxM",
              "cookTime": "PTxM",
              "recipeIngredient": ["ingredient 1", "ingredient 2"],
              "recipeInstructions": [
                {
                  "@type": "HowToStep",
                  "text": "Step description",
                }
              ],
              "recipeCategory": ["category 1", "category 2"],
              "recipeCuisine": ["cuisine 1", "cuisine 2"],
              "keywords": "keywords"
            }`,
        },
        {
          role: "user",
          content: `Please provide a recipe for: ${searchQuery}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No recipe generated");
    }

    const recipe = JSON.parse(completion.choices[0].message.content) as Recipe;

    if (!recipe) {
      throw new Error("No recipe generated");
    }

    return {
      props: {
        recipe,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "Failed to generate recipe. Please try again.",
      },
    };
  }
};

export default function SearchPage({ recipe, error }: Props) {
  const markdown = recipe
    ? `
# ${recipe.name}

${recipe.description || ""}
${recipe.author ? `By ${recipe.author.name}` : ""}

## Preparation Time
${
  recipe.prepTime
    ? `- Prep Time: ${recipe.prepTime
        .replace("PT", "")
        .replace("M", " minutes")}`
    : ""
}
${
  recipe.cookTime
    ? `- Cook Time: ${recipe.cookTime
        .replace("PT", "")
        .replace("M", " minutes")}`
    : ""
}
${recipe.recipeYield ? `- Servings: ${recipe.recipeYield}` : ""}

## Ingredients
${recipe.recipeIngredient.map((ingredient) => `- ${ingredient}`).join("\n")}

## Instructions
${recipe.recipeInstructions
  .map((step, index) => `${index + 1}. ${step.text}`)
  .join("\n")}

---
${recipe.recipeCuisine ? `Cuisine: ${recipe.recipeCuisine.join(", ")}` : ""}
${
  recipe.recipeCategory ? `\nCategory: ${recipe.recipeCategory.join(", ")}` : ""
}
${
  recipe.datePublished
    ? `\nPublished: ${new Date(recipe.datePublished).toLocaleDateString()}`
    : ""
}
`
    : "";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Head>
        <title>{recipe ? recipe.name : "Recipe Search"}</title>
        {recipe && <meta name="description" content={recipe.description} />}
        {recipe && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(recipe),
            }}
          />
        )}
      </Head>

      <Link
        href="/"
        className="inline-block mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Home
      </Link>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg mb-8">
          {error}
        </div>
      )}

      {recipe && (
        <>
          {recipe.image && recipe.image[0] && (
            <img
              src={recipe.image[0]}
              alt={recipe.name}
              className="w-full h-auto rounded-lg mb-6"
            />
          )}

          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(markdown),
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
