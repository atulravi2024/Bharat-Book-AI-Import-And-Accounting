
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsIcon, DeleteIcon, AddIcon } from '../icons/IconComponents';
import { BasicRuleSection } from './MappingRuleSettings/BasicRuleSection.tsx';
import { ListRuleSection } from './MappingRuleSettings/ListRuleSection.tsx';
import { PatternRuleSection } from './MappingRuleSettings/PatternRuleSection.tsx';
import { MappingListSection } from './MappingRuleSettings/MappingListSection.tsx';
import { SandboxSection } from './MappingRuleSettings/SandboxSection.tsx';

interface MappingSettingsProps {
    advancedParsingEnabled: boolean;
    setAdvancedParsingEnabled: (val: boolean) => void;
    toggles: {
        stripEntitySuffixes: boolean;
        mobileNumberExtractor: boolean;
        fuzzyLogic: boolean;
        continuousLearning: boolean;
        autoContraDetection: boolean;
        identifyMobileTransfer: boolean;
        autoDetectGstin: boolean;
        autoDetectPanTan: boolean;
    };
    handleToggle: (key: any) => void;
    customMappingRules: {id: string, keyword: string, targetField: 'partyName' | 'ledger' | 'type', targetValue: string, priority?: number, isRegex?: boolean}[];
    setCustomMappingRules: (rules: any) => void;
    bankMappings: {name: string, no: string, type: string}[];
    setBankMappings: (mappings: any) => void;
    bankChargesKeywords: string;
    setBankChargesKeywords: (val: string) => void;
    cashFlowKeywords: string;
    setCashFlowKeywords: (val: string) => void;
    selfTransferKeywords: string;
    setSelfTransferKeywords: (val: string) => void;
    mappingRules: {kw: string, led: string}[];
    setMappingRules: (rules: any) => void;
    missingMasterAction: string;
    setMissingMasterAction: (val: string) => void;
    processingPriority: string;
    setProcessingPriority: (val: string) => void;
    aliases: {from: string, to: string}[];
    setAliases: (aliases: any) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    showAliasModal: boolean;
    setShowAliasModal: (show: boolean) => void;
    sandboxInput: string;
    setSandboxInput: (val: string) => void;
    runSandboxSimulator: () => void;
    sandboxResult: any;
    runBulkSimulator: (inputs: string[]) => void;
    bulkSandboxResults: any[];
    setBulkSandboxResults: (results: any[]) => void;
    // Structural Settings
    sourceColumn: string;
    setSourceColumn: (val: string) => void;
    splitDelimiter: string;
    setSplitDelimiter: (val: string) => void;
    ignoreExtractionKeywords: string;
    setIgnoreExtractionKeywords: (val: string) => void;
    partyNameLocation: string;
    setPartyNameLocation: (val: string) => void;
    utrExtractorType: string;
    setUtrExtractorType: (val: string) => void;
    accountNumberDetection: string;
    setAccountNumberDetection: (val: string) => void;
    // Noise Lists
    bankShortCodes: string;
    setBankShortCodes: (val: string) => void;
    bankIgnoreWords: string;
    setBankIgnoreWords: (val: string) => void;
    paymentModes: string;
    setPaymentModes: (val: string) => void;
    paymentChannels: string;
    setPaymentChannels: (val: string) => void;
    ifscPrefixes: string;
    setIfscPrefixes: (val: string) => void;
}

