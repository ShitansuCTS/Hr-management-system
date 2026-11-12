"use client";

import React from "react";
import {
    Landmark,
    CreditCard,
    Fingerprint,
    ShieldCheck,
    FileText,
    BriefcaseBusiness,
} from "lucide-react";
import ComingSoonSection from "../sharedUi/ComingSoonSection";

const maskValue = (value) => {
    if (!value) return "Not provided";

    const stringValue = String(value);

    if (stringValue.length <= 4) return "****";

    return `${"*".repeat(stringValue.length - 4)}${stringValue.slice(-4)}`;
};

const AccountInfoContent = ({ financialDetails }) => {
    const details = [
        {
            label: "Bank Name",
            value: financialDetails?.bankName,
            icon: Landmark,
            color: "primary",
        },
        {
            label: "Account Number",
            value: maskValue(financialDetails?.accountNo),
            icon: CreditCard,
            color: "success",
        },
        {
            label: "IFSC Code",
            value: financialDetails?.ifscCode,
            icon: Fingerprint,
            color: "warning",
        },
        {
            label: "PAN Number",
            value: maskValue(financialDetails?.panNumber),
            icon: FileText,
            color: "info",
        },
        {
            label: "UAN Number",
            value: maskValue(financialDetails?.uanNo),
            icon: BriefcaseBusiness,
            color: "danger",
        },
        {
            label: "ESIC Number",
            value: maskValue(financialDetails?.esicNo),
            icon: ShieldCheck,
            color: "secondary",
        },
    ];

    const hasDetails = details.some(
        (item) =>
            item.value &&
            item.value !== "Not provided"
    );

    if (!hasDetails) {
        return (
            <ComingSoonSection
                image="/illustrations/coming-soon.png"
                title="No Financial Information"
                description="Financial details are not available for this employee."
            />
        );
    }

    return (
        <div className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h5 className="fw-semibold mb-1">Financial Information</h5>
                    <p className="text-muted mb-0">
                        Employee bank and statutory account details.
                    </p>
                </div>

                <span className="badge bg-light text-success d-flex align-items-center gap-1">
                    <ShieldCheck size={15} />
                    Protected Information
                </span>
            </div>

            <div className="row g-3">
                {details.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div className="col-xl-4 col-md-6" key={item.label}>
                            <div className="card border shadow-none h-100 mb-0">
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div
                                            className={`avatar-text avatar-md bg-soft-${item.color} text-${item.color} flex-shrink-0`}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <div className="flex-grow-1">
                                            <span className="text-muted fw-medium d-block">
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>

                                    <h6 className="fw-bold mb-0 text-heading text-break">
                                        {item.value || "Not provided"}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AccountInfoContent;