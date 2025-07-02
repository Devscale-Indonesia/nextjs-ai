"use server";

import { generateStoryTask } from "@/trigger/tasks";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function generateStory(_, formData) {
  const prompt = formData.get("prompt");

  const project = await prisma.project.create({
    data: {
      prompt,
    },
  });

  revalidatePath("/");

  // Call background task
}
