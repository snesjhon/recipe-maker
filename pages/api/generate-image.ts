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

  const { recipeData } = req.body;

  if (!recipeData) {
    return res.status(400).json({ error: "Recipe data is required" });
  }

  try {
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

    return res.status(200).json({ imageUrl: imageResponse.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({ error: "Failed to generate image" });
  }
} 