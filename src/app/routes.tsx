import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, ProtectedRoute } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { CreateTestPage, EditTestPage, PublishTestPage } from "@/features/tests";
import { AddQuestionsPage } from "@/features/questions";
import { AppLayout } from "./AppLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tests/new" element={<CreateTestPage />} />
        <Route path="/tests/:testId/edit" element={<EditTestPage />} />
        <Route path="/tests/:testId/questions" element={<AddQuestionsPage />} />
        <Route path="/tests/:testId/publish" element={<PublishTestPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
