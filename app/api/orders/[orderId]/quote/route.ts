import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Assumes authOptions are in this path
import Order from '@/models/Order';
import dbConnect from '@/lib/db'; // Assumes a db connection utility
import mongoose from 'mongoose';

// PUT /api/orders/[orderId]/quote
// Accessible by: Kitchen Staff
// Action: Submits a price for a food item and moves the order to AWAITING_APPROVAL
export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);

  // 1. Authentication and Authorization
  if (!session || session.user.role !== 'Staff' || session.user.department !== 'Kitchen') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { orderId } = params;
    const { itemId, price } = await request.json(); // Expecting the ID of the item within the order and the price

    if (!itemId || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // 2. Find and Validate the Order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'PENDING_QUOTE') {
      return NextResponse.json(
        { message: 'Order is not pending a quote' },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Update the specific item's price
    const itemToUpdate = order.items.find(
      (item: { _id: mongoose.Types.ObjectId }) => item._id.toString() === itemId
    );

    if (!itemToUpdate) {
        return NextResponse.json({ message: 'Item not found in order' }, { status: 404 });
    }

    itemToUpdate.quotedPrice = price;

    // 4. Update Order Status
    order.status = 'AWAITING_APPROVAL';

    await order.save();

    // TODO: Trigger a real-time notification to the customer (e.g., using Ably/Pusher)

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error updating order quote:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
