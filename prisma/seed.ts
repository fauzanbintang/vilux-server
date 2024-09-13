import { Gender, PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/helpers/bcrypt';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'client@vilux.id' },
    update: {},
    create: {
      username: 'admin_vilux',
      email: 'admin@vilux.id',
      password: await hashPassword('Vilux!23'),
      role: Role.admin,
      full_name: 'Admin Vilux',
      date_of_birth: new Date(),
      gender: Gender.female,
    },
  });
  await prisma.user.upsert({
    where: { email: 'client@vilux.id' },
    update: {},
    create: {
      username: 'client_vilux',
      email: 'client@vilux.id',
      password: await hashPassword('Vilux!23'),
      role: Role.client,
      full_name: 'Client Vilux',
      date_of_birth: new Date(),
      gender: Gender.female,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
