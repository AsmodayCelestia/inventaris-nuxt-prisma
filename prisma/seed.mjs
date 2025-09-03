// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join('prisma', 'seed', file), 'utf8'));
}

function toISO(dateStr) {
  return dateStr ? dateStr + 'T00:00:00.000Z' : null;
}

async function main() {
  console.log('🗑️  Cleaning database...');
  await prisma.inventory_maintenances.deleteMany();
  await prisma.inventories.deleteMany();
  await prisma.inventory_items.deleteMany();
  await prisma.item_types.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.brands.deleteMany();
  await prisma.users.deleteMany();
  await prisma.rooms.deleteMany();
  await prisma.floors.deleteMany();
  await prisma.location_units.deleteMany();
  await prisma.divisions.deleteMany();

  console.log('📥 Loading JSON files...');

  // 1. Seed master tanpa dependency
  await prisma.divisions.createMany({ data: loadJson('divisions.json') });
  await prisma.location_units.createMany({ data: loadJson('location_units.json') });
  await prisma.floors.createMany({ data: loadJson('floors.json') });
  await prisma.rooms.createMany({ data: loadJson('rooms.json') });

  // 2. Hash password & seed users
  const usersRaw = loadJson('users.json');
  const users = await Promise.all(
    usersRaw.map(async u => ({
      ...u,
      password: await bcrypt.hash(u.password, 10)
    }))
  );
  await prisma.users.createMany({ data: users });

  // 3. Seed lainnya
  await prisma.brands.createMany({ data: loadJson('brands.json') });
  await prisma.categories.createMany({ data: loadJson('categories.json') });
  await prisma.item_types.createMany({ data: loadJson('item_types.json') });
  await prisma.inventory_items.createMany({ data: loadJson('inventory_items.json') });

  // 4. Konversi tanggal untuk inventories
  const invRaw = loadJson('inventories.json');
  const inventories = invRaw.map(i => ({
    ...i,
    procurement_date: toISO(i.procurement_date),
    expected_replacement: toISO(i.expected_replacement),
    last_checked_at: toISO(i.last_checked_at),
    last_maintenance_at: toISO(i.last_maintenance_at),
    next_due_date: toISO(i.next_due_date),
  }));
  await prisma.inventories.createMany({ data: inventories });

  console.log('✅ All data seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());