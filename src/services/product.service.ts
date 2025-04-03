import prisma from "../config/prisma";

// Define interface
interface ProductInput {
  id?: string;
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
  clientId: string;
  description?: string;
  images?: string[];
}



const getAllProducts = async () => {
  console.log('Fetching all products');
  try {
    const products = await prisma.product.findMany({
      include: { category: true, client: true },
    });
    console.log(`Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
    throw new Error(`Failed to fetch products: ${error}`);
  }
};

const getProductByClientId = async (clientId: string) => {
  console.log(`Fetching products for client: ${clientId}`);
  if (!clientId) {
    console.error('Client ID is missing');
    throw new Error("Client ID is required");
  }
  
  try {
    const products = await prisma.product.findMany({
      where: { clientId },
    });
    console.log(`Found ${products.length} products for client ${clientId}`);
    return products;
  } catch (error) {
    console.error(`Error fetching products for client ${clientId}: ${error}`);
    throw new Error(`Failed to fetch products for client ${clientId}: ${error}`);
  }
};

const createProduct = async (data: ProductInput) => {
  console.log('Creating new product:', { ...data, clientId: data.clientId });
  
  // Input validation
  if (!data.name || data.price < 0 || data.stock < 0) {
    console.error('Invalid product data:', data);
    throw new Error("Invalid product data");
  }

  try {
    console.log(`Looking up client: ${data.clientId}`);
    const client = await prisma.client.findUnique({
      where: { id: data.clientId }
    });

    if (!client) {
      console.error(`Client not found: ${data.clientId}`);
      throw new Error("Client does not exist");
    }

    // Generate product ID
    const productId = data.id || await generateProductId();
    console.log(`Generated product ID: ${productId}`);

    // Create product in database
    console.log('Creating product in database');
    const createdProduct = await prisma.product.create({
      data: {
        id: productId,
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        clientId: data.clientId,
        description: data.description,
      },
    });
    console.log('Product created successfully in database');

    return createdProduct;
  } catch (error) {
    console.error('Product creation failed:', error);
    throw new Error(`Product creation failed: ${error}`);
  }
};

// Helper function
const generateProductId = async (): Promise<string> => {
  console.log('Generating new product ID');
  try {
    const maxProduct = await prisma.product.findFirst({
      orderBy: { id: "desc" },
    });
    const newId = maxProduct ? (parseInt(maxProduct.id) + 1).toString() : "1";
    console.log(`Generated product ID: ${newId}`);
    return newId;
  } catch (error) {
    console.error('Error generating product ID:', error);
    throw error;
  }
};

const isProductAvailable = async (productId: string, quantity: number) => {
  console.log(`Checking availability of product: ${productId}`);
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock < quantity) {
      console.error(`Product ${productId} is not available`);
      return false;
    }

    console.log(`Product ${productId} is available`);
    return true;
  } catch (error) {
    console.error(`Error checking product availability: ${error}`);
    throw new Error(`Failed to check product availability: ${error}`);
  }
}

export default { getAllProducts, createProduct, getProductByClientId, isProductAvailable };
