export default function BannersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Banner
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Active Banners</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-800">Draft Banners</h3>
              <p className="text-2xl font-bold text-gray-600">0</p>
            </div>
          </div>
          
          <p className="text-gray-500">Banner management will be displayed here</p>
        </div>
      </div>
    </div>
  );
}