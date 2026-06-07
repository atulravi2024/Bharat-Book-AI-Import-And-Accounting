const fs = require('fs');

let content = fs.readFileSync('src/components/Settings/GeneralSettings.tsx', 'utf8');

// Update imports for index.tsx
content = content.replace(
  "import { useLanguage } from '../../context/LanguageContext';",
  "import { useLanguage } from '../../../context/LanguageContext';\nimport { AppearanceTab } from './tab/AppearanceTab';\nimport { RegionalTab } from './tab/RegionalTab';\nimport { SystemCoreTab } from './tab/SystemCoreTab';"
);
content = content.replace(
  "from '../icons/IconComponents';",
  "from '../../icons/IconComponents';"
);

// We want to replace the `renderXField()` functions with our Tabs.
// Instead of replacing functions, let's just replace their invocations.
// Look for {renderThemeField()} and replace it with passing props to AppearanceTab

// For the activeTab === "appearance"

let repl1 = `{activeTab === "appearance" && (
                hasAppearanceMatches ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20">
                        <LayoutIcon className="!text-[18px] flex items-center justify-center" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Appearance & UI")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Customize User Interface")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <AppearanceTab 
                        theme={theme} setTheme={setTheme}
                        density={density} setDensity={setDensity}
                        animations={animations} setAnimations={setAnimations}
                        soundEffects={soundEffects} setSoundEffects={setSoundEffects}
                        showTheme={showTheme} showDensity={showDensity}
                        showAnimations={showAnimations} showSoundEffects={showSoundEffects}
                      />
                    </div>
                  </div>
                ) : (`;

