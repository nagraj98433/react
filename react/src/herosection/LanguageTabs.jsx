import React from "react";
import { Nav } from "react-bootstrap";

function LanguageTabs({
  languages,
  selectedLanguage,
  onSelectLanguage,
  onAddLanguageTab,
}) {
  return (
    <Nav variant="tabs">
      {languages.map((language) => (
        <Nav.Item key={language}>
          <Nav.Link
            className={selectedLanguage === language ? "active" : ""}
            onClick={() => onSelectLanguage(language)}
          >
            {language}
          </Nav.Link>
        </Nav.Item>
      ))}

      <Nav.Item>
        <Nav.Link onClick={() => onAddLanguageTab()}>Add Language +</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default LanguageTabs;
