export default function CouponsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Coupon
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Active Coupons</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Expiring Soon</h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total Used</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Coupon List</h3>
              <div className="flex gap-2">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Coupons</option>
                  <option>Active</option>
                  <option>Expired</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
            
            <p className="text-gray-500">Coupon management will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}