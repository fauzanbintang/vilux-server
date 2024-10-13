import { Gender, PrismaClient, Role } from '@prisma/client';
import { hashPassword } from './helpers/bcrypt';
import brands from './seeds/brands.json';
import categories from './seeds/categories.json';

const prisma = new PrismaClient();
async function main() {
  await seedUsers();
  await seedBrands();
  await seedCategories();
  await seedServices();
  await seedFiles();
}

async function seedUsers() {
  await prisma.user.upsert({
    where: { email: 'admin@vilux.id' },
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
}

async function seedBrands() {
  for (const brand of brands) {
    let file;
    file = await prisma.file.findFirst({
      where: { url: brand.logoUrl },
      select: { id: true },
    });

    if (!file) {
      file = await prisma.file.upsert({
        where: { file_name: brand.brand },
        create: {
          file_name: brand.brand,
          path: `/${brand.brand}`,
          url: brand.logoUrl,
        },
        update: {
          file_name: brand.brand,
          path: `/${brand.brand}`,
          url: brand.logoUrl,
        },
      });
    }

    const existingBrand = await prisma.brand.findFirst({
      where: { name: brand.brand },
      select: { id: true },
    });

    if (!existingBrand) {
      await prisma.brand.create({
        data: {
          name: brand.brand,
          file_id: file.id,
        },
      });
    } else {
      await prisma.brand.update({
        where: { id: existingBrand.id },
        data: {
          name: brand.brand,
          file_id: file.id,
        },
      });
    }
  }
}

async function seedCategories() {
  for (const [categoryName, subcategories] of Object.entries(categories)) {
    let category = await prisma.category.findFirst({
      where: { name: categoryName.toLowerCase() },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName.toLowerCase() },
      });
    }

    for (const [subcategoryName, subcategoryData] of Object.entries(subcategories)) {
      let subcategory = await prisma.subcategory.findFirst({
        where: { name: subcategoryName.toLowerCase() },
      });

      if (!subcategory) {
        subcategory = await prisma.subcategory.create({
          data: {
            name: subcategoryName.toLowerCase(),
            category_id: category.id,
          },
        });
      }

      for (const instruction of subcategoryData.categoryInstructions) {
        const existingInstruction = await prisma.subcategoryInstruction.findFirst({
          where: { name: instruction.toLowerCase(), subcategory_id: subcategory.id },
        });

        if (!existingInstruction) {
          await prisma.subcategoryInstruction.create({
            data: {
              name: instruction.toLowerCase(),
              subcategory_id: subcategory.id,
            },
          });
        }
      }
    }
  }
}

async function seedServices() {
  const services = [
    {
      name: 'fast service',
      working_hours: 3,
      normal_price: 195000,
      vip_price: 160000,
    },
    {
      name: 'reguler service',
      working_hours: 24,
      normal_price: 145000,
      vip_price: 110000,
    },
  ];

  services.forEach(async (data) => {
    const service = await prisma.services.findFirst({
      where: { name: data.name },
      select: { id: true },
    });

    if (!service) {
      await prisma.services.create({
        data,
      });
    }
  });
}

async function seedFiles() {
  const files = [
    {
      name: 'fake-frame',
      url: 'https://ik.imagekit.io/viluxmedia/fake-certificate.png',
      path: "/fake-certificate.png"
    },
    {
      name: 'authentic-frame',
      url: 'https://ik.imagekit.io/viluxmedia/real-certificate.png',
      path: "/real-certificate.png"
    },
  ]

  files.forEach(async (data) => {
    const file = await prisma.file.findFirst({
      where: { url: data.url },
      select: { id: true },
    });

    if (!file) {
      await prisma.file.upsert({
        where: { file_name: data.name },
        create: {
          file_name: data.name,
          path: data.path,
          url: data.url,
        },
        update: {
          file_name: data.name,
          path: data.path,
          url: data.url,
        },
      });
    }
  })
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
