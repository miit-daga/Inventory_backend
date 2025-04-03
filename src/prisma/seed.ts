import prisma from "../config/prisma";

async function main() {
    // Clean up existing data
    await prisma.$transaction([
        prisma.payment.deleteMany({}),
        prisma.cart.deleteMany({}),
        prisma.review.deleteMany({}),
        prisma.orderItem.deleteMany({}),
        prisma.order.deleteMany({}),
        prisma.userAddress.deleteMany({}),
        prisma.product.deleteMany({}),
        prisma.category.deleteMany({}),
        prisma.firebaseData.deleteMany({}),
        prisma.user.deleteMany({}),
        prisma.client.deleteMany({}),
        prisma.paymentMethod.deleteMany({})
    ]);
    console.log("Cleaned up existing data");

    // Create Payment Methods
    const paymentMethods = await prisma.paymentMethod.createMany({
        data: [
            { name: 'Credit Card' },
            { name: 'PayPal' },
            { name: 'Bank Transfer' },
        ],
    });
    console.log("Created payment methods");

    // Create Client
    const client = await prisma.client.create({
        data: {
            name: 'Test Store',
            email: 'store@example.com',
            password: 'hashedPassword123',
            phoneNumber: '+1234567890',
            brandName: 'Test Brand',
            firebaseData: {
                create: {
                    apiKey: 'your-api-key',
                    authDomain: 'your-auth-domain',
                    projectId: 'your-project-id',
                    storageBucket: 'your-storage-bucket',
                    messagingSenderId: 'your-messaging-sender-id',
                    appId: 'your-app-id',
                    measurementId: 'your-measurement-id'
                }
            }
        }
    });
    console.log(`Created client with ID: ${client.id}`);

    // Create Categories
    const categories = await prisma.category.createMany({
        data: [
            { name: 'Electronics', description: 'Electronic devices and accessories' },
            { name: 'Clothing', description: 'Fashion and apparel' },
            { name: 'Books', description: 'Books and publications' },
        ],
    });
    console.log("Created categories");

    // Get categories for reference
    const categoryList = await prisma.category.findMany();
    console.log("Fetched categories");

    // Create Products
    const products = await prisma.product.createMany({
        data: [
            {
                id: 'prod_1',
                name: 'Smartphone',
                description: 'Latest smartphone model',
                price: 99900,
                stock: 50,
                categoryId: categoryList[0].id,
                clientId: client.id,
                images: ['phone1.jpg', 'phone2.jpg']
            },
            {
                id: 'prod_2',
                name: 'T-Shirt',
                description: 'Cotton t-shirt',
                price: 1999,
                stock: 100,
                categoryId: categoryList[1].id,
                clientId: client.id,
                images: ['tshirt1.jpg']
            }
        ],
    });
    console.log("Created products");

    // Create Users
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword456',
            phoneNumber: '+1987654321',
            addresses: {
                create: {
                    address: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA'
                }
            }
        }
    });
    console.log(`Created user with ID: ${user.id}`);

    // Create Order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: 101899,
            status: 'COMPLETED',
            orderItems: {
                create: [
                    {
                        productId: 'prod_1',
                        quantity: 1,
                        price: 99900
                    },
                    {
                        productId: 'prod_2',
                        quantity: 1,
                        price: 1999
                    }
                ]
            },
            payment: {
                create: {
                    status: 'COMPLETED',
                    amount: 101899,
                    paymentMethodId: (await prisma.paymentMethod.findFirst())?.id
                }
            }
        }
    });
    console.log(`Created order with ID: ${order.id}`);

    // Create Reviews
    await prisma.review.createMany({
        data: [
            {
                userId: user.id,
                productId: 'prod_1',
                rating: 5,
                comment: 'Great smartphone!'
            },
            {
                userId: user.id,
                productId: 'prod_2',
                rating: 4,
                comment: 'Nice t-shirt, good quality'
            }
        ],
    });
    console.log("Created reviews");

    // Create Cart Items
    const cartItem = await prisma.cart.create({
        data: {
            userId: user.id,
            productId: 'prod_2',
            quantity: 2
        }
    });
    console.log(`Created cart item with ID: ${cartItem.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });