import React from "react";
import { marked } from "marked";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Recipe } from "../src/types";

interface RecipePageProps {
  query: string;
  recipe: string;
}

export const getServerSideProps: GetServerSideProps<RecipePageProps> = async ({
  query,
}) => {
  const { query: searchQuery, recipe } = query;

  // If either parameter is missing, redirect to home page
  if (
    !searchQuery ||
    !recipe ||
    typeof searchQuery !== "string" ||
    typeof recipe !== "string"
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      query: searchQuery,
      recipe: recipe,
    },
  };
};

export default function SearchPage({
  query,
  recipe: encodedRecipe,
}: RecipePageProps) {
  const recipe = JSON.parse(atob(encodedRecipe)) as Recipe;

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
