import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Generate recipe first
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
              "keywords": "keywords",
              "image": []
            }`,
        },
        {
          role: "user",
          content: `Please provide a recipe for: ${query}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const recipeData = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    if (!recipeData) {
      throw new Error("No recipe generated");
    }

    // Generate image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A professional, appetizing photo of ${
        recipeData.name
      }. Food photography style, on a beautiful plate, well-lit, high resolution, showing the finished dish. Also use the rest of the recipe data: ${JSON.stringify(
        recipeData
      )} to generate the image`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    // Add the generated image URL to the recipe
    recipeData.image = [imageResponse.data[0].url];

    return res.status(200).json({ recipe: JSON.stringify(recipeData) });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return res.status(500).json({ error: "Failed to generate recipe" });
  }
}
