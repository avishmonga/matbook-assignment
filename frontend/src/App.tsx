import { Link, Route, Routes, useLocation } from "react-router-dom";
import FormPage from "./routes/FormPage";
import SubmissionsPage from "./routes/SubmissionsPage";
import Navbar from "./components/layout/Navbar";
import PageContainer from "./components/layout/PageContainer";

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageContainer>
        <Routes location={location}>
          <Route path="/" element={<FormPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
        </Routes>
      </PageContainer>
    </div>
  );
}