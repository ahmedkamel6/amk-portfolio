const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.appearanceSettings.update({
    where: { id: 'singleton' },
    data: {
      orderAbout: 1,
      orderProjects: 2,
      orderSkills: 3,
      orderContact: 4,
    }
  });
  console.log('Database AppearanceSettings ordering updated successfully');
}

main()
  .catch(e => {
    console.error('Error updating AppearanceSettings', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
