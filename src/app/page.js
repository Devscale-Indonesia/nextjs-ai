import { prisma } from "@/utils/prisma";
import { FormCreate } from "./_components/form";
import Link from "next/link";

export default async function Home() {
  const projects = await prisma.project.findMany();

  return (
    <main className="max-w-xl m-auto my-12 space-y-12">
      <FormCreate />
      <div className="mt-12">
        <h1 className="text-2xl font-bold tracking-tight">All Stories</h1>
        <div className="mt-6 space-y-12">
          {projects.map((project) => {
            if (project.status === "completed") {
              return (
                <Link href={`/${project.id}`} key={project.id} className="flex justify-between bg-accent p-4 text-sm font-medium rounded-lg">
                  <h2>{project.id}</h2>
                  <div className="text-green-500">DONE</div>
                </Link>
              );
            }
            return (
              <div key={project.id} className="flex justify-between bg-accent p-4 text-sm font-medium rounded-lg">
                <h2>{project.id}</h2>
                {project?.status === "completed" && <div className="text-green-500">DONE</div>}
                {project?.status === "processing" && <div className="text-yellow-500">PROCESSING</div>}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
