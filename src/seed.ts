import { CategoryName, Gender, PrismaClient, Role } from '@prisma/client';
import { hashPassword } from './helpers/bcrypt';

const prisma = new PrismaClient();
async function main() {
  // seed users
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
  await prisma.user.upsert({
    where: { email: 'vip_client@vilux.id' },
    update: {},
    create: {
      username: 'vip_client_vilux',
      email: 'vip_client@vilux.id',
      password: await hashPassword('Vilux!23'),
      role: Role.vip_client,
      full_name: 'VIP Client Vilux',
      date_of_birth: new Date(),
      gender: Gender.male,
    },
  });
  // seed brands
  const brands = ['Nike', 'Adidas', 'Gucci'];
  brands.forEach(async (e) => {
    await prisma.brand.create({
      data: {
        name: e,
      },
    });
  });
  // seed categories
  const categories = [
    CategoryName.sneakers,
    CategoryName.bag,
    CategoryName.apparel,
    CategoryName.accessories,
  ];
  categories.forEach(async (e) => {
    await prisma.category.create({
      data: {
        name: CategoryName[e],
      },
    });
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
