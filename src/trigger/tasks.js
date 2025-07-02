import { openai } from "@/utils/openai";
import { prisma } from "@/utils/prisma";
import { s3Client } from "@/utils/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { logger, task } from "@trigger.dev/sdk/v3";

export const generateStoryTask = task({
  id: "generate-story",
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    logger.log("Generating story...", { payload, ctx });

    const res = await openai.responses.parse({
      model: "gpt-4.1",
      instructions: "You are a story teller. Write a short story about the following:",
      input: payload.prompt,
      text: {
        format: {
          type: "json_schema",
          name: "story",
          schema: {
            type: "object",
            properties: {
              coverImagePrompt: {
                type: "string",
                description: "Prompt to generate cover image for the story, should be in kids comic crayon style",
              },
              title: {
                type: "string",
                description: "The title of the story",
              },
              content: {
                type: "array",
                items: {
                  type: "string",
                  description: "A line of the story",
                },
              },
            },
            required: ["coverImagePrompt", "title", "content"],
            additionalProperties: false,
          },
        },
      },
    });

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt: res.output_parsed.coverImagePrompt,
      size: "auto",
    });

    const folder = "images";
    const key = payload.id + ".png";
    const buffer = Buffer.from(image.data[0].b64_json, "base64");
    const path = `https://pub-15b1527f05fc4c23ad7da0b7f532941c.r2.dev/batch9/images/${key}`;

    try {
      const fileUpload = await s3Client.send(
        new PutObjectCommand({
          Bucket: "batch9",
          Key: `${folder}/${key}`,
          ContentType: "image/png",
          Body: buffer,
        })
      );

      console.log(fileUpload);
      console.log(fileUpload, "Upload OK! ✅");
    } catch (error) {
      console.log(error);
    }

    await prisma.project.update({
      where: {
        id: payload.id,
      },
      data: {
        title: res.output_parsed.title,
        stories: JSON.stringify(res.output_parsed.content),
        coverUrl: path,
        status: "completed",
      },
    });

    return {
      success: true,
      data: {
        ...res.output_parsed,
        coverImageUrl: path,
      },
    };
  },
  onSuccess: async (payload, { ctx }) => {
    logger.log("Story generated", { payload, ctx });
  },
  onError: async (payload, { ctx }) => {
    logger.log("Story generation failed", { payload, ctx });
  },
});
