const fs = require('fs');

const path = './src/components/Settings/WorkspaceSettings/WorkspaceExplorer/index.tsx';
let data = fs.readFileSync(path, 'utf8');

const targetStartText = `        {
          id: "import_rules",
          label: language === "hi" ? "डेटा आयात निस्पंदन" : "Pipeline Ingestion Rules",`;
const targetStartIndex = data.indexOf(targetStartText);

const endText = "  const [levels, setLevels] = useState<LevelOneConfig[]>(() => {";
const endEndIndex = data.indexOf(endText, targetStartIndex) + endText.length;

if (targetStartIndex === -1 || targetEndIndex === -1) {
    console.error("Could not find bounds");
    process.exit(1);
}

const replacement = `        {
          id: "import_rules",
          label: language === "hi" ? "डेटा आयात निस्पंदन" : "Pipeline Ingestion Rules",
          description: language === "hi" ? "शून्य-मूल्य छोड़ना, विसंगत डेटा लॉग और फजी संरेखण" : "Drop zero-value rows, identify mismatched dates and fuzzy match ledgers",
          progress: 100,
          tabs: [
            {
              id: "imp_skip_zero",
              label: language === "hi" ? "शून्य-मूल्य वाली पंक्तियाँ छोड़ें" : "Skip Zero-Value Rows",
              description: language === "hi" ? "खाली वाउचर प्रविष्टियों को स्वचालित रूप से हटा दें" : "Automatically drop rows where both debit and credit amounts are zero",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            },
            {
              id: "imp_fuzzy_match",
              label: language === "hi" ? "फजी संरेखण सीमा" : "Fuzzy Matching Sensitivity Threshold",
              description: language === "hi" ? "बही नामों के मिलान का प्रतिशत" : "Matching confidence ratio required; higher means precise character matching is requested",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "75% (Recommended)",
              options: ["60% (Broad Lookup)", "75% (Recommended)", "85% (Strict Controls)", "95% (Absolute Identical)"]
            }
          ]
        },
        {
          id: "mapping_rules",
          label: language === "hi" ? "स्व-संरेखण कर नीतियां" : "Ledger Allocation Schema",
          description: language === "hi" ? "सक्रिय कर विभाजन नीतियां और अंतर-राज्य संवर्गीकरण" : "Define voucher narration analysis and state tax alignment rules",
          progress: 100,
          tabs: [
            {
              id: "map_tax_breakdown",
              label: language === "hi" ? "सक्रिय जीएसटी विभाजन मोड" : "Active GST Distribution Policy",
              description: language === "hi" ? "उत्पादकता का गंतव्य बनाम उत्पत्ति आधारित कर विभाजन" : "Determine CGST/SGST vs IGST based on destination address or merchant office state",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "Destination-driven (Default)",
              options: ["Destination-driven (Default)", "Source-origin (Inter-state only)"]
            },
            {
              id: "map_fallback_ledger",
              label: language === "hi" ? "असंगत प्रविष्टियों का मुख्य सस्पेंस खाता" : "Fallback Account Classifier",
              description: language === "hi" ? "यदि डेटा स्वचालित रूप से संरेखित नहीं होता है, तो अस्थायी खाता आवंटन" : "Fallback register code assigned to raw imports before human review is completed",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "input",
              currentValue: "Suspense Account"
            },
            {
              id: "map_auto_reconcile_match",
              label: language === "hi" ? "समान संरेखण पर तत्काल मिलान" : "Auto-reconcile Exact Matches",
              description: language === "hi" ? "यदि बही खाता पूर्ण रूप से मैच हो, तो सीधे स्वीकृत करें" : "Directly bypass manual verification stage for perfect characters mapping",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            }
          ]
        }
      ]
    },
    {
      id: "security_vault",
      label: language === "hi" ? "सुरक्षा व विनियामक लॉग" : "Security & Vault Controls",
      description: language === "hi" ? "डुअल- प्रमाणीकरण, डेटा एन्क्रिप्शन और विनियामक अनुपालन पैरामीटर" : "Multi-factor locks, data encryption vaults and statutory compliance logging",
      iconName: "shield",
      subpages: [
        {
          id: "security_locks",
          label: language === "hi" ? "पहुंच सुरक्षा मानदंड" : "Inactivity Security Controls",
          description: language === "hi" ? "ऑटो-लॉक, द्वि-चरणीय कोड और मजबूत पासवर्ड नीतियां" : "Periodic session logout parameters and credential strengths",
          progress: 100,
          tabs: [
            {
              id: "sec_lock_time",
              label: language === "hi" ? "ऑटो-लॉकआउट अंतराल (मिनट)" : "Auto Lock Trigger Interval",
              description: language === "hi" ? "निष्क्रिय होने पर लॉगआउट समय" : "Duration in minutes of total user inactivity before force lockout",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "15 minutes",
              options: ["5 minutes", "15 minutes", "30 minutes", "1 hour"]
            },
            {
              id: "sec_dual_auth",
              label: language === "hi" ? "बहु-स्तरीय सत्यापन" : "Multi-factor Vault Verification",
              description: language === "hi" ? "महत्वपूर्ण डेटा ऑपरेशन्स पर सुरक्षा कोड सत्यापन" : "Prompts secondary auth before executing massive deletions or data imports",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            },
            {
              id: "sec_pwd_policy",
              label: language === "hi" ? "मजबूत पासवर्ड संरचना नीति" : "Absolute Strict Password Layout",
              description: language === "hi" ? "विशेष अक्षरों और लंबाई को अनिवार्य बनाना" : "Force complex passwords requiring symbols and uppercase combinations",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            }
          ]
        },
        {
          id: "privacy_gdpr",
          label: language === "hi" ? "गोपनीयता और अनुपालन ऑडिट" : "Compliance & Privacy Audits",
          description: language === "hi" ? "जीडीपीआर इवेंट लॉग और डेटा मिटाने की समयावधि नियंत्रण" : "Compliance tracking, strict file encoding metadata and event purging",
          progress: 100,
          tabs: [
            {
              id: "compliance_gdpr",
              label: language === "hi" ? "डेटा गोपनीयता ऑडिट लॉग" : "GDPR Compliance Tracking Logs",
              description: language === "hi" ? "सभी संवेदनशील फ़ाइल निर्यात कार्यों को पंजीकृत करना" : "Log metadata and operational summaries forever for audit trails",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            },
            {
              id: "compliance_purge_months",
              label: language === "hi" ? "गतिविधि लॉग अवशोषण अवधि" : "Event Registry Purging Cycle",
              description: language === "hi" ? "गतिविधि को साफ़ करने की अंतिम समय सीमा" : "Duration of tracking record storage before purging cache files from localized memory",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "6 Months File Retention",
              options: ["3 Months File Retention", "6 Months File Retention", "12 Months File Retention", "Indefinite Storage"]
            }
          ]
        },
        {
          id: "users",
          label: language === "hi" ? "संस्थान उपयोगकर्ता और अनुमतियाँ" : "User Profiles & Permissions",
          description: language === "hi" ? "डिफ़ॉल्ट भूमिकाएँ, सत्र प्रमाणीकरण वैधता और आईपी एक्सेस लॉक" : "Configure organizational handler groups, dashboard clearance tiers, and secure nodes",
          progress: 100,
          tabs: [
            {
              id: "usr_default_role",
              label: language === "hi" ? "नवीनतम स्टाफ की डिफ़ॉल्ट भूमिका" : "New Team Account Default Role",
              description: language === "hi" ? "ऑटो-पंजीकृत क्रेडेंशियल्स के लिए न्यूनतम विशेषाधिकार" : "Set standard role assigned automatically to newly imported staff entries",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "Auditor (Read-Only)",
              options: ["Super Admin Coordinator", "Manager Analyst", "Staff Handler (Write-Only)", "Auditor (Read-Only)"]
            },
            {
              id: "usr_session_lifetime",
              label: language === "hi" ? "लॉगिन सत्र वैधता अवधि" : "Auth Session Token Lifetime",
              description: language === "hi" ? "सुरक्षित लॉगिन वेब पेज टोकन निष्क्रिय होने का समय" : "Duration of idle user authenticated session before prompting fresh password verification",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "8 Hours",
              options: ["1 Hour Strict Session", "8 Hours", "24 Hours", "7 Days Session"]
            },
            {
              id: "usr_ip_lock",
              label: language === "hi" ? "विशिष्ट संगठन आईपी तक लॉक" : "Enable Strict IP Access Lock",
              description: language === "hi" ? "केवल पूर्व-मंजूर वाईफ़ाई आईपी से ही लॉगिन करने की अनुमति दें" : "Do not permit remote external browser nodes to access the ledger sheet files",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: false
            }
          ]
        }
      ]
    },
    {
      id: "support_alerts",
      label: language === "hi" ? "वेबहुक, अलर्ट व फीडबैक" : "Support & Alerts Channels",
      description: language === "hi" ? "अलर्ट चैनल अधिसूचना, बाहरी एपीआई वेबहुक और क्लाउड सिंक" : "System notification toasts, failsafe webhook endpoints and ticket auto-syncs",
      iconName: "globe",
      subpages: [
        {
          id: "alerts_channel",
          label: language === "hi" ? "प्रणाली अलर्ट और अधिसूचना" : "Diagnostic Notification Hub",
          description: language === "hi" ? "ईमेल अलर्ट, स्क्रीन टोस्ट अधिसूचनाएं और त्रुटि वेबहुक यूआरएल" : "System report emails, error toasts, and webhook execution targets",
          progress: 100,
          tabs: [
            {
              id: "alert_email",
              label: language === "hi" ? "दैनिक ईमेल समीक्षा अलार्म" : "Daily Ingestion Email Summaries",
              description: language === "hi" ? "अधिकारी को आयातित विसंगतियों की सूची भेजना" : "Deliver complete daily summary emails covering imported data status and conflicts",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            },
            {
              id: "alert_webhook",
              label: language === "hi" ? "विफलता अलर्ट वेबहुक यूआरएल" : "Diagnostic Event Webhook Target",
              description: language === "hi" ? "आयात विफल होने पर बाहरी एपीआई को सूचित करने का यूआरएल" : "Receiver endpoint triggers JSON reports if high criticality verification checks fail",
              status: "Pending",
              lastUpdated: "2026-06-12",
              type: "input",
              currentValue: "https://api.bharatbook.com/v1/alerts"
            },
            {
              id: "alert_toast",
              label: language === "hi" ? "तत्काल स्क्रीन टोस्ट अलर्ट" : "Real-time Notification Toasts",
              description: language === "hi" ? "स्क्रीन पर वास्तविक समय बुलेटिन पॉप-अप सक्षम करें" : "Popup alerts for quick confirmations and import error warning badges",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            }
          ]
        },
        {
          id: "support_feedback",
          label: language === "hi" ? "क्लाउड सहायता एवं फीडबैक" : "Failsafe Support Sync",
          description: language === "hi" ? "क्लाउड टिकटों का स्वतः समन्वयन और नैदानिक आंकड़े" : "Background diagnostic collection, logs delivery and cloud tickets routing",
          progress: 100,
          tabs: [
            {
              id: "supp_auto_sync",
              label: language === "hi" ? "टिकटों का पृष्ठभूमि स्वतः सिंक्रोनाइज़" : "Direct Cloud Ticket Auto-Sync",
              description: language === "hi" ? "निर्मित समर्थन टिकटों को सीधे भारत बुक क्लाउड से जोड़ना" : "Sync raised help desk concerns to centralized enterprise databases instantly",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            },
            {
              id: "supp_telemetry",
              label: language === "hi" ? "अनाम नैदानिक डेटा रिपोर्टिंग" : "Anonymous Diagnostics Telemetry",
              description: language === "hi" ? "त्रुटि सुधार दर में सुधार के लिए अनाम डेटा संग्रह" : "Anonymized logs profiling to help refine parsing models algorithms over iterations",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            }
          ]
        },
        {
          id: "admin",
          label: language === "hi" ? "उन्नत प्रणाली प्रशासन" : "Advanced System Administration",
          description: language === "hi" ? "डेटाबेस पुनः अनुक्रमण, स्वचालित क्लाउड हॉट-मिरर शेड्यूलिंग और एरर प्रबंधन" : "Reindex database query performance nodes, maintain secure mirrors, and schedule cache cleanups",
          progress: 100,
          tabs: [
            {
              id: "adm_db_reindex",
              label: language === "hi" ? "बही खाता डेटाबेस पुनः इंडेक्सिंग चक्र" : "Routine Database Indexing Interval",
              description: language === "hi" ? "प्रश्न प्रतिक्रिया गति और बहीखाता रिपोर्ट प्रतिपादन को बढ़ाने के लिए अनुक्रमण" : "Automate performance maintenance routine tasks of relational indexes tables",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "Weekly (Sunday)",
              options: ["Daily at 02:00 AM", "Weekly (Sunday)", "On-Demand Only"]
            },
            {
              id: "adm_hot_mirror",
              label: language === "hi" ? "अतिरिक्त हॉट क्लाउड हॉट-मिरर" : "Redundant Remote Store Syncing",
              description: language === "hi" ? "डेटा हानि सुरक्षित करने के लिए अतिरिक्त भौगोलिक स्थान पर हॉट कॉपी सिंक" : "Perform real-time mirror transaction logs back-ups to dual remote secure locations",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "toggle",
              currentValue: true
            },
            {
              id: "adm_error_retention",
              label: language === "hi" ? "त्रुटि संदेश रिकॉर्ड संग्रहण अवधि" : "Maintain Diagnostic System Logs",
              description: language === "hi" ? "भविष्य के ऑडिट संरेखण के लिए इतिहास लॉग सहेजने की समय सीमा" : "Retention cycles period of physical diagnostic system traces files",
              status: "Configured",
              lastUpdated: "2026-06-12",
              type: "select",
              currentValue: "90 Days Log Retention",
              options: ["30 Days", "90 Days Log Retention", "Unlimited Records History"]
            }
          ]
        }
      ]
    }
  ];

  const [levels, setLevels] = useState<LevelOneConfig[]>(() => {`;

data = data.substring(0, targetStartIndex) + replacement + data.substring(endEndIndex);
fs.writeFileSync(path, data, 'utf8');
console.log('Fixed');
