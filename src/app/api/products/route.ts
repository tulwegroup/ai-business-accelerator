import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: { assets: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      products
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
    const { 
      title, 
      description, 
      type, 
      targetAudience, 
      problemStatement,
      ideaId 
    } = await request.json();

    let user = await db.userProfile.findFirst();
    if (!user) {
      user = await db.userProfile.create({
        data: {
          name: 'Creator',
          email: 'creator@example.com',
          background: 'dropshipping',
          facebookFollowers: 20000,
        }
      });
    }

    const product = await db.product.create({
      data: {
        userId: user.id,
        title,
        description: description || '',
        type: type || 'guide',
        targetAudience: targetAudience || '',
        problemStatement: problemStatement || '',
        currentStep: 1,
        status: 'concept',
        ideaId: ideaId || null
      }
    });

    // If this is from an idea, update the idea status
    if (ideaId) {
      await db.productIdea.update({
        where: { id: ideaId },
        data: { status: 'selected' }
      });
    }

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
    const { id, step, status, solution, pricing } = await request.json();

    const product = await db.product.update({
      where: { id },
      data: {
        currentStep: step,
        status: status,
        solution: solution,
        pricing: pricing
      }
    });

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
