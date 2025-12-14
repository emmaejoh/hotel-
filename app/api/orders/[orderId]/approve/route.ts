import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Order from '@/models/Order';
import { IProduct } from '@/models/Product';
import dbConnect from '@/lib/db';

// PUT /api/orders/[orderId]/approve
// Accessible by: Customer
// Action: Approves the quoted price, calculates total, and confirms the order for preparation
export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);

  // 1. Authentication and Authorization
  if (!session || session.user.role !== 'Customer') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { orderId } = params;

    // 2. Find and Validate the Order
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Ensure the order belongs to the logged-in customer
    if (order.customer.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
    }

    if (order.status !== 'AWAITING_APPROVAL') {
      return NextResponse.json(
        { message: 'Order is not awaiting approval' },
        { status: 409 } // Conflict
      );
    }

    // 3. Calculate Total Price and Update Status
    let totalPrice = 0;
    for (const item of order.items) {
      const product = item.product as IProduct; // Use IProduct type
      if (product.category === 'Kitchen') {
        if (!item.quotedPrice) {
          return NextResponse.json(
            { message: `Item ${product.name} has not been quoted yet` },
            { status: 400 }
          );
        }
        totalPrice += item.quotedPrice * item.quantity;
      } else {
        // For Bar items, the price is on the product itself
        totalPrice += product.price * item.quantity;
      }
    }

    order.totalPrice = totalPrice;
    order.status = 'CONFIRMED';

    await order.save();

    // TODO: Trigger a real-time notification to the Kitchen/Supervisor dashboards

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error approving order:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
