import { routeToMapper } from './phase2-mappers/mapperRegistry';
import { applyCleaningRules } from './phase3-cleaners/cleanerFactory';
import { applyEnhancements } from './phase4-enhancers/enhancerFactory';

/**
 * Main Controller for navigating through Phases 2 to 4
 */
export const runImportPipeline = (
  rawRow: any,
  dataType: string,
  specificType?: string,
  mapping?: Record<string, string>
) => {
  // Phase 2
  const mapped = routeToMapper(rawRow, dataType, specificType, mapping);
  
  // Phase 3
  const cleaned = applyCleaningRules(mapped);
  
  // Phase 4
  const enhanced = applyEnhancements(cleaned);
  
  return enhanced;
};
