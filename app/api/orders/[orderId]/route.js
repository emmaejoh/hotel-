import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import { connectToDB } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const order = await Order.findById(params.orderId).populate('customer').populate('items.product');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching order', error: error.message }, { status: 500 });
  }
}


// This handles both the kitchen staff updating the price and the customer approving it.
export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const { orderId } = params;
    const body = await req.json();

    const { status, items } = body;

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Step 2: Kitchen Staff sees the order -> Inputs the current price -> Order status: AWAITING_APPROVAL
    // A staff member sends a request with the updated items array (including prices) and the new status.
    if (order.status === 'PENDING_QUOTE' && status === 'AWAITING_APPROVAL' && items) {
      // In a real app, verify the user is Kitchen Staff
      let total = 0;
      order.items.forEach(orderItem => {
          const updatedItem = items.find(i => i.product.toString() === orderItem.product.toString());
          if(updatedItem && updatedItem.price) {
              orderItem.price = updatedItem.price;
              total += orderItem.price * orderItem.quantity;
          }
      });
      order.total = total;
      order.status = 'AWAITING_APPROVAL';

      await order.save();
      // Trigger real-time notification to customer
      return NextResponse.json(order);
    }

    // Step 3: Customer receives notification of price -> Clicks "Approve" -> Order status: CONFIRMED
    // The customer sends a request with status: 'CONFIRMED'
    if (order.status === 'AWAITING_APPROVAL' && status === 'CONFIRMED') {
      // In a real app, verify the user is the customer who owns the order
      order.status = 'CONFIRMED';
      await order.save();
      // Trigger real-time notification to kitchen
      return NextResponse.json(order);
    }

    // Handle other valid status transitions to prevent arbitrary updates
    const validTransitions = {
        'CONFIRMED': ['IN_PROGRESS', 'CANCELLED'],
        'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
        'AWAITING_APPROVAL': ['CANCELLED'], // Customer can cancel before approving
        'PENDING_QUOTE': ['CANCELLED'], // Customer can cancel before quote
    };

    if (status && validTransitions[order.status]?.includes(status)) {
        // In a real app, you'd also check user roles for these transitions
        order.status = status;
        await order.save();
        return NextResponse.json(order);
    }

    return NextResponse.json({
        message: `Invalid status transition from ${order.status} to ${status}`
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: 'Error updating order', error: error.message }, { status: 500 });
  }
}
