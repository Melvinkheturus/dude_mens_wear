import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { parseCSV, validateCSVHeaders } from '@/lib/csv-parser'

// CSV row validation schema
const csvRowSchema = z.object({
  product_handle: z.string().min(1, 'Product handle is required'),
  product_title: z.string().min(1, 'Product title is required'),
  product_description: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  variant_sku: z.string().min(1, 'Variant SKU is required'),
  variant_size: z.string().optional(),
  variant_color: z.string().optional(),
  price: z.string().refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num > 0
  }, 'Price must be a positive number'),
  discount_price: z.string().optional().refine((val) => {
    if (!val || val === '') return true
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }, 'Discount price must be a valid number'),
  stock: z.string().refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }, 'Stock must be a non-negative number'),
  image_urls: z.string().optional()
})

interface ValidationError {
  row: number
  column: string
  message: string
}

function validateCSVData(headers: string[], rows: string[][]): {
  validRows: number
  errors: ValidationError[]
} {
  const errors: ValidationError[] = []
  let validRows = 0

  // Check required headers
  const requiredHeaders = ['product_handle', 'product_title', 'variant_sku', 'price', 'stock']
  const headerErrors = validateCSVHeaders(headers, requiredHeaders)
  
  if (headerErrors.length > 0) {
    headerErrors.forEach(error => {
      errors.push({
        row: 0,
        column: 'headers',
        message: error
      })
    })
    return { validRows: 0, errors }
  }

  // Validate each row
  const skuSet = new Set<string>()
  
  rows.forEach((row, index) => {
    const rowNumber = index + 2 // +2 because index starts at 0 and we skip header row
    
    // Convert row array to object
    const rowData: Record<string, string> = {}
    headers.forEach((header, i) => {
      rowData[header] = row[i] || ''
    })

    // Check for duplicate SKUs
    const sku = rowData.variant_sku
    if (sku && skuSet.has(sku)) {
      errors.push({
        row: rowNumber,
        column: 'variant_sku',
        message: 'SKU already exists in this CSV'
      })
    } else if (sku) {
      skuSet.add(sku)
    }

    // Validate row data
    try {
      csvRowSchema.parse(rowData)
      validRows++
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          errors.push({
            row: rowNumber,
            column: err.path[0] as string,
            message: err.message
          })
        })
      }
    }
  })

  return { validRows, errors }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const csvText = await file.text()
    const { headers, rows, errors: parseErrors } = parseCSV(csvText)
    
    if (parseErrors.length > 0) {
      return NextResponse.json({ 
        error: `CSV parsing errors: ${parseErrors.join(', ')}` 
      }, { status: 400 })
    }
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file contains no data rows' }, { status: 400 })
    }

    if (rows.length > 1000) {
      return NextResponse.json({ error: 'CSV file too large (max 1000 rows)' }, { status: 400 })
    }

    const { validRows, errors } = validateCSVData(headers, rows)

    return NextResponse.json({
      headers,
      rows: rows.slice(0, 20), // Return first 20 rows for preview
      totalRows: rows.length,
      validRows,
      errors: errors.slice(0, 50) // Return first 50 errors
    })

  } catch (error) {
    console.error('CSV preview error:', error)
    
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
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
}