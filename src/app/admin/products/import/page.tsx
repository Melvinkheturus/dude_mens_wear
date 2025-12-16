'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Upload, Download, AlertCircle, CheckCircle, X, FileText } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

interface ValidationError {
  row: number
  column: string
  message: string
}

interface ImportPreview {
  headers: string[]
  rows: any[][]
  totalRows: number
  validRows: number
  errors: ValidationError[]
}

export default function ProductImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; imported?: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setPreview(null)
    setImportResult(null)
    
    // Parse and preview CSV
    await parseCSV(selectedFile)
  }

  const parseCSV = async (file: File) => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/products/import/preview', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse CSV')
      }
      
      setPreview(result)
    } catch (error) {
      console.error('Failed to parse CSV:', error)
      alert('Failed to parse CSV file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!file || !preview) return
    
    setImporting(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }
      
      setImportResult({
        success: true,
        message: `Successfully imported ${result.imported} products`,
        imported: result.imported
      })
      
      // Clear form
      setFile(null)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Import failed:', error)
      setImportResult({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/products/import/template')
      const csvContent = await response.text()
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'product-import-template.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download template:', error)
      alert('Failed to download template')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bulk Product Import</h1>
          <p className="text-gray-600 mt-1">Import products and variants from CSV file</p>
        </div>
        <Button onClick={downloadTemplate} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={`mb-6 p-4 rounded-lg border ${
          importResult.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {importResult.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{importResult.message}</span>
          </div>
        </div>
      )}

      {/* File Upload */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">1. Upload CSV File</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {file ? file.name : 'Choose CSV file or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              CSV files only. Maximum file size: 10MB
            </p>
          </label>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            <button
              onClick={() => {
                setFile(null)
                setPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* CSV Format Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">CSV Format Requirements</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Required Columns:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• product_handle (unique identifier)</li>
              <li>• product_title</li>
              <li>• variant_sku (must be unique)</li>
              <li>• price (in paise, e.g., 79900 for ₹799)</li>
              <li>• stock (quantity available)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Optional Columns:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• product_description</li>
              <li>• category (will auto-create if missing)</li>
              <li>• collection (will auto-create if missing)</li>
              <li>• variant_size, variant_color</li>
              <li>• discount_price</li>
              <li>• image_urls (pipe-separated: img1.jpg|img2.jpg)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview */}
      {loading && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3">Parsing CSV...</span>
          </div>
        </div>
      )}

      {preview && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">2. Preview & Validation</h2>
            <div className="flex gap-2">
              <Badge variant="outline">
                {preview.totalRows} total rows
              </Badge>
              <Badge variant={preview.errors.length === 0 ? "default" : "destructive"}>
                {preview.validRows} valid rows
              </Badge>
              {preview.errors.length > 0 && (
                <Badge variant="destructive">
                  {preview.errors.length} errors
                </Badge>
              )}
            </div>
          </div>

          {/* Validation Errors */}
          {preview.errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Validation Errors:</h3>
              <div className="max-h-40 overflow-y-auto">
                {preview.errors.slice(0, 10).map((error, index) => (
                  <div key={index} className="text-sm text-red-700">
                    Row {error.row}: {error.column} - {error.message}
                  </div>
                ))}
                {preview.errors.length > 10 && (
                  <div className="text-sm text-red-600 mt-2">
                    ... and {preview.errors.length - 10} more errors
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Preview */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {preview.headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm border-r max-w-xs truncate">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.rows.length > 5 && (
              <div className="text-center py-2 text-sm text-gray-500 border-t">
                ... and {preview.rows.length - 5} more rows
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Button */}
      {preview && preview.errors.length === 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">3. Import Products</h2>
          <p className="text-gray-600 mb-4">
            Ready to import {preview.validRows} products. This action cannot be undone.
          </p>
          <Button 
            onClick={handleImport} 
            disabled={importing}
            className="bg-green-600 hover:bg-green-700"
          >
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import {preview.validRows} Products
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}