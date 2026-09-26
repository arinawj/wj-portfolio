import React, { useEffect, useState } from "react";
import { translatePortfolioText, useLanguage } from "./LanguageContext.jsx";

const editableSelector = [
  ".management-detail main h1 b",
  ".management-detail main h2",
  ".management-detail main h3",
  ".management-detail main p",
  ".management-detail main li",
  ".management-detail main blockquote",
  ".management-detail main a strong",
  ".management-detail .outcome-card li b",
  ".management-detail footer > div > p",
].join(",");

function getCopyKey(element) {
  const root = element.closest("section, footer") || document.body;
  const section = root.id || [...root.classList].find((name) => name.startsWith("management-")) || root.tagName.toLowerCase();
  const path = [];
  let node = element;

  while (node && node !== root) {
    const siblings = [...node.parentElement.children].filter((sibling) => sibling.tagName === node.tagName);
    path.unshift(`${node.tagName.toLowerCase()}:${siblings.indexOf(node)}`);
    node = node.parentElement;
  }
  return `${section}:${path.join("/")}`;
}

export default function DetailTextEditor({ storageKey }) {
  const { language } = useLanguage();
  const languageStorageKey = language === "en" ? `${storageKey}-en-v2` : storageKey;
  const [isEditing, setIsEditing] = useState(
    () => new URLSearchParams(window.location.search).get("copy") === "1",
  );

  useEffect(() => {
    let savedCopy = {};
    try {
      savedCopy = JSON.parse(window.localStorage.getItem(languageStorageKey) || "{}");
    } catch {
      savedCopy = {};
    }
    let koreanCopy = {};
    try {
      koreanCopy = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    } catch {
      koreanCopy = {};
    }

    const elements = [...document.querySelectorAll(editableSelector)].filter((element) =>
      element.textContent.trim()
      && !element.closest("nav, button, .preview-screen, .preview-editor, .screen-callout")
      && ([...element.children].every((child) => child.tagName === "BR")
        || element.matches("h1 b, a strong, .outcome-card li b")),
    );

    const cleanups = elements.map((element) => {
      const key = getCopyKey(element);
      element.classList.add("detail-copy-content");
      const sourceText = element.dataset.koreanCopy || element.innerText;
      const koreanText = koreanCopy[key] ?? sourceText;
      if (Object.prototype.hasOwnProperty.call(savedCopy, key)) element.textContent = savedCopy[key];
      else if (language === "en") element.textContent = translatePortfolioText(koreanText);
      else element.textContent = koreanText;
      if (language === "ko") element.dataset.koreanCopy = element.innerText;
      if (!isEditing) return () => {};

      element.contentEditable = "true";
      element.spellcheck = false;
      element.classList.add("detail-copy-editable");
      const save = () => {
        savedCopy[key] = element.innerText.replace(/\n{3,}/g, "\n\n").trim();
        window.localStorage.setItem(languageStorageKey, JSON.stringify(savedCopy));
      };
      const protectLink = (event) => {
        if (element.closest("a")) event.preventDefault();
      };
      element.addEventListener("input", save);
      element.addEventListener("blur", save);
      element.addEventListener("click", protectLink);
      return () => {
        element.removeEventListener("input", save);
        element.removeEventListener("blur", save);
        element.removeEventListener("click", protectLink);
        element.removeAttribute("contenteditable");
        element.classList.remove("detail-copy-editable");
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [isEditing, language, languageStorageKey]);

  const toggleEditing = () => {
    const next = !isEditing;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("copy", "1");
    else url.searchParams.delete("copy");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setIsEditing(next);
  };

  return (
    <div className={`detail-copy-editor${isEditing ? " is-active" : ""}`}>
      {isEditing ? <strong>본문 편집 중</strong> : null}
      <button type="button" onClick={toggleEditing}>{isEditing ? "편집 종료" : "문구 편집"}</button>
    </div>
  );
}
