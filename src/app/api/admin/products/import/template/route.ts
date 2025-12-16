import { NextResponse } from 'next/server'
import { createCSVTemplate } from '@/lib/csv-parser'

export async function GET() {
  try {
    const csvTemplate = createCSVTemplate()
    
    return new NextResponse(csvTemplate, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="product-import-template.csv"'
      }
    })
  } catch (error) {
    console.error('Failed to generate template:', error)
    
    if (error instanceof Error && (
      error.message === 'Authentication required' || 
      error.message === 'Admin access required'
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}