export const MappingSettings: React.FC<MappingSettingsProps> = ({
    advancedParsingEnabled, setAdvancedParsingEnabled,
    toggles, handleToggle,
    customMappingRules, setCustomMappingRules,
    bankMappings, setBankMappings,
    bankChargesKeywords, setBankChargesKeywords,
    cashFlowKeywords, setCashFlowKeywords,
    selfTransferKeywords, setSelfTransferKeywords,
    mappingRules, setMappingRules,
    missingMasterAction, setMissingMasterAction,
    processingPriority, setProcessingPriority,
    aliases, setAliases,
    fileInputRef,
    showAliasModal,
    setShowAliasModal,
    sandboxInput, setSandboxInput,
    runSandboxSimulator,
    sandboxResult,
    runBulkSimulator,
    bulkSandboxResults,
    setBulkSandboxResults,
    sourceColumn, setSourceColumn,
    splitDelimiter, setSplitDelimiter,
    ignoreExtractionKeywords, setIgnoreExtractionKeywords,
    partyNameLocation, setPartyNameLocation,
    utrExtractorType, setUtrExtractorType,
    accountNumberDetection, setAccountNumberDetection,
    bankShortCodes, setBankShortCodes,
    bankIgnoreWords, setBankIgnoreWords,
    paymentModes, setPaymentModes,
    paymentChannels, setPaymentChannels,
    ifscPrefixes, setIfscPrefixes
}) => {
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = React.useState<string | null>(null);
    const [sandboxMode, setSandboxMode] = React.useState<'single' | 'bulk'>('single');

    const toggleSection = (section: string) => {
        setActiveSection(prev => prev === section ? null : section);
    };

    const isSectionOpen = (section: string) => activeSection === section;

    return (
        <div className="bg-white w-full border-t border-b border-gray-100 relative overflow-hidden dark:bg-gray-800 dark:border-gray-800">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest my-6 flex items-center px-4 dark:text-white">
                <SettingsIcon className="mr-3 text-blue-600" /> {t("Mapping & Narration Parsing")}
            </h3>

            {/* 1. Basic Rule Section */}
            <BasicRuleSection 
                isOpen={isSectionOpen('basic')}
                toggleSection={() => toggleSection('basic')}
                toggles={toggles}
                handleToggle={handleToggle}
                missingMasterAction={missingMasterAction}
                setMissingMasterAction={setMissingMasterAction}
                processingPriority={processingPriority}
                setProcessingPriority={setProcessingPriority}
            />

            {/* 2. List Rule Section */}
            <ListRuleSection 
                isOpen={isSectionOpen('list')}
                toggleSection={() => toggleSection('list')}
                toggles={toggles}
                handleToggle={handleToggle}
                bankShortCodes={bankShortCodes}
                setBankShortCodes={setBankShortCodes}
                bankIgnoreWords={bankIgnoreWords}
                setBankIgnoreWords={setBankIgnoreWords}
                paymentModes={paymentModes}
                setPaymentModes={setPaymentModes}
                paymentChannels={paymentChannels}
                setPaymentChannels={setPaymentChannels}
                ifscPrefixes={ifscPrefixes}
                setIfscPrefixes={setIfscPrefixes}
            />

            {/* 3. Pattern Rule Section */}
            <PatternRuleSection 
                isOpen={isSectionOpen('pattern')}
                toggleSection={() => toggleSection('pattern')}
                toggles={toggles}
                handleToggle={handleToggle}
                advancedParsingEnabled={advancedParsingEnabled}
                setAdvancedParsingEnabled={setAdvancedParsingEnabled}
                aliases={aliases}
                setAliases={setAliases}
                fileInputRef={fileInputRef}
                showAliasModal={showAliasModal}
                setShowAliasModal={setShowAliasModal}
                sourceColumn={sourceColumn}
                setSourceColumn={setSourceColumn}
                splitDelimiter={splitDelimiter}
                setSplitDelimiter={setSplitDelimiter}
                ignoreExtractionKeywords={ignoreExtractionKeywords}
                setIgnoreExtractionKeywords={setIgnoreExtractionKeywords}
                partyNameLocation={partyNameLocation}
                setPartyNameLocation={setPartyNameLocation}
                utrExtractorType={utrExtractorType}
                setUtrExtractorType={setUtrExtractorType}
                accountNumberDetection={accountNumberDetection}
                setAccountNumberDetection={setAccountNumberDetection}
            />

            {/* 4. Mapping List Section */}
            <MappingListSection 
                isOpen={isSectionOpen('mappingList')}
                toggleSection={() => toggleSection('mappingList')}
                toggles={toggles}
                handleToggle={handleToggle}
                customMappingRules={customMappingRules}
                setCustomMappingRules={setCustomMappingRules}
                bankMappings={bankMappings}
                setBankMappings={setBankMappings}
                bankChargesKeywords={bankChargesKeywords}
                setBankChargesKeywords={setBankChargesKeywords}
                cashFlowKeywords={cashFlowKeywords}
                setCashFlowKeywords={setCashFlowKeywords}
                selfTransferKeywords={selfTransferKeywords}
                setSelfTransferKeywords={setSelfTransferKeywords}
                mappingRules={mappingRules}
                setMappingRules={setMappingRules}
            />

            {/* 5. Sandbox Section */}
            <SandboxSection 
                isOpen={isSectionOpen('sandbox')}
                toggleSection={() => toggleSection('sandbox')}
                toggles={toggles}
                handleToggle={handleToggle}
                sandboxMode={sandboxMode}
                setSandboxMode={setSandboxMode}
                sandboxInput={sandboxInput}
                setSandboxInput={setSandboxInput}
                runSandboxSimulator={runSandboxSimulator}
                sandboxResult={sandboxResult}
                runBulkSimulator={runBulkSimulator}
                bulkSandboxResults={bulkSandboxResults}
                setBulkSandboxResults={setBulkSandboxResults}
            />
        </div>
    );
};
