const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  console.log("Total Projects:", projects.length);
  
  const featured = projects.filter(p => p.featured);
  console.log("Featured Projects:", featured.length);

  const categories = [...new Set(projects.map(p => p.category))];
  console.log("Categories:", categories);

  console.log("\nProject Details:");
  for (const p of projects) {
    console.log(`- ID: ${p.id} | Slug: ${p.slug} | Category: "${p.category}" | Featured: ${p.featured} | Tools: "${p.toolsUsed}" | DriveUrl: ${!!p.driveUrl} | VideoUrl: ${!!p.videoUrl}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
