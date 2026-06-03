export const enrichItemMaster = (record: any) => {
  const enhanced = { ...record };

  // Only apply to master types and specifically item masters
  if (enhanced._mappedAs === 'master' && [
    'items', 'basic_items', 'bom', 'variants', 'skus'
  ].includes(enhanced._type || '')) {
    
    // 1. If Code/SKU is empty, generate an aesthetic hyphenated one
    if (!enhanced.code && enhanced.name) {
      enhanced.code = String(enhanced.name)
        .toUpperCase()
        .replace(/[^A-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      enhanced._generatedCode = true;
    }

    const nameLower = String(enhanced.name || '').toLowerCase();

    // 2. Predict default parent/group categorization if blank
    if (!enhanced.group) {
      if (nameLower.includes('cable') || nameLower.includes('wire') || nameLower.includes('switch') || nameLower.includes('led')) {
        enhanced.group = 'Electricals';
        enhanced._predictedGroup = true;
      } else if (nameLower.includes('bolt') || nameLower.includes('screw') || nameLower.includes('nail') || nameLower.includes('bracket') || nameLower.includes('metal')) {
        enhanced.group = 'Hardware';
        enhanced._predictedGroup = true;
      } else if (nameLower.includes('oil') || nameLower.includes('lube') || nameLower.includes('grease') || nameLower.includes('chemical')) {
        enhanced.group = 'Lubricants & Chemicals';
        enhanced._predictedGroup = true;
      } else if (nameLower.includes('shirt') || nameLower.includes('jean') || nameLower.includes('fabric') || nameLower.includes('cotton')) {
        enhanced.group = 'Apparel & Textiles';
        enhanced._predictedGroup = true;
      } else {
        enhanced.group = 'General Stock';
        enhanced._predictedGroup = true;
      }
    }

    // 3. Predict Unit of Measure (UOM)
    if (!enhanced.uom) {
      if (nameLower.includes(' kg') || nameLower.includes('kilo') || nameLower.includes('gram') || nameLower.includes('ton')) {
        enhanced.uom = 'KG';
        enhanced._predictedUom = true;
      } else if (nameLower.includes(' ltr') || nameLower.includes('liter') || nameLower.includes('liquid') || nameLower.includes('ml')) {
        enhanced.uom = 'LTR';
        enhanced._predictedUom = true;
      } else if (nameLower.includes('box') || nameLower.includes('pack') || nameLower.includes('carton') || nameLower.includes('set')) {
        enhanced.uom = 'BOX';
        enhanced._predictedUom = true;
      } else if (nameLower.includes('meter') || nameLower.includes('yard') || nameLower.includes('inch') || nameLower.includes('feet')) {
        enhanced.uom = 'MTR';
        enhanced._predictedUom = true;
      } else {
        enhanced.uom = 'PCS';
        enhanced._predictedUom = true;
      }
    }
  }

  return enhanced;
};
