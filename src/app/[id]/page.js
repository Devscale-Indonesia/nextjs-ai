import { prisma } from "@/utils/prisma";
import Link from "next/link";
import React from "react";

export default async function Page({ params }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  return (
    <div className="max-w-xl m-auto my-12 space-y-12">
      <Link href="/" className="block">
        Back
      </Link>
      <div className="space-y-8">
        <img src={project.coverUrl} alt={project.title} className="w-full h-96 object-cover rounded-md" />
        <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
        <div className="mt-6 space-y-3">
          {JSON.parse(project.stories).map((story) => (
            <div key={story}>{story}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
