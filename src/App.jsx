import React, { useEffect, useMemo, useState } from "react";
import {
  axtionEvidence,
  axtionProcess,
  businessOperations,
  heroCards,
  navItems,
  operateCases,
  platformProjects,
  projectFlow,
  projectGroups,
  whatIDid,
} from "./data/mainContent.js";
import heroRibbonImage from "./assets/main/hero-ribbon-approved.png";
import ManagementDetail from "./ManagementDetail.jsx";
import CSDetail from "./CSDetail.jsx";
import { LanguageSwitch, translatePortfolioText, useLanguage } from "./LanguageContext.jsx";
import useEditorUser from "./useEditorUser.js";

const sectionIds = ["home", "operate", "manage", "axtion", "contact"];

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function compressImage(source, maxWidth = 1800, maxHeight = 1200, quality = 0.9) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(source);
          return;
        }
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const compressed = reader.result;
          resolve(compressed.length < source.length ? compressed : source);
        });
        reader.readAsDataURL(blob);
      }, "image/webp", quality);
    });
    image.addEventListener("error", () => resolve(source));
    image.src = source;
  });
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const route =
    pathname === "/business" || pathname === "/axion/management-platform" || pathname === "/axtion/management-platform"
      ? "/axtion/management-platform"
      : pathname === "/cs" || pathname === "/axion/cs-platform" || pathname === "/axtion/cs-platform"
        ? "/axtion/cs-platform"
        : "/";

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    document.title =
      route === "/"
        ? "박우정 PARK WOOJUNG | 운영 매니저 OPERATIONS MANAGER"
        : `${route === "/axtion/management-platform" ? "Business" : "CS"} Platform | 박우정 PARK WOOJUNG`;
  }, [route]);

  const navigateToRoute = (event, href) => {
    if (!href.startsWith("/")) return;
    event.preventDefault();
    window.history.pushState({}, "", href);
    setPathname(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSection = (event, href) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();

    if (route !== "/") {
      window.history.pushState({}, "", `/${href}`);
      setPathname("/");
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  if (route !== "/") {
    if (route === "/axtion/management-platform") {
      return (
        <ManagementDetail
          onRouteNavigate={navigateToRoute}
          onSectionNavigate={navigateToSection}
        />
      );
    }

    if (route === "/axtion/cs-platform") {
      return (
        <CSDetail
          onRouteNavigate={navigateToRoute}
          onSectionNavigate={navigateToSection}
        />
      );
    }

    return (
      <div className="site-shell">
        <Header
          activeSection="home"
          onRouteNavigate={navigateToRoute}
          onSectionNavigate={navigateToSection}
        />
        <ProjectPlaceholder route={route} onRouteNavigate={navigateToRoute} />
      </div>
    );
  }

  return (
    <MainPage
      onRouteNavigate={navigateToRoute}
      onSectionNavigate={navigateToSection}
    />
  );
}

function MainPage({ onRouteNavigate, onSectionNavigate }) {
  const { language } = useLanguage();
  const editorUser = useEditorUser();
  const [activeSection, setActiveSection] = useState("home");
  const [isCopyEditMode, setIsCopyEditMode] = useState(() => new URLSearchParams(window.location.search).get("edit") === "main");
  const canEditCopy = Boolean(editorUser && isCopyEditMode);

  useEffect(() => {
    const updateActiveSection = () => {
      const probe = window.scrollY + 96;
      const current =
        sectionIds
          .map((id) => document.getElementById(id))
          .filter(Boolean)
          .filter((section) => section.offsetTop <= probe)
          .at(-1)?.id ?? "home";
      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  useEffect(() => {
    const koreanStorageKey = "wj-main-copy-v1";
    const storageKey = language === "en" ? "wj-main-copy-en-v4" : koreanStorageKey;
    const categoryRepairKey = "wj-operate-category-repair-v1";
    const shouldRepairOperateCategories = language === "ko" && !window.localStorage.getItem(categoryRepairKey);
    const savedCopy = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    const koreanCopy = JSON.parse(window.localStorage.getItem(koreanStorageKey) || "{}");
    const selector = [
      ".brand strong",
      ".brand span",
      ".hero-copy h1",
      ".hero-copy p",
      ".site-shell main h2",
      ".site-shell main h3",
      ".site-shell main h4",
      ".site-shell main p",
      ".site-shell main li",
      ".site-shell main dt",
      ".site-shell main dd",
      ".project-group li strong",
      ".project-group li span",
      ".footer-brand strong",
      ".footer-brand span",
      ".footer-copyright",
    ].join(",");
    const elements = [...document.querySelectorAll(selector)].filter((element) =>
      [...element.children].every((child) => child.tagName === "BR")
      && element.textContent.trim()
      && !element.closest("nav, button, .language-switch, .main-copy-editor")
    );

    const getStableCopyKey = (element) => {
      const root = element.closest("section, footer") || element.closest(".site-shell > header") || document.body;
      const section = root.id || root.tagName.toLowerCase();
      const path = [];
      let node = element;

      while (node && node !== root) {
        const siblings = [...node.parentElement.children].filter((sibling) => sibling.tagName === node.tagName);
        path.unshift(`${node.tagName.toLowerCase()}:${siblings.indexOf(node)}`);
        node = node.parentElement;
      }

      return `v3:${section}:${path.join("/")}`;
    };

    const getPreviousCopyKey = (element) => {
      const root = element.closest("section, footer, header") || document.body;
      const section = root.id || root.tagName.toLowerCase();
      const path = [];
      let node = element;
      while (node && node !== root) {
        const siblings = [...node.parentElement.children].filter((sibling) => sibling.tagName === node.tagName);
        path.unshift(`${node.tagName.toLowerCase()}:${siblings.indexOf(node)}`);
        node = node.parentElement;
      }
      return `v2:${section}:${path.join("/")}`;
    };

    const cleanups = elements.map((element, index) => {
      const section = element.closest("section")?.id || element.closest("footer")?.id || "header";
      const legacyKey = `${section}:${element.tagName.toLowerCase()}:${index}`;
      const key = getStableCopyKey(element);
      const previousKey = getPreviousCopyKey(element);
      const sourceText = element.dataset.koreanCopy || element.innerText;
      element.dataset.mainCopyKey = key;
      element.classList.add("main-copy-content");
      if (!Object.prototype.hasOwnProperty.call(savedCopy, key)) {
        const isNestedHeaderCopy = Boolean(element.closest("header") && !element.closest(".site-shell > header"));
        const koreanValue = isNestedHeaderCopy
          ? sourceText
          : (koreanCopy[key] ?? koreanCopy[previousKey] ?? koreanCopy[legacyKey] ?? sourceText);
        const savedValue = language === "en"
          ? undefined
          : (isNestedHeaderCopy ? sourceText : (savedCopy[previousKey] ?? savedCopy[legacyKey]));
        const languageDefault = language === "en" ? translatePortfolioText(koreanValue) : sourceText;
        savedCopy[key] = savedValue === "" && element.matches("#operate .section-copy")
          ? languageDefault
          : (savedValue ?? languageDefault);
        window.localStorage.setItem(storageKey, JSON.stringify(savedCopy));
      }
      element.textContent = savedCopy[key];
      if (language === "ko") element.dataset.koreanCopy = savedCopy[key];
      if (shouldRepairOperateCategories && element.matches("#operate .case-heading p")) {
        const categoryIndex = [...document.querySelectorAll("#operate .case-heading p")].indexOf(element);
        const category = operateCases[categoryIndex]?.category;
        if (category) {
          savedCopy[key] = category;
          element.textContent = category;
          window.localStorage.setItem(storageKey, JSON.stringify(savedCopy));
        }
      }
      if (!canEditCopy) return () => element.removeAttribute("data-main-copy-key");

      element.contentEditable = "true";
      element.spellcheck = false;
      element.classList.add("main-copy-editable");

      const save = () => {
        savedCopy[key] = element.innerText.replace(/\n{3,}/g, "\n\n").trim();
        window.localStorage.setItem(storageKey, JSON.stringify(savedCopy));
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
        element.removeAttribute("data-main-copy-key");
        element.classList.remove("main-copy-editable");
      };
    });

    if (shouldRepairOperateCategories) {
      window.localStorage.setItem(categoryRepairKey, "done");
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [canEditCopy, language]);

  const toggleCopyEditMode = () => {
    if (!editorUser) return;
    const nextMode = !isCopyEditMode;
    const url = new URL(window.location.href);
    if (nextMode) url.searchParams.set("edit", "main");
    else url.searchParams.delete("edit");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setIsCopyEditMode(nextMode);
  };

  return (
    <div className="site-shell">
      <Header
        activeSection={activeSection}
        onRouteNavigate={onRouteNavigate}
        onSectionNavigate={onSectionNavigate}
      />
      <main>
        <Hero onSectionNavigate={onSectionNavigate} />
        <OperateSection isEditMode={isCopyEditMode} />
        <ManageSection />
        <AxtionSection onRouteNavigate={onRouteNavigate} />
      </main>
      <Footer onSectionNavigate={onSectionNavigate} />
      {editorUser ? (
        <div className={`main-copy-editor${canEditCopy ? " is-active" : ""}`}>
          {canEditCopy ? <strong>문구 편집 중</strong> : null}
          <button type="button" onClick={toggleCopyEditMode}>{canEditCopy ? "편집 종료" : "문구 편집"}</button>
        </div>
      ) : null}
    </div>
  );
}

function Header({ activeSection, onRouteNavigate, onSectionNavigate }) {
  return (
    <header className="header">
      <div className="page header-inner">
        <a
          className="brand"
          href="/#home"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              onSectionNavigate(event, "#home");
              return;
            }
            onRouteNavigate(event, "/");
          }}
        >
          <strong>박우정 PARK WOOJUNG</strong>
          <span>운영 매니저 OPERATIONS MANAGER</span>
        </a>

        <nav className="primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const section = item.href.replace("#", "");
            return (
              <a
                className={activeSection === section ? "is-active" : ""}
                href={`/${item.href}`}
                key={item.label}
                onClick={(event) => onSectionNavigate(event, item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <LanguageSwitch />
      </div>
    </header>
  );
}

function Hero({ onSectionNavigate }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="page hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title">
            THINK.
            <br />
            PLAN.
            <br />
            MAKE&nbsp;IT&nbsp;WORK.
          </h1>
          <p className="hero-korean">
            현장에서 답을 찾고,
            <br />
            운영의 흐름을 설계하며,
            <br />
            생각을 실행으로 만듭니다.
          </p>
          <p className="hero-signature">
            <strong>박우정 PARK WOOJUNG</strong>
            <span>운영 매니저 OPERATIONS MANAGER</span>
          </p>
        </div>

        <div className="hero-stage" aria-label="Portfolio section navigation">
          <img
            className="hero-glass"
            src={heroRibbonImage}
            alt=""
            aria-hidden="true"
          />
          {heroCards.map((card, index) => (
            <a
              className={`hero-card hero-card-${index + 1}`}
              href={card.href}
              key={card.title}
              onClick={(event) => onSectionNavigate(event, card.href)}
            >
              <strong>{card.title}</strong>
              <span>{lines(card.copy)}</span>
              <b aria-hidden="true">→</b>
            </a>
          ))}
        </div>
      </div>

      <a
        className="scroll-indicator"
        href="#operate"
        onClick={(event) => onSectionNavigate(event, "#operate")}
      >
        <span>SCROLL</span>
        <i aria-hidden="true" />
        <b aria-hidden="true" />
      </a>
    </section>
  );
}

function OperateSection({ isEditMode }) {
  const [customImages, setCustomImages] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("wj-operate-images-v1") || "{}");
    } catch {
      return {};
    }
  });
  const [extraImages, setExtraImages] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("wj-operate-extra-images-v1") || "[]");
    } catch {
      return [];
    }
  });
  const [imageOrder, setImageOrder] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("wj-operate-image-order-v1") || "[]");
    } catch {
      return [];
    }
  });
  const [previewIndex, setPreviewIndex] = useState(null);
  const galleryItems = [
    ...operateCases.map((item, index) => ({
      src: customImages[index] || item.image,
      alt: item.alt,
      type: "base",
      sourceIndex: index,
    })),
    ...extraImages.map((src, index) => ({
      src,
      alt: `추가 운영 사례 ${index + 1}`,
      type: "extra",
      sourceIndex: index,
    })),
  ];
  const validIndexes = galleryItems.map((_, index) => index);
  const normalizedOrder = [
    ...imageOrder.filter((index) => validIndexes.includes(index)),
    ...validIndexes.filter((index) => !imageOrder.includes(index)),
  ];
  const galleryImages = normalizedOrder.map((index) => galleryItems[index]);

  useEffect(() => {
    if (previewIndex === null) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreviewIndex(null);
    };
    document.body.classList.add("has-image-preview");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("has-image-preview");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [previewIndex]);

  useEffect(() => {
    const compressionKey = "wj-operate-compression-v1";
    if (window.localStorage.getItem(compressionKey)) return undefined;
    let cancelled = false;

    const compressStoredImages = async () => {
      const compressedCustomEntries = await Promise.all(
        Object.entries(customImages).map(async ([key, source]) => [key, await compressImage(source)]),
      );
      const compressedExtras = await Promise.all(extraImages.map((source) => compressImage(source)));
      if (cancelled) return;

      const compressedCustom = Object.fromEntries(compressedCustomEntries);
      try {
        window.localStorage.setItem("wj-operate-images-v1", JSON.stringify(compressedCustom));
        window.localStorage.setItem("wj-operate-extra-images-v1", JSON.stringify(compressedExtras));
        window.localStorage.setItem(compressionKey, "done");
        setCustomImages(compressedCustom);
        setExtraImages(compressedExtras);
      } catch {
        window.alert("저장공간 정리 중 일부 사진을 압축하지 못했습니다.");
      }
    };

    compressStoredImages();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveExtraImages = (images) => {
    try {
      window.localStorage.setItem("wj-operate-extra-images-v1", JSON.stringify(images));
      setExtraImages(images);
      return true;
    } catch {
      window.alert("이미지 용량이 너무 큽니다. 더 작은 이미지로 다시 선택해주세요.");
      return false;
    }
  };

  const saveImageOrder = (order) => {
    window.localStorage.setItem("wj-operate-image-order-v1", JSON.stringify(order));
    setImageOrder(order);
  };

  const moveImage = (position, direction) => {
    const target = position + direction;
    if (target < 0 || target >= normalizedOrder.length) return;
    const nextOrder = [...normalizedOrder];
    [nextOrder[position], nextOrder[target]] = [nextOrder[target], nextOrder[position]];
    saveImageOrder(nextOrder);
  };

  const changeImage = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    const source = await readImageFile(file);
    const compressed = await compressImage(source);
    const nextImages = { ...customImages, [index]: compressed };
    try {
      window.localStorage.setItem("wj-operate-images-v1", JSON.stringify(nextImages));
      setCustomImages(nextImages);
    } catch {
      window.alert("사진 저장공간이 부족합니다. 사용하지 않는 추가 사진을 삭제해주세요.");
    }
  };

  const addImages = async (event) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;
    event.target.value = "";
    const sources = await Promise.all(files.map(readImageFile));
    const images = await Promise.all(sources.map((source) => compressImage(source)));
    if (saveExtraImages([...extraImages, ...images])) {
      const firstNewIndex = operateCases.length + extraImages.length;
      saveImageOrder([
        ...normalizedOrder,
        ...images.map((_, index) => firstNewIndex + index),
      ]);
    }
  };

  const removeExtraImage = (index) => {
    const removedIndex = operateCases.length + index;
    if (saveExtraImages(extraImages.filter((_, imageIndex) => imageIndex !== index))) {
      saveImageOrder(
        normalizedOrder
          .filter((itemIndex) => itemIndex !== removedIndex)
          .map((itemIndex) => itemIndex > removedIndex ? itemIndex - 1 : itemIndex),
      );
    }
  };

  return (
    <section className="operate-section light-section" id="operate">
      <div className="page operate-layout">
        <SectionIntro
          number="01"
          title="OPERATE"
          dot="violet"
          lead={"사람과 상황을 연결해\n전체가 움직일 수 있도록."}
          copy={
            "공연과 행사, 항공, 고객 서비스, B2B까지\n서로 다른 환경에서 운영을 경험했습니다.\n사람과 상황을 이해하고, 필요한 요소를 연결해\n전체가 움직일 수 있게 만드는 것이\n저의 운영 방식입니다."
          }
          closing={"DIFFERENT FIELDS.\nONE OPERATION."}
        />

        <div className="operate-cases" aria-label="Operate cases">
          <ScrollCue />
          <div className="operate-gallery" aria-label="Operate image gallery" tabIndex="0">
            {galleryImages.map((item, position) => (
              <figure className={isEditMode ? "is-image-editable" : ""} key={`${item.type}-${item.sourceIndex}`}>
                <button
                  className="operate-image-view"
                  type="button"
                  onClick={() => setPreviewIndex(position)}
                  aria-label={`${item.alt} 크게 보기`}
                >
                  <img src={item.src} alt={item.alt} />
                </button>
                {isEditMode ? (
                  <div className="operate-image-controls">
                    <button type="button" aria-label="왼쪽으로 이동" disabled={position === 0} onClick={() => moveImage(position, -1)}>‹</button>
                    {item.type === "base" ? (
                      <label className="operate-image-picker">
                        사진 변경
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => changeImage(event, item.sourceIndex)}
                        />
                      </label>
                    ) : (
                      <button type="button" onClick={() => removeExtraImage(item.sourceIndex)}>삭제</button>
                    )}
                    <button type="button" aria-label="오른쪽으로 이동" disabled={position === galleryImages.length - 1} onClick={() => moveImage(position, 1)}>›</button>
                  </div>
                ) : null}
              </figure>
            ))}
            {isEditMode ? (
              <label className="operate-image-add">
                + 사진 추가
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={addImages}
                />
              </label>
            ) : null}
          </div>

          <ScrollCue />
          <div className="operate-topics">
            {operateCases.map((item) => (
              <article className="case-card" key={item.label}>
                <header className="case-heading">
                  <span>{item.number}</span>
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.category}</p>
                  </div>
                </header>
                <h4>{lines(item.headline)}</h4>
                <p className="case-body">{item.body.replaceAll("\n", " ")}</p>
                <ul className="keyword-list" aria-label={`${item.label} keywords`}>
                  {item.keywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
                <div className="case-learned">
                  <span>WHAT I LEARNED</span>
                  <p>{item.learned.replaceAll("\n", " ")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      {previewIndex !== null && galleryImages[previewIndex] ? (
        <div
          className="operate-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="운영 사례 이미지 크게 보기"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            className="operate-lightbox-close"
            type="button"
            aria-label="닫기"
            onClick={() => setPreviewIndex(null)}
          >
            ×
          </button>
          {galleryImages.length > 1 ? (
            <button
              className="operate-lightbox-nav is-prev"
              type="button"
              aria-label="이전 사진"
              onClick={(event) => {
                event.stopPropagation();
                setPreviewIndex((previewIndex - 1 + galleryImages.length) % galleryImages.length);
              }}
            >
              ‹
            </button>
          ) : null}
          <img
            src={galleryImages[previewIndex].src}
            alt={galleryImages[previewIndex].alt}
            onClick={(event) => event.stopPropagation()}
          />
          {galleryImages.length > 1 ? (
            <button
              className="operate-lightbox-nav is-next"
              type="button"
              aria-label="다음 사진"
              onClick={(event) => {
                event.stopPropagation();
                setPreviewIndex((previewIndex + 1) % galleryImages.length);
              }}
            >
              ›
            </button>
          ) : null}
          <span className="operate-lightbox-count">
            {previewIndex + 1} / {galleryImages.length}
          </span>
        </div>
      ) : null}
    </section>
  );
}

function ManageSection() {
  return (
    <section className="manage-section light-section" id="manage">
      <div className="page manage-layout">
        <SectionIntro
          number="02"
          title="MANAGE"
          dot="violet"
          lead={"복잡한 일을 하나의\n흐름으로 관리합니다."}
          copy={
            "현장에서 사람과 상황을 보는 법을 배웠다면,\n프로젝트에서는 여러 업무가 연결되는\n전체 흐름을 관리하는 법을 배웠습니다.\n저는 복잡한 업무를 구조화하고,\n사람과 자원, 일정을 연결해 결과로 이어지도록\n관리하는 방식을 만들어왔습니다."
          }
          closing={"FROM COMPLEXITY\nTO A CLEAR FLOW."}
        />

        <div className="manage-content">
          <div className="manage-upper">
            <WhatIDid />
            <ProjectFlow />
          </div>
        </div>
        <ProjectsAndOperations />
      </div>
    </section>
  );
}

function AxtionSection({ onRouteNavigate }) {
  return (
    <section className="axtion-section" id="axtion">
      <div className="page axtion-layout">
        <div className="axtion-intro">
          <SectionMarker number="03" light />
          <h2>
            AXTION<span className="dot gold" />
          </h2>
          <p className="axtion-meaning">AX × ACTION</p>
          <p className="axtion-lead">
            <span>생각에서 멈추지 않고,</span>
            <span>가능한 방법을 찾아 시도합니다.</span>
          </p>
          <p className="axtion-copy">
            운영 과정에서 반복되는 문제를 발견하고,
            <br />
            AI를 활용해 필요한 업무 시스템을
            <br />
            직접 기획하고 구현했습니다.
          </p>
        </div>

        <div className="axtion-main">
          <ProcessFlow />
          <ScrollCue light />
          <div className="platform-grid">
            {platformProjects.map((project) => (
              <PlatformProject
                key={project.number}
                project={project}
                onRouteNavigate={onRouteNavigate}
              />
            ))}
          </div>
        </div>

        <div className="evidence-row">
          {axtionEvidence.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{lines(item.copy)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ number, title, dot, lead, copy, closing }) {
  return (
    <div className="section-intro">
      <SectionMarker number={number} />
      <h2>
        {title}
        <span className={`dot ${dot}`} />
      </h2>
      <p className="section-lead">{lines(lead)}</p>
      <p className="section-copy">{lines(copy)}</p>
      <p className="section-closing">{lines(closing)}</p>
    </div>
  );
}

function SectionMarker({ number, light = false }) {
  return (
    <div className={`section-marker ${light ? "light" : ""}`}>
      <span>{number}</span>
      <i aria-hidden="true" />
    </div>
  );
}

function ProjectFlow() {
  return (
    <div className="project-flow">
      <h3>PROJECT FLOW</h3>
      <ScrollCue />
      <div className="flow-panels">
        {projectFlow.map((item, index) => (
          <React.Fragment key={item.title}>
            <article className="flow-panel">
              <h4>{item.title}</h4>
              <Icon name={item.icon} />
              <p>{lines(item.copy)}</p>
            </article>
            {index < projectFlow.length - 1 ? (
              <span className="flow-arrow" aria-hidden="true">
                ›
              </span>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function WhatIDid() {
  return (
    <aside className="what-i-did">
      <div className="what-summary">
        <h3>WHAT I DID</h3>
        <p className="what-lead">
          여러 업무가 동시에 움직일 때, 무엇이 먼저 연결되어야 하는지를 정리했습니다.
        </p>
        <p className="what-copy">
          프로젝트에서는 일정 하나만 움직이지 않습니다. 예산, 이해관계자, 행정과 산출물이 서로 연결되어 있기 때문에 개별 업무보다 전체 흐름을 먼저 보고 관리했습니다.
        </p>
      </div>
      <dl>
        {whatIDid.map((item) => (
          <div key={item.title}>
            <dt>{item.title}</dt>
            <dd>{item.copy}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function ProjectsAndOperations() {
  return (
    <div className="projects-operations" aria-label="Projects and operations">
      <h3>PROJECTS &amp; OPERATIONS</h3>
      <ScrollCue />
      <div className="project-group-grid">
        {projectGroups.map((group) => (
          <article className="project-group" key={group.title}>
            <header>
              <h4>
                {group.title}
                <span>{group.count}</span>
              </h4>
              {group.summary ? <p>{group.summary}</p> : null}
            </header>
            <ul>
              {group.items.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  {item.detail ? <span>{item.detail}</span> : null}
                </li>
              ))}
            </ul>
          </article>
        ))}

        <article className="project-group current">
          <header>
            <h4>CURRENT BUSINESS OPERATIONS</h4>
          </header>
          <ul>
            {businessOperations.map((item) => (
              <li key={item.title}>
                <Icon name="square" />
                <strong>{item.title}</strong>
                <span>{item.copy}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

function ProcessFlow() {
  return (
    <div className="axtion-process">
      <h3>HOW I TURN A PROBLEM INTO A SYSTEM</h3>
      <ScrollCue light />
      <div className="process-items">
        {axtionProcess.map((step, index) => (
          <React.Fragment key={step.title}>
            <article className={`process-pill ${step.accent}`}>
              <Icon name={step.icon} />
              <div>
                <h4>{step.title}</h4>
                <p>{step.copy}</p>
              </div>
            </article>
            {index < axtionProcess.length - 1 ? (
              <span className="process-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PlatformProject({ project, onRouteNavigate }) {
  return (
    <article className={`platform-project ${project.accent}`}>
      <div className="platform-copy">
        <span>{project.number}</span>
        <h3>{project.title}</h3>
        <p>{lines(project.copy)}</p>
        <ul className="tag-list" aria-label={`${project.title} tags`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <a
          className="view-project"
          href={project.href}
          onClick={(event) => onRouteNavigate(event, project.href)}
        >
          VIEW PROJECT
        </a>
      </div>
      <div className="laptop-frame">
        <span className="laptop-reflection laptop-reflection-keyboard" aria-hidden="true" />
        <span className="laptop-reflection laptop-reflection-screen" aria-hidden="true" />
        <img src={project.image} alt={project.alt} />
      </div>
    </article>
  );
}

function ScrollCue({ light = false }) {
  return (
    <span className={`mobile-scroll-cue${light ? " is-light" : ""}`} aria-hidden="true">
      <span>SCROLL</span>
      <b>≫</b>
    </span>
  );
}

function Footer({ onSectionNavigate }) {
  return (
    <footer className="footer" id="contact">
      <div className="page footer-inner">
        <div className="footer-brand">
          <strong>박우정 PARK WOOJUNG</strong>
          <i aria-hidden="true" />
          <span>운영 매니저 OPERATIONS MANAGER</span>
          <i aria-hidden="true" />
          <address className="footer-contact" aria-label="Contact information">
            <a href="mailto:arinawj@gmail.com">arinawj@gmail.com</a>
            <i aria-hidden="true" />
            <a href="tel:+821094956561">+82-010-9495-6561</a>
          </address>
        </div>

        <p className="footer-copyright">© 2026 Park Woojung. All rights reserved.</p>

        <a
          className="footer-top"
          href="/#home"
          aria-label="맨 위로 이동"
          title="맨 위로"
          onClick={(event) => onSectionNavigate(event, "#home")}
        >
          <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

function ProjectPlaceholder({ route, onRouteNavigate }) {
  const meta = useMemo(
    () =>
      route === "/axtion/management-platform"
        ? {
            eyebrow: "BUSINESS MANAGEMENT PLATFORM",
            title: "경영관리 플랫폼",
            copy: "상세 페이지 라우팅 구조만 준비된 placeholder입니다. MAIN PAGE의 시각 완성도를 우선했습니다.",
          }
        : {
            eyebrow: "CS MANAGEMENT PLATFORM",
            title: "CS 관리 플랫폼",
            copy: "상세 페이지 라우팅 구조만 준비된 placeholder입니다. MAIN PAGE의 시각 완성도를 우선했습니다.",
          },
    [route],
  );

  return (
    <main className="placeholder-page">
      <section className="page placeholder-panel">
        <p>{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <span>{meta.copy}</span>
        <a href="/" onClick={(event) => onRouteNavigate(event, "/")}>
          BACK TO MAIN
        </a>
      </section>
    </main>
  );
}

function Icon({ name }) {
  const icons = {
    calendar: (
      <>
        <rect x="5" y="7" width="14" height="13" rx="2" />
        <path d="M8 4v4M16 4v4M5 11h14" />
      </>
    ),
    budget: (
      <>
        <ellipse cx="12" cy="7" rx="6" ry="3" />
        <path d="M6 7v7c0 1.7 2.7 3 6 3s6-1.3 6-3V7M6 11c0 1.7 2.7 3 6 3s6-1.3 6-3" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M4 19c.6-3.4 2.4-5.2 5-5.2s4.4 1.8 5 5.2M13 17.5c.7-2.2 2-3.3 3.8-3.3 2.1 0 3.5 1.5 4 4.3" />
      </>
    ),
    document: (
      <>
        <path d="M7 4h7l4 4v12H7z" />
        <path d="M14 4v5h5M10 13h6M10 17h5" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m8.5 12.5 2.3 2.2 4.8-5.1" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5" />
      </>
    ),
    grid: (
      <>
        <rect x="5" y="5" width="5" height="5" rx="1" />
        <rect x="14" y="5" width="5" height="5" rx="1" />
        <rect x="5" y="14" width="5" height="5" rx="1" />
        <rect x="14" y="14" width="5" height="5" rx="1" />
      </>
    ),
    build: (
      <>
        <path d="M9 14a4 4 0 1 1 5-5l5 5-5 5a4 4 0 0 1-5-5Z" />
        <path d="M8 20h8M12 15v5" />
      </>
    ),
    flask: (
      <>
        <path d="M9 4h6M10 4v6l-4 7a2 2 0 0 0 1.8 3h8.4A2 2 0 0 0 18 17l-4-7V4" />
        <path d="M8.5 15h7" />
      </>
    ),
    note: (
      <>
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    square: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 12h6" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {icons[name] ?? icons.square}
    </svg>
  );
}

function lines(value) {
  return value.split("\n").map((line, index, array) => (
    <React.Fragment key={`${line}-${index}`}>
      {line}
      {index < array.length - 1 ? <br /> : null}
    </React.Fragment>
  ));
}

export default App;
