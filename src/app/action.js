"use server";

import { generateStoryTask } from "@/trigger/tasks";

export async function generateStory(_, formData) {
  const prompt = formData.get("prompt");

  const story = await generateStoryTask.trigger({ prompt });
  return story;
}
