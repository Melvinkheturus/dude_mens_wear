export default function OrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total Orders</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Completed</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Cancelled</h3>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
          </div>
          
          <p className="text-gray-500">Orders list will be displayed here</p>
        </div>
      </div>
    </div>
  );
}