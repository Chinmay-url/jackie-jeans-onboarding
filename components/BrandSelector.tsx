'use client'

import { BRANDS, DENIM_SIZES } from '@/lib/questions'

interface Props {
  selectedBrands: string[]
  brandSizes: Record<string, string>
  onBrandsChange: (brands: string[]) => void
  onSizeChange: (brand: string, size: string) => void
  showSizes?: boolean
}

export default function BrandSelector({ selectedBrands, brandSizes, onBrandsChange, onSizeChange, showSizes }: Props) {
  const toggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand))
    } else {
      onBrandsChange([...selectedBrands, brand])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {BRANDS.map(brand => (
          <button
            key={brand}
            onClick={() => toggle(brand)}
            className={`px-3 py-2 rounded-xl text-sm font-body transition-all active:scale-95 ${
              selectedBrands.includes(brand)
                ? 'bg-[#2952A3] text-white'
                : 'bg-[#F5F0E8]/10 text-[#F5F0E8]/70 hover:bg-[#F5F0E8]/20'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {showSizes && selectedBrands.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-sm text-[#F5F0E8]/50 font-body">What size in each brand?</p>
          {selectedBrands.map(brand => (
            <div key={brand} className="flex items-center gap-3">
              <span className="text-sm text-[#F5F0E8] font-body w-32 shrink-0 truncate">{brand}</span>
              <select
                value={brandSizes[brand] || ''}
                onChange={e => onSizeChange(brand, e.target.value)}
                className="flex-1 bg-[#F5F0E8]/10 text-[#F5F0E8] rounded-xl px-3 py-2 text-sm font-body border border-[#F5F0E8]/10 focus:border-[#2952A3] outline-none"
              >
                <option value="" style={{ backgroundColor: '#1a1a1a', color: '#F5F0E8' }}>Select size</option>
                {DENIM_SIZES.map(s => (
                  <option key={s} value={s} style={{ backgroundColor: '#1a1a1a', color: '#F5F0E8' }}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
