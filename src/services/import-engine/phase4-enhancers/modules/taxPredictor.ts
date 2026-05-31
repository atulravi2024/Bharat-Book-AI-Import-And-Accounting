export const predictTax = (record: any) => {
  const enhanced = { ...record };
  const text = String(enhanced.particulars || enhanced.description || '').toLowerCase();
  const tags: string[] = enhanced._tags || [];

  if (text.includes('gst') || text.includes('igst') || text.includes('cgst') || text.includes('sgst')) {
    if (!tags.includes('Tax/GST Entry')) tags.push('Tax/GST Entry');
    enhanced._isTaxAutoTagged = true;
  }

  enhanced._tags = tags;
  return enhanced;
};
