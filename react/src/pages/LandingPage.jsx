import React, { useEffect } from "react";
import { useLangauge } from "../utilis/useLanguage";
import { useNavigate } from "react-router-dom";
import LandingPageNavbar from "../components/navbar/LandingPageNavbar";
import { usePageLanguage } from "../utilis/usePageLanguage";

function LandingPage() {
  const getLanguageData = useLangauge();
  const pageStaticContent = usePageLanguage("landingpage");
  const navigate = useNavigate();

  useEffect(() => {
    getLanguageData();
  }, []);

  return (
    <>
      <LandingPageNavbar />
      <div className="getCentered text-center">
        <h3>{pageStaticContent?.["00012"]}🛠️</h3>
        <button
          className="btn btn-warning m-4"
          onClick={() => navigate("/registration/login")}
        >
          {pageStaticContent?.["00013"]}
        </button>
      </div>
    </>
  );
}

export default LandingPage;
