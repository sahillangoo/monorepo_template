import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Starting database seeding...');

	// Create sample products
	const products = await Promise.all([
		prisma.product.upsert({
			where: { id: 'prod_1' },
			update: {},
			create: {
				id: 'prod_1',
				name: 'Sample Product 1',
				description: 'This is a sample product for testing',
				price: 29.99,
				category: 'Electronics',
				stock: 100,
				image: 'https://via.placeholder.com/300x300?text=Product+1'
			}
		}),
		prisma.product.upsert({
			where: { id: 'prod_2' },
			update: {},
			create: {
				id: 'prod_2',
				name: 'Sample Product 2',
				description: 'Another sample product for testing',
				price: 49.99,
				category: 'Clothing',
				stock: 50,
				image: 'https://via.placeholder.com/300x300?text=Product+2'
			}
		}),
		prisma.product.upsert({
			where: { id: 'prod_3' },
			update: {},
			create: {
				id: 'prod_3',
				name: 'Sample Product 3',
				description: 'Yet another sample product',
				price: 19.99,
				category: 'Books',
				stock: 200,
				image: 'https://via.placeholder.com/300x300?text=Product+3'
			}
		})
	]);

	console.log(`✅ Created ${products.length} products`);

	// Create sample user
	const user = await prisma.user.upsert({
		where: { email: 'test@example.com' },
		update: {},
		create: {
			email: 'test@example.com',
			name: 'Test User',
			password: 'hashed_password_here', // In real app, this should be properly hashed
			role: 'USER'
		}
	});

	console.log(`✅ Created user: ${user.email}`);

	console.log('🎉 Database seeding completed!');
}

main()
	.catch(e => {
		console.error('❌ Error during seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
