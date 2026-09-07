"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { normalizeDepartmentName } from "@/lib/department-names";

const SubmissionsContext = createContext({
  submittedDepartments: [],
  isLoadingSubmissions: false,
  markDepartmentsSubmitted: () => {},
  refreshSubmissions: async () => {},
});

export function SubmissionsProvider({ children }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const fetchSubmissions = useCallback(async (email) => {
    if (!email) return;
    const cacheKey = `submitted_depts_${email}`;
    const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
    if (cached) {
      try {
        setSubmittedDepartments(JSON.parse(cached).map(normalizeDepartmentName));
        return;
      } catch {}
    }

    setIsLoadingSubmissions(true);
    try {
      const res = await fetch("/api/check-applications");
      const data = await res.json();
      if (data?.submittedDepartments) {
        setSubmittedDepartments(data.submittedDepartments.map(normalizeDepartmentName));
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cacheKey, JSON.stringify(data.submittedDepartments));
        }
      }
    } catch (err) {
      console.error("Error checking user submissions:", err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchSubmissions(user.email);
    } else {
      setSubmittedDepartments([]);
    }
  }, [user?.email, fetchSubmissions]);

  const markDepartmentsSubmitted = useCallback((newDepartments) => {
    setSubmittedDepartments((prev) => {
      const merged = [...new Set([...prev, ...newDepartments])];
      if (typeof window !== "undefined" && user?.email) {
        sessionStorage.setItem(`submitted_depts_${user.email}`, JSON.stringify(merged));
      }
      return merged;
    });
  }, [user?.email]);

  const refreshSubmissions = useCallback(async () => {
    if (user?.email) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`submitted_depts_${user.email}`);
      }
      await fetchSubmissions(user.email);
    }
  }, [user?.email, fetchSubmissions]);

  return (
    <SubmissionsContext.Provider
      value={{
        submittedDepartments,
        isLoadingSubmissions,
        markDepartmentsSubmitted,
        refreshSubmissions,
      }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  return useContext(SubmissionsContext);
}
