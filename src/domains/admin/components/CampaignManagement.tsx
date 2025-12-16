'use client'

import { useState, useEffect } from 'react'
import { Campaign, CampaignSection } from '@/domains/campaign/types'
import { Plus, Edit, Eye, Trash2, Copy, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data: sections, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching homepage sections:', error)
        return
      }

      // Group sections into campaigns (for now, we'll create one campaign from all sections)
      if (sections && sections.length > 0) {
        const activeSections = sections.filter(s => s.is_active)
        const inactiveSections = sections.filter(s => !s.is_active)

        const campaignsList: Campaign[] = []

        if (activeSections.length > 0) {
          campaignsList.push({
            id: 'active-campaign',
            name: 'Active Homepage Campaign',
            description: 'Currently active homepage sections',
            status: 'active',
            sections: activeSections.map(section => ({
              id: section.id,
              type: section.section_type as any,
              title: section.title || '',
              subtitle: section.subtitle || undefined,
              enabled: section.is_active,
              order: section.display_order,
              config: section.config || {}
            })),
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          })
        }

        if (inactiveSections.length > 0) {
          campaignsList.push({
            id: 'draft-campaign',
            name: 'Draft Homepage Sections',
            description: 'Inactive homepage sections',
            status: 'draft',
            sections: inactiveSections.map(section => ({
              id: section.id,
              type: section.section_type as any,
              title: section.title || '',
              subtitle: section.subtitle || undefined,
              enabled: section.is_active,
              order: section.display_order,
              config: section.config || {}
            })),
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          })
        }

        setCampaigns(campaignsList)
      }
    } catch (error) {
      console.error('Error in fetchCampaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'archived':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600">Create and manage homepage campaigns</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {campaigns.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Draft</h3>
          <p className="text-2xl font-bold text-gray-600">
            {campaigns.filter(c => c.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
          <p className="text-2xl font-bold text-blue-600">
            {campaigns.filter(c => c.status === 'scheduled').length}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All Campaigns</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No campaigns found. Create homepage sections in the admin panel to see them here.</p>
            </div>
          ) : campaigns.map((campaign) => (
            <div key={campaign.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campaign.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  {campaign.description && (
                    <p className="text-gray-600 mb-2">{campaign.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{campaign.sections.length} sections</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Managed via Admin Panel
                    </span>
                    <span>Live from database</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Preview Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Campaign Preview: {selectedCampaign.name}</h2>
                <button 
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Sections ({selectedCampaign.sections.length})</h3>
                {selectedCampaign.sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">{section.type}</span>
                        <span className="text-xs text-gray-500">Order: {section.order}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          section.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {section.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    {section.title && (
                      <p className="font-medium">{section.title}</p>
                    )}
                    {section.subtitle && (
                      <p className="text-sm text-gray-600">{section.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}