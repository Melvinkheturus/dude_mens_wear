import { NextRequest, NextResponse } from 'next/server';
import { ShippingSettingsService } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await ShippingSettingsService.get();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Shipping settings not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to get shipping settings:', error);
    return NextResponse.json(
      { error: 'Failed to get shipping settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Validate numeric fields
    if (updates.flat_rate !== undefined && updates.flat_rate < 0) {
      return NextResponse.json(
        { error: 'Flat rate cannot be negative' },
        { status: 400 }
      );
    }
    
    if (updates.free_shipping_min !== undefined && updates.free_shipping_min < 0) {
      return NextResponse.json(
        { error: 'Free shipping minimum cannot be negative' },
        { status: 400 }
      );
    }
    
    // Remove fields that shouldn't be updated directly
    const { id, created_at, updated_at, ...validUpdates } = updates;
    
    const settings = await ShippingSettingsService.update(validUpdates);
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Failed to update shipping settings' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update shipping settings:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping settings' },
      { status: 500 }
    );
  }
}