export default function InventoryPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Update Stock
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Low Stock</h3>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Out of Stock</h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">In Stock</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>
          
          <p className="text-gray-500">Inventory management will be displayed here</p>
        </div>
      </div>
    </div>
  );
}