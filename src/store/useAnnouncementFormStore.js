import { create } from "zustand";
import { toast } from "react-hot-toast";
import { useAnnouncementStore } from "./announcementStore";


export const useAnnouncementFormStore = create((set, get) => ({
    // Form State
    subject: "",
    mailBody: "",
    sendToAll: false,
    selectedEmail: null,

    // Email Options
    emailOptions: [],
    loading: false,

    // =========================
    // Fetch Emails
    // =========================
    fetchEmails: async () => {
        try {
            set({ loading: true });

            const response = await fetch("/api/users/emails");
            if (!response.ok) throw new Error();

            const data = await response.json();

            const options = data.emails.map((email) => ({
                value: email,
                label: email,
                icon: "feather-mail",
            }));

            set({
                emailOptions: options,
                loading: false,
            });
        } catch (error) {
            toast.error("Failed to load emails");
            set({ loading: false });
        }
    },

    // =========================
    // Send Email
    // =========================
    sendEmail: async () => {
        const { subject, mailBody, sendToAll, selectedEmail } = get();

        if (!subject.trim() || !mailBody.trim()) {
            toast.error("Subject and message are required");
            return;
        }

        if (!sendToAll && !selectedEmail) {
            toast.error("Please select a user email");
            return;
        }

        try {
            set({ loading: true });

            const payload = {
                subject: subject.trim(),
                mailBody: mailBody.trim(),
                sendType: sendToAll ? "ALL" : "INDIVIDUAL",
                emails: sendToAll ? [] : [selectedEmail.value],
            };

            const res = await fetch("/api/v1/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.message || "Failed to send email");
                return;
            }

            toast.success("Email sent successfully");

            // 🔥 PRO LEVEL: Refresh list automatically
            useAnnouncementStore.getState().fetchRecentAnnouncements(true);


            // Reset form
            set({
                subject: "",
                mailBody: "",
                sendToAll: false,
                selectedEmail: null,
                loading: false,
            });
        } catch (error) {
            toast.error("Something went wrong");
            set({ loading: false });
        }
    },

    // Simple setters
    setSubject: (value) => set({ subject: value }),
    setMailBody: (value) => set({ mailBody: value }),
    setSendToAll: (value) => set({ sendToAll: value }),
    setSelectedEmail: (value) => set({ selectedEmail: value }),
}));