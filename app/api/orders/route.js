import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import { connectToDB } from '@/lib/db';

// Step 1: Customer selects food item -> Order status: PENDING_QUOTE
export async function POST(req) {
  try {
    await connectToDB();

    const { customer, items, room, orderType } = await req.json();

    // In a real application, you would perform validation here
    // and ensure the user is authenticated.

    const newOrder = new Order({
      customer,
      items,
      room,
      orderType,
      status: 'PENDING_QUOTE', // Initial status for kitchen orders
    });

    await newOrder.save();

    // Here you would trigger a real-time event to notify the kitchen staff
    // using Ably, Pusher, or a similar service.

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
  }
}