content = content.replace(/\{activeTab === "appearance" && \([\s\S]*?<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\s*\{showTheme && renderThemeField\(\)\}\s*\{showDensity && renderDensityField\(\)\}\s*\{showAnimations && renderAnimationsField\(\)\}\s*\{showSoundEffects && renderSoundEffectsField\(\)\}\s*<\/div>\s*<\/div>\s*\) : \(/m, repl1);

let repl2 = `{activeTab === "regional" && (
                hasRegionalMatches ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-500/20">
                        <MapIcon className="!text-[18px] flex items-center justify-center" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Regional Formats")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Localization Options")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <RegionalTab 
                        language={language} setLanguage={setLanguage}
                        dateFormat={dateFormat} setDateFormat={setDateFormat}
                        timezone={timezone} setTimezone={setTimezone}
                        weekStartsOn={weekStartsOn} setWeekStartsOn={setWeekStartsOn}
                        showLanguage={showLanguage} showDateFormat={showDateFormat}
                        showTimezone={showTimezone} showWeekStartsOn={showWeekStartsOn}
                      />
                    </div>
                  </div>
                ) : (`;

content = content.replace(/\{activeTab === "regional" && \([\s\S]*?<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\s*\{showLanguage && renderLanguageField\(\)\}\s*\{showDateFormat && renderDateFormatField\(\)\}\s*\{showTimezone && renderTimezoneField\(\)\}\s*\{showWeekStartsOn && renderWeekStartsOnField\(\)\}\s*<\/div>\s*<\/div>\s*\) : \(/m, repl2);

let repl3 = `{activeTab === "system" && (
                hasSystemMatches ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-500/20">
                        <SettingsIcon className="!text-[18px] flex items-center justify-center" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("System Core Features")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Advanced Operations")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <SystemCoreTab 
                        displayId={displayId} setDisplayId={setDisplayId}
                        appMode={appMode} setAppMode={setAppMode}
                        showSystemInfo={showSystemInfo} setShowSystemInfo={setShowSystemInfo}
                        autoLock={autoLock} setAutoLock={setAutoLock}
                        paginationSize={paginationSize} setPaginationSize={setPaginationSize}
                        keyboardShortcuts={keyboardShortcuts} setKeyboardShortcuts={setKeyboardShortcuts}
                        showDisplayId={showDisplayId} showAppMode={showAppMode}
                        showSystemInfoField={showSystemInfoField} showAutoLock={showAutoLock}
                        showPaginationSize={showPaginationSize} showKeyboardShortcuts={showKeyboardShortcuts}
                      />
                    </div>
                  </div>
                ) : (`;

content = content.replace(/\{activeTab === "system" && \([\s\S]*?<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\s*\{showDisplayId && renderDisplayIdField\(\)\}\s*\{showAppMode && renderAppModeField\(\)\}\s*\{showSystemInfoField && renderSystemInfoField\(\)\}\s*\{showAutoLock && renderAutoLockField\(\)\}\s*\{showPaginationSize && renderPaginationSizeField\(\)\}\s*\{showKeyboardShortcuts && renderKeyboardShortcutsField\(\)\}\s*<\/div>\s*<\/div>\s*\) : \(/m, repl3);

let repl4 = `{activeTab === "appearance" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20">
                    <LayoutIcon className="!text-[18px] flex items-center justify-center" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Appearance & UI")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Customize User Interface")}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AppearanceTab 
                    theme={theme} setTheme={setTheme}
                    density={density} setDensity={setDensity}
                    animations={animations} setAnimations={setAnimations}
                    soundEffects={soundEffects} setSoundEffects={setSoundEffects}
                    showTheme={true} showDensity={true}
                    showAnimations={true} showSoundEffects={true}
                  />
                </div>
              </div>
            )}`;

content = content.replace(/\{activeTab === "appearance" && \([\s\S]*?<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\s*\{renderThemeField\(\)\}\s*\{renderDensityField\(\)\}\s*\{renderAnimationsField\(\)\}\s*\{renderSoundEffectsField\(\)\}\s*<\/div>\s*<\/div>\s*\)/m, repl4);

let repl5 = `{activeTab === "regional" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-500/20">
                    <MapIcon className="!text-[18px] flex items-center justify-center" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Regional Formats")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Localization Options")}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <RegionalTab 
                    language={language} setLanguage={setLanguage}
                    dateFormat={dateFormat} setDateFormat={setDateFormat}
                    timezone={timezone} setTimezone={setTimezone}
                    weekStartsOn={weekStartsOn} setWeekStartsOn={setWeekStartsOn}
                    showLanguage={true} showDateFormat={true}
                    showTimezone={true} showWeekStartsOn={true}
                  />
                </div>
              </div>
            )}`;

content = content.replace(/\{activeTab === "regional" && \([\s\S]*?<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\s*\{renderLanguageField\(\)\}\s*\{renderDateFormatField\(\)\}\s*\{renderTimezoneField\(\)\}\s*\{renderWeekStartsOnField\(\)\}\s*<\/div>\s*<\/div>\s*\)/m, repl5);

let repl6 = `{activeTab === "system" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-500/20">
                    <SettingsIcon className="!text-[18px] flex items-center justify-center" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("System Core Features")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Advanced Operations")}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <SystemCoreTab 
                    displayId={displayId} setDisplayId={setDisplayId}
                    appMode={appMode} setAppMode={setAppMode}
                    showSystemInfo={showSystemInfo} setShowSystemInfo={setShowSystemInfo}
                    autoLock={autoLock} setAutoLock={setAutoLock}
                    paginationSize={paginationSize} setPaginationSize={setPaginationSize}
                    keyboardShortcuts={keyboardShortcuts} setKeyboardShortcuts={setKeyboardShortcuts}
                    showDisplayId={true} showAppMode={true}
                    showSystemInfoField={true} showAutoLock={true}
                    showPaginationSize={true} showKeyboardShortcuts={true}
                  />
                </div>
              </div>
            )}`;

content = content.replace(/\{activeTab === "system" && \([\s\S]*?<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">\s*\{renderDisplayIdField\(\)\}\s*\{renderAppModeField\(\)\}\s*\{renderSystemInfoField\(\)\}\s*\{renderAutoLockField\(\)\}\s*\{renderPaginationSizeField\(\)\}\s*\{renderKeyboardShortcutsField\(\)\}\s*<\/div>\s*<\/div>\s*\)/m, repl6);

// Delete the original render functions
content = content.replace(/const renderThemeField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderDensityField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderAnimationsField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderSoundEffectsField = \(\) => \([\s\S]*?\n  \);\n/, '');

content = content.replace(/const renderLanguageField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderDateFormatField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderTimezoneField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderWeekStartsOnField = \(\) => \([\s\S]*?\n  \);\n/, '');

content = content.replace(/const renderDisplayIdField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderAppModeField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderSystemInfoField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderAutoLockField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderPaginationSizeField = \(\) => \([\s\S]*?\n  \);\n/, '');
content = content.replace(/const renderKeyboardShortcutsField = \(\) => \([\s\S]*?\n  \);\n/, '');


const dir = 'src/components/Settings/GeneralSettings';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.writeFileSync('src/components/Settings/GeneralSettings/index.tsx', content);

console.log("Done refactoring GeneralSettings/index.tsx");
