export interface CSVParseResult {
  headers: string[]
  rows: string[][]
  errors: string[]
}

export function parseCSV(csvText: string): CSVParseResult {
  const errors: string[] = []
  
  try {
    const lines = csvText.trim().split('\n')
    
    if (lines.length === 0) {
      errors.push('CSV file is empty')
      return { headers: [], rows: [], errors }
    }

    // Parse headers
    const headers = parseCSVLine(lines[0])
    
    if (headers.length === 0) {
      errors.push('No headers found in CSV')
      return { headers: [], rows: [], errors }
    }

    // Parse data rows
    const rows: string[][] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue // Skip empty lines
      
      try {
        const row = parseCSVLine(line)
        
        // Pad row with empty strings if it has fewer columns than headers
        while (row.length < headers.length) {
          row.push('')
        }
        
        // Warn if row has more columns than headers
        if (row.length > headers.length) {
          errors.push(`Row ${i + 1} has more columns than headers`)
        }
        
        rows.push(row.slice(0, headers.length)) // Trim to header length
      } catch (error) {
        errors.push(`Error parsing row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return { headers, rows, errors }
    
  } catch (error) {
    errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { headers: [], rows: [], errors }
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  // Add the last field
  result.push(current.trim())
  
  return result.map(field => {
    // Remove surrounding quotes if present
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1)
    }
    return field
  })
}

export function validateCSVHeaders(headers: string[], requiredHeaders: string[]): string[] {
  const errors: string[] = []
  const headerSet = new Set(headers.map(h => h.toLowerCase()))
  
  for (const required of requiredHeaders) {
    if (!headerSet.has(required.toLowerCase())) {
      errors.push(`Missing required column: ${required}`)
    }
  }
  
  return errors
}

export function createCSVTemplate(): string {
  const headers = [
    'product_handle',
    'product_title', 
    'product_description',
    'category',
    'collection',
    'variant_sku',
    'variant_size',
    'variant_color',
    'price',
    'discount_price',
    'stock',
    'image_urls'
  ]
  
  const sampleRows = [
    [
      'classic-tshirt',
      'Classic T-Shirt',
      'Premium cotton tee for everyday wear',
      'shirts',
      'new-drops',
      'TSH-BLK-M',
      'M',
      'Black',
      '79900',
      '69900',
      '25',
      'tshirt-black-1.jpg|tshirt-black-2.jpg'
    ],
    [
      'classic-tshirt',
      'Classic T-Shirt',
      'Premium cotton tee for everyday wear',
      'shirts',
      'new-drops',
      'TSH-BLK-L',
      'L',
      'Black',
      '79900',
      '69900',
      '30',
      'tshirt-black-1.jpg|tshirt-black-2.jpg'
    ],
    [
      'denim-jacket',
      'Denim Jacket',
      'Classic blue denim jacket with vintage wash',
      'jackets',
      'essentials',
      'JKT-DEN-M',
      'M',
      'Blue',
      '149900',
      '',
      '15',
      'jacket-denim-1.jpg|jacket-denim-2.jpg|jacket-denim-3.jpg'
    ]
  ]
  
  const csvLines = [
    headers.join(','),
    ...sampleRows.map(row => row.map(cell => 
      cell.includes(',') || cell.includes('"') ? `"${cell.replace(/"/g, '""')}"` : cell
    ).join(','))
  ]
  
  return csvLines.join('\n')
}