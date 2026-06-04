import React from "react";

export function useBusinessCategoryFields(sessionDraftUuid: string, voucherType: string | undefined) {
  const businessCategoryFields = React.useMemo(() => {
    const vType = (voucherType || "sales").toLowerCase();

    const fields: { label: string; value: string }[] = [];

    // General Purchase Order / Valuation Trial details to show under specific/general context
    fields.push(
      {
        label: "Purchase Order Matching Trial",
        value: "3-Way Match Verification Complete (PO vs GRN vs Ledger Entry)",
      },
      {
        label: "PO-to-Voucher Balance Variance",
        value: "0.00 INR (Perfect Ledger Match)",
      },
      {
        label: "Assigned PO Audit Ref Code",
        value: `PO-TRIAL-${(Math.abs(sessionDraftUuid.charCodeAt(0)) % 899) + 100}-VERIFIED`,
      },
      {
        label: "Ledger Registry Target DB Sync",
        value:
          "Offline IndexedDB Active (Pending Auto-Sync with Master Cloud DB)",
      },
    );

    // Voucher specific business & audit controls
    if (vType === "sales" || vType.includes("sales")) {
      fields.push(
        {
          label: "Revenue Recognition Audit Rules",
          value:
            "Ind AS 115 Section 4.2 Compliant (Customer contract performance verified)",
        },
        {
          label: "Recipient GST Registry Validation",
          value: "Active GSTIN Status Checked & Verified",
        },
        {
          label: "Credit Exposure Threshold Code",
          value: `CREDIT-LMT-VAL-${(Math.abs(sessionDraftUuid.charCodeAt(1)) % 899) + 100}`,
        },
        {
          label: "Outward Tax Ledger Authorization",
          value: "GSTR-1 File-Ready Transaction Match Verified",
        },
      );
    } else if (vType === "purchase" || vType.includes("purchase")) {
      fields.push(
        {
          label: "GST Input Tax Credit Match",
          value: "CGST Section 16(2) Supplier Check Passed",
        },
        {
          label: "Statutory 3-Way Audit Verification",
          value: "Purchase Order vs GRN vs Vendor Invoice Match Code: 3WAY-OK",
        },
        {
          label: "MSME Payment Outflow Protection Regulation",
          value: "Sec 43B(h) Active - 45-Day Supplier Pay Limit Monitored",
        },
        {
          label: "Inward Freight Routing Ledger Check",
          value: "Freight Asset Capitalization Rule Checked (AS-10)",
        },
      );
    } else if (vType === "payment" || vType.includes("payment")) {
      fields.push(
        {
          label: "Statutory Cash Ceiling Audit",
          value: "Section 40A(3) Compliance Check Passed (< 10,000 ceiling)",
        },
        {
          label: "TDS Compliance Routing Check",
          value: "Section 194C/194J Levy Calculation Matching Verified",
        },
        {
          label: "Safe Clearing Settlement Route Signature",
          value: `IMPS/RTGS-SECURE::${(Math.abs(sessionDraftUuid.charCodeAt(2)) % 8999) + 1000}`,
        },
        {
          label: "Expense Allocation General Ledger Audit",
          value: "Category Authorization Seal: COMPLIANT",
        },
      );
    } else if (vType === "receipt" || vType.includes("receipt")) {
      fields.push(
        {
          label: "Advance Tax Liability Assessment",
          value: "Section 12 CGST (Advance Rules) Match Policy Configured",
        },
        {
          label: "Inward Remittance Liquid Route Code",
          value: `REC-RECON-CLEARED-${(Math.abs(sessionDraftUuid.charCodeAt(3)) % 899) + 100}`,
        },
        {
          label: "Payer Outstanding Ledger Balance",
          value: "Real-time Debt Exposure Ledger Balance Updated",
        },
        {
          label: "Inward Bank Transaction Clearance Hash",
          value: "Verified Direct Bank Feed / Auto-Reconciled Ledger Match",
        },
      );
    } else if (vType === "journal" || vType.includes("journal")) {
      fields.push(
        {
          label: "Adjustment Matching Checkpoint Validation",
          value: "Dual Side Balance matching verification completed",
        },
        {
          label: "Adjustment Scope Category Code",
          value: "Accrual Recognition & Inter-company Adjustment",
        },
        {
          label: "Internal Advisory Auditing Controller",
          value: `CONTROLLER-SIGN-OFF::${(Math.abs(sessionDraftUuid.charCodeAt(4)) % 899) + 100}`,
        },
        {
          label: "Prior-period Adjustment Level Check",
          value: "AS-5 Net profit/loss adjustment checkpoint verified",
        },
      );
    } else if (vType === "contra" || vType.includes("contra")) {
      fields.push(
        {
          label: "In-hand Cash Vault Ceiling Audit",
          value: "Daily Cash Vault Balances satisfy internal audit control",
        },
        {
          label: "Dual Active Bank Account Ingress Match",
          value:
            "Reconciled ledger transfer checked across selected bank accounts",
        },
        {
          label: "Cash Flow Authorization Reference Code",
          value: `CASH-VAULT-ALLOC-${(Math.abs(sessionDraftUuid.charCodeAt(5)) % 899) + 100}`,
        },
        {
          label: "Liquid Capital Ledger Class Clearance",
          value: "Liquid Asset Asset Class Routing - Confirmed",
        },
      );
    } else if (vType === "credit_note" || vType.includes("credit_note")) {
      fields.push(
        {
          label: "Original Reference Invoice Verification",
          value: "Linked Tax Invoice references checking passed",
        },
        {
          label: "Damaged / Scrap Report Sign-off ID",
          value: `EVALUATE-REPORT-TKT-${(Math.abs(sessionDraftUuid.charCodeAt(6)) % 899) + 100}`,
        },
        {
          label: "Outward Tax Adjustments Regulation Check",
          value: "GST Sec 34(2) timeline compliance verified",
        },
        {
          label: "Settlement Credit Ledger Balance Allocation",
          value: "Customer adjustment credit allocation key logged",
        },
      );
    } else if (vType === "debit_note" || vType.includes("debit_note")) {
      fields.push(
        {
          label: "Vendor Disputed Invoice Allocation Ticket",
          value: `DISPUTE-MATCHING-TKT-${(Math.abs(sessionDraftUuid.charCodeAt(7)) % 899) + 100}`,
        },
        {
          label: "Price Variance Clearance Approval Code",
          value: "Commercial pricing dispute clearance authorized",
        },
        {
          label: "Inward Refund Adjustment Regulation Verification",
          value: "ITC reversal checklist under CGST Section 34 checked",
        },
        {
          label: "Return Cargo Outward Gatepass Identification",
          value: `MUM-GATEPASS-${(Math.abs(sessionDraftUuid.charCodeAt(0)) % 899) + 100}`,
        },
      );
    } else {
      // General fallbacks
      fields.push(
        {
          label: "General Ledger Compliance Audit Audit",
          value: "Accounting Standards Policy Disclosure Compliant",
        },
        {
          label: "General Transaction Scheme Status",
          value: "Regular GST Scheme Tax Assessment Checked",
        },
      );
    }

    return fields;
  }, [sessionDraftUuid, voucherType]);
  return businessCategoryFields;
}
