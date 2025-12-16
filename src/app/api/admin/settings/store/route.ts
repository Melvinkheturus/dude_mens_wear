import { NextRequest, NextResponse } from 'next/server';
import { StoreSettingsService } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await StoreSettingsService.get();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Store settings not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to get store settings:', error);
    return NextResponse.json(
      { error: 'Failed to get store settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Validate required fields
    if (!updates.store_name) {
      return NextResponse.json(
        { error: 'Store name is required' },
        { status: 400 }
      );
    }
    
    // Remove fields that shouldn't be updated directly
    const { id, created_at, updated_at, ...validUpdates } = updates;
    
    const settings = await StoreSettingsService.update(validUpdates);
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Failed to update store settings' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update store settings:', error);
    return NextResponse.json(
      { error: 'Failed to update store settings' },
      { status: 500 }
    );
  }
}