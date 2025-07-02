"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { generateStory } from "./action";

export default function Home() {
  const [_, action, pending] = useActionState(generateStory, null);

  return (
    <main className="max-w-xl m-auto my-12 space-y-12">
      <form action={action} className="space-y-5">
        <section>
          <h1 className="text-xl font-bold tracking-tight">Baby Story Maker</h1>
          <p className="text-gray-500 text-sm font-medium">Enter your prompt and we will generate a story for you.</p>
        </section>
        <Textarea name="prompt" placeholder="Story about a deer and rabbit friendships..." rows={5} defaultValue="Story about a baby deer and a baby rabbit." />
        <Button type="submit" disabled={pending}>
          Generate Story
        </Button>
      </form>
    </main>
  );
}
