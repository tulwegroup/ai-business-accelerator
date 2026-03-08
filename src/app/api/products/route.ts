import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for products
const productsStore: Array<{
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  currentStep: number;
  createdAt: Date;
}> = [];

let productsIdCounter = 0;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      products: productsStore
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, type } = await request.json();

    const product = {
      id: `product-${++productsIdCounter}`,
      title: title || 'Untitled Product',
      description: description || '',
      type: type || 'guide',
      status: 'concept',
      currentStep: 1,
      createdAt: new Date(),
    };

    productsStore.unshift(product);

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, step, status } = await request.json();

    const productIndex = productsStore.findIndex(p => p.id === id);
    if (productIndex >= 0) {
      productsStore[productIndex] = {
        ...productsStore[productIndex],
        currentStep: step ?? productsStore[productIndex].currentStep,
        status: status ?? productsStore[productIndex].status,
      };

      return NextResponse.json({
        success: true,
        product: productsStore[productIndex]
      });
    }

    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
