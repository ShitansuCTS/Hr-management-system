import { create } from "zustand";

const pendingRequests = new Map();
const CACHE_DURATION = 4 * 60 * 1000;
let storeVersion = 0;

async function requestJson(url, options = {}, fallbackMessage = "Profile request failed.") {
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...options,
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
}

function isFresh(fetchedAt) {
  return fetchedAt && Date.now() - fetchedAt < CACHE_DURATION;
}

function dedupeRequest(key, request) {
  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const promise = request().finally(() => {
    if (pendingRequests.get(key) === promise) pendingRequests.delete(key);
  });
  pendingRequests.set(key, promise);
  return promise;
}

export const useProfileStore = create((set, get) => ({
  profile: null,
  profileKey: null,
  profileFetchedAt: null,
  profileLoading: false,
  profileError: "",
  activities: [],
  activityEmployeeId: null,
  activitiesFetchedAt: null,
  activitiesLoading: false,
  activitiesError: "",
  documents: [],
  documentsEmployeeId: null,
  documentsFetchedAt: null,
  documentsLoading: false,
  documentsError: "",
  documentMutationLoading: false,

  fetchProfile: async (employeeId = null, force = false) => {
    const normalizedEmployeeId = employeeId?.trim() || null;
    const key = normalizedEmployeeId ? `employee:${normalizedEmployeeId}` : "self";
    const current = get();

    if (
      !force &&
      current.profileKey === key &&
      current.profile &&
      isFresh(current.profileFetchedAt)
    ) {
      return current.profile;
    }

    const requestKey = `profile:${key}`;
    const version = storeVersion;
    set({
      profile: current.profileKey === key ? current.profile : null,
      profileKey: key,
      profileLoading: true,
      profileError: "",
    });

    return dedupeRequest(requestKey, async () => {
      try {
        const url = normalizedEmployeeId
          ? `/api/v1/users/users-profile/${encodeURIComponent(normalizedEmployeeId)}`
          : "/api/auth/my-profile";
        const result = await requestJson(url, {}, "Unable to load profile.");
        const profile = normalizedEmployeeId ? result.data : result.user;

        if (!profile) throw new Error("Profile was not found.");

        if (version === storeVersion && get().profileKey === key) {
          set({
            profile,
            profileFetchedAt: Date.now(),
            profileLoading: false,
            profileError: "",
          });
        }

        return profile;
      } catch (error) {
        if (version === storeVersion && get().profileKey === key) {
          set({ profile: null, profileLoading: false, profileError: error.message });
        }
        throw error;
      }
    });
  },

  fetchActivities: async (employeeId, force = false) => {
    const normalizedEmployeeId = employeeId?.trim();
    if (!normalizedEmployeeId) return [];

    const current = get();
    if (
      !force &&
      current.activityEmployeeId === normalizedEmployeeId &&
      isFresh(current.activitiesFetchedAt)
    ) {
      return current.activities;
    }

    const requestKey = `activities:${normalizedEmployeeId}`;
    const version = storeVersion;
    set({
      activities: current.activityEmployeeId === normalizedEmployeeId ? current.activities : [],
      activityEmployeeId: normalizedEmployeeId,
      activitiesLoading: true,
      activitiesError: "",
    });

    return dedupeRequest(requestKey, async () => {
      try {
        const result = await requestJson(
          `/api/v1/users/users-profile/${encodeURIComponent(normalizedEmployeeId)}/activity`,
          {},
          "Unable to load employee activity."
        );
        const activities = result.data?.activities || [];

        if (version === storeVersion && get().activityEmployeeId === normalizedEmployeeId) {
          set({
            activities,
            activitiesFetchedAt: Date.now(),
            activitiesLoading: false,
            activitiesError: "",
          });
        }

        return activities;
      } catch (error) {
        if (version === storeVersion && get().activityEmployeeId === normalizedEmployeeId) {
          set({ activities: [], activitiesLoading: false, activitiesError: error.message });
        }
        throw error;
      }
    });
  },

  fetchDocuments: async (employeeId, force = false) => {
    const normalizedEmployeeId = employeeId?.trim();
    if (!normalizedEmployeeId) return [];

    const current = get();
    if (
      !force &&
      current.documentsEmployeeId === normalizedEmployeeId &&
      isFresh(current.documentsFetchedAt)
    ) {
      return current.documents;
    }

    const requestKey = `documents:${normalizedEmployeeId}`;
    const version = storeVersion;
    set({
      documents: current.documentsEmployeeId === normalizedEmployeeId ? current.documents : [],
      documentsEmployeeId: normalizedEmployeeId,
      documentsLoading: true,
      documentsError: "",
    });

    return dedupeRequest(requestKey, async () => {
      try {
        const result = await requestJson(
          `/api/v1/users/${encodeURIComponent(normalizedEmployeeId)}/documents`,
          {},
          "Unable to load employee documents."
        );
        const documents = result.data || [];

        if (version === storeVersion && get().documentsEmployeeId === normalizedEmployeeId) {
          set({
            documents,
            documentsFetchedAt: Date.now(),
            documentsLoading: false,
            documentsError: "",
          });
        }

        return documents;
      } catch (error) {
        if (version === storeVersion && get().documentsEmployeeId === normalizedEmployeeId) {
          set({ documents: [], documentsLoading: false, documentsError: error.message });
        }
        throw error;
      }
    });
  },

  uploadDocument: async (employeeId, formData) => {
    const normalizedEmployeeId = employeeId?.trim();
    if (!normalizedEmployeeId) throw new Error("Employee ID is required.");

    set({ documentMutationLoading: true });
    try {
      const result = await requestJson(
        `/api/v1/users/${encodeURIComponent(normalizedEmployeeId)}/documents`,
        { method: "POST", body: formData },
        "Document upload failed."
      );
      try {
        await get().fetchDocuments(normalizedEmployeeId, true);
      } catch (error) {
        console.error("Document uploaded, but the document list could not be refreshed:", error);
      }
      return result;
    } finally {
      set({ documentMutationLoading: false });
    }
  },

  deleteDocument: async (employeeId, documentId) => {
    const normalizedEmployeeId = employeeId?.trim();
    if (!normalizedEmployeeId) throw new Error("Employee ID is required.");

    set({ documentMutationLoading: true });
    try {
      const result = await requestJson(
        `/api/v1/users/${encodeURIComponent(normalizedEmployeeId)}/documents/${encodeURIComponent(documentId)}`,
        { method: "DELETE" },
        "Document deletion failed."
      );
      set((state) => ({
        documents:
          state.documentsEmployeeId === normalizedEmployeeId
            ? state.documents.filter((document) => document.id !== documentId)
            : state.documents,
        documentsFetchedAt: Date.now(),
      }));
      return result;
    } finally {
      set({ documentMutationLoading: false });
    }
  },

  clearProfileData: () => {
    storeVersion += 1;
    pendingRequests.clear();
    set({
      profile: null,
      profileKey: null,
      profileFetchedAt: null,
      profileLoading: false,
      profileError: "",
      activities: [],
      activityEmployeeId: null,
      activitiesFetchedAt: null,
      activitiesLoading: false,
      activitiesError: "",
      documents: [],
      documentsEmployeeId: null,
      documentsFetchedAt: null,
      documentsLoading: false,
      documentsError: "",
      documentMutationLoading: false,
    });
  },
}));
