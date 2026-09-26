import React, { useEffect, useRef, useState } from "react";
import csLaptop from "./assets/main/axtion-laptop-cs-front.png";
import heroLaptop from "./assets/management/detail-hero-laptop.png";
import screenFrame from "./assets/management/screen-frame.png";
import pictogramSheet from "./assets/management/detail-pictograms.png";
import sectionBackgrounds from "./assets/management/detail-section-backgrounds.png";
import screenPreviewBackground from "./assets/management/section-03-screen-preview.png";
import outcomesBackground from "./assets/management/section-04-before-after.png";
import roleBackground from "./assets/management/section-05-my-role.png";
import nextProjectBackground from "./assets/management/section-06-next-project.png";
import darkPurpleCard from "./assets/management/dark-purple-card.png";
import DetailTextEditor from "./DetailTextEditor.jsx";
import "./management-detail.css";

const PREVIEW_CALLOUT_STORAGE_KEY = "wj-management-preview-callouts-v2";
const LEGACY_CALLOUT_STORAGE_KEY = "wj-management-preview-callouts-v1";
const previewImages = import.meta.glob("./assets/management/screens/*.png", { eager: true, import: "default" });
const previewImage = (name) => previewImages[`./assets/management/screens/${name}.png`];
const slide = (id, title, image, callouts = []) => ({
  id,
  title,
  image: previewImage(image),
  alt: `경영관리 플랫폼 ${title} 화면`,
  callouts,
});

const screenGroups = [
  {
    id: "dashboard",
    label: "대시보드",
    slides: [slide("dashboard-01", "대시보드", "dashboard-01", [
      { number: "01", title: "주요 지표 요약", copy: "예산과 집행 현황을 한 화면에서 확인합니다.", x: 25, y: 7, targetX: 48, targetY: 25 },
      { number: "02", title: "예산 진행 현황", copy: "월별 예산 대비 실제 집행 흐름을 비교합니다.", x: 43, y: 58, targetX: 50, targetY: 47 },
      { number: "03", title: "최근 경영 알림", copy: "중요한 마감과 운영 상태를 빠르게 확인합니다.", x: 72, y: 39, targetX: 78, targetY: 61 },
    ])],
  },
  {
    id: "expenses",
    label: "지출 관리",
    slides: [
      slide("expenses-01", "지출 전체", "expenses-01"),
      slide("expenses-02", "정기결제", "expenses-02"),
      slide("expenses-03", "일반결제", "expenses-03"),
      slide("expenses-04", "영수증 리스트", "expenses-04"),
      slide("expenses-05", "비품 구매", "expenses-05"),
      slide("expenses-06", "영수증 드라이브", "expenses-06"),
    ],
  },
  {
    id: "budget",
    label: "예산 관리",
    slides: [
      slide("budget-01", "예산 현황", "budget-01"),
      slide("budget-02", "예산요청서 작성", "budget-02"),
      slide("budget-03", "월간 예산 사용현황", "budget-03"),
      slide("budget-04", "올해 예산 전체 현황", "budget-04"),
    ],
  },
  {
    id: "profit",
    label: "손익 현황",
    slides: [
      slide("profit-01", "손익 전체", "profit-01"),
      slide("profit-02", "매출", "profit-02"),
      slide("profit-03", "매입", "profit-03"),
      slide("profit-04", "판관비", "profit-04"),
      slide("profit-05", "월 손익", "profit-05"),
      slide("profit-06", "연간 현황", "profit-06"),
    ],
  },
  { id: "cost", label: "원가 관리", slides: [slide("cost-01", "원가 관리", "cost-01")] },
  {
    id: "documents",
    label: "문서 관리",
    slides: [
      slide("documents-01", "문서 링크", "documents-01"),
      slide("documents-02", "사업자등록정보", "documents-02"),
    ],
  },
  { id: "tax-invoice", label: "세금계산서", slides: [slide("tax-01", "세금계산서", "tax-01")] },
  {
    id: "admin",
    label: "어드민",
    slides: [
      slide("admin-01", "계정·권한", "admin-01"),
      slide("admin-02", "비목 설정", "admin-02"),
      slide("admin-03", "승인 대기", "admin-03"),
      slide("admin-04", "처리 완료", "admin-04"),
    ],
  },
  {
    id: "staff-portal",
    label: "직원 요청 포털",
    slides: [
      slide("staff-01", "비품 구매 요청", "staff-01"),
      slide("staff-02", "건의사항", "staff-02"),
    ],
  },
];

const defaultCalloutDrafts = () => screenGroups.map((group) => group.slides.map((item) => item.callouts));
const CALLOUT_NUMBER_CENTER_X = 0.73;
const CALLOUT_NUMBER_CENTER_Y = 1.16;

function getCalloutLine(callout) {
  const endX = callout.x + CALLOUT_NUMBER_CENTER_X;
  const endY = callout.y + CALLOUT_NUMBER_CENTER_Y;
  const bendX = callout.bendX ?? Number(((callout.targetX + endX) / 2).toFixed(1));
  const bendY = callout.bendY ?? Number(((callout.targetY + endY) / 2).toFixed(1));
  const style = callout.lineStyle ?? "elbow";
  const path = style === "curve"
    ? `M ${callout.targetX} ${callout.targetY} Q ${bendX} ${bendY} ${endX} ${endY}`
    : style === "straight"
      ? `M ${callout.targetX} ${callout.targetY} L ${endX} ${endY}`
      : `M ${callout.targetX} ${callout.targetY} L ${bendX} ${bendY} L ${endX} ${endY}`;
  return { bendX, bendY, path, style };
}

function getCurveBend(callout) {
  const endX = callout.x + CALLOUT_NUMBER_CENTER_X;
  const endY = callout.y + CALLOUT_NUMBER_CENTER_Y;
  const dx = endX - callout.targetX;
  const dy = endY - callout.targetY;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const curveDepth = Math.min(14, Math.max(8, length * 0.32));
  return {
    bendX: Number(Math.max(2, Math.min(96, (callout.targetX + endX) / 2 - (dy / length) * curveDepth)).toFixed(1)),
    bendY: Number(Math.max(2, Math.min(96, (callout.targetY + endY) / 2 + (dx / length) * curveDepth)).toFixed(1)),
  };
}

const features = [
  [0, "통합 데이터 관리", "프로젝트·예산·지출·일정을\n한곳에서 관리"],
  [1, "실시간 현황 확인", "예산 진행, 정산, 일정 등\n최신 정보 실시간 업데이트"],
  [2, "협업 효율화", "기관·파트너·팀 간\n정보 공유 및 커뮤니케이션"],
  [3, "보고 자동화", "주요 지표 리포트 자동 생성\n의사결정 지원"],
];

const roles = [
  ["01", "문제 발견", "현업 페인포인트 분석"],
  ["02", "요구사항 정의", "운영 흐름 및 기능 기획"],
  ["03", "시스템 설계", "화면 구성 및 데이터 구조 설계"],
  ["04", "개발 협업 및 테스트", "프로토타입 검증 및 개선"],
  ["05", "실제 적용", "실무 배포 및 사용자 피드백 반영"],
];

function ManagementDetail({ onRouteNavigate, onSectionNavigate }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [calloutDrafts, setCalloutDrafts] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(PREVIEW_CALLOUT_STORAGE_KEY));
      if (Array.isArray(saved) && saved.length === screenGroups.length && saved.every((group, groupIndex) => (
        Array.isArray(group) && group.length === screenGroups[groupIndex].slides.length && group.every(Array.isArray)
      ))) return saved;

      const legacy = JSON.parse(window.localStorage.getItem(LEGACY_CALLOUT_STORAGE_KEY));
      if (Array.isArray(legacy) && Array.isArray(legacy[0])) {
        const migrated = defaultCalloutDrafts();
        migrated[0][0] = legacy[0];
        return migrated;
      }
    } catch {
      // Ignore malformed local preview data and use the source defaults.
    }
    return defaultCalloutDrafts();
  });
  const [selectedCallout, setSelectedCallout] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const dragStart = useRef(null);
  const previewScreenRef = useRef(null);
  const isEditMode = new URLSearchParams(window.location.search).get("edit") === "preview";

  useEffect(() => {
    document.body.classList.add("detail-route");
    return () => document.body.classList.remove("detail-route");
  }, []);

  useEffect(() => {
    if (!isPreviewOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsPreviewOpen(false);
    };

    document.body.classList.add("preview-lightbox-open");
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.classList.remove("preview-lightbox-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPreviewOpen]);

  useEffect(() => {
    window.localStorage.setItem(PREVIEW_CALLOUT_STORAGE_KEY, JSON.stringify(calloutDrafts));
  }, [calloutDrafts]);

  const move = (direction) => {
    const slideCount = screenGroups[activeGroup].slides.length;
    setActiveSlide((current) => (current + direction + slideCount) % slideCount);
    setSelectedCallout(0);
  };

  const selectGroup = (index) => {
    setActiveGroup(index);
    setActiveSlide(0);
    setSelectedCallout(0);
  };

  const updateCallout = (index, changes) => {
    setCalloutDrafts((current) => current.map((group, groupIndex) => groupIndex === activeGroup
      ? group.map((items, slideIndex) => slideIndex === activeSlide
        ? items.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item)
        : items)
      : group));
  };

  const handleCalloutDrag = (event, index, point = "label") => {
    if (!isEditMode || !previewScreenRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedCallout(index);
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const rect = previewScreenRef.current.getBoundingClientRect();
    const movePoint = (moveEvent) => {
      const x = Math.max(0, Math.min(96, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(96, ((moveEvent.clientY - rect.top) / rect.height) * 100));
      const nextPoint = { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
      updateCallout(index, point === "target"
        ? { targetX: nextPoint.x, targetY: nextPoint.y }
        : point === "bend"
          ? { bendX: nextPoint.x, bendY: nextPoint.y }
          : nextPoint);
    };

    const stop = () => {
      window.removeEventListener("pointermove", movePoint);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", movePoint);
    window.addEventListener("pointerup", stop);
  };

  const addCallout = () => {
    const currentItems = calloutDrafts[activeGroup][activeSlide];
    const nextNumber = String(currentItems.length + 1).padStart(2, "0");
    setCalloutDrafts((current) => current.map((group, groupIndex) => groupIndex === activeGroup
      ? group.map((items, slideIndex) => slideIndex === activeSlide
        ? [...items, { number: nextNumber, title: "새 설명", copy: "설명을 입력하세요.", x: 45, y: 20, targetX: 55, targetY: 40 }]
        : items)
      : group));
    setSelectedCallout(currentItems.length);
  };

  const removeCallout = () => {
    setCalloutDrafts((current) => current.map((group, groupIndex) => groupIndex === activeGroup
      ? group.map((items, slideIndex) => slideIndex === activeSlide
        ? items.filter((_, itemIndex) => itemIndex !== selectedCallout).map((item, itemIndex) => ({ ...item, number: String(itemIndex + 1).padStart(2, "0") }))
        : items)
      : group));
    setSelectedCallout((current) => Math.max(0, current - 1));
  };

  const copyCallouts = async () => {
    const payload = screenGroups.map((group, groupIndex) => ({
      id: group.id,
      label: group.label,
      slides: group.slides.map((item, slideIndex) => ({ id: item.id, title: item.title, callouts: calloutDrafts[groupIndex][slideIndex] })),
    }));
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopyStatus("복사됨");
    window.setTimeout(() => setCopyStatus(""), 1600);
  };

  const resetCallouts = () => {
    setCalloutDrafts(defaultCalloutDrafts());
    setSelectedCallout(0);
    setCopyStatus("초기화됨");
    window.setTimeout(() => setCopyStatus(""), 1600);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  };

  const handlePointerDown = (event) => {
    if (event.target.closest("button, a, .preview-screen")) return;
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
    dragStart.current = null;
  };

  const group = screenGroups[activeGroup];
  const screen = { ...group.slides[activeSlide], label: group.label, callouts: calloutDrafts[activeGroup][activeSlide] };

  return (
    <div className="management-detail" style={{
      "--section-backgrounds": `url(${sectionBackgrounds})`,
      "--screen-preview-background": `url(${screenPreviewBackground})`,
      "--outcomes-background": `url(${outcomesBackground})`,
      "--role-background": `url(${roleBackground})`,
      "--next-project-background": `url(${nextProjectBackground})`,
      "--purple-card": `url(${darkPurpleCard})`,
    }}>
      <DetailHeader onRouteNavigate={onRouteNavigate} onSectionNavigate={onSectionNavigate} />

      <main>
        <section className="management-hero" id="detail-top">
          <div className="detail-container management-hero-grid">
            <div className="management-hero-copy">
              <a className="back-to-axtion" href="/#axtion" onClick={(event) => onSectionNavigate(event, "#axtion")}>← BACK TO AXTION</a>
              <DetailMarker number="01" />
              <p className="management-eyebrow">BUSINESS MANAGEMENT PLATFORM</p>
              <h1><b>경영관리 플랫폼</b><span /></h1>
              <h2>흩어진 사업 데이터를<br />하나의 흐름으로.</h2>
              <p className="management-description">여러 공공·행사 프로젝트의 예산, 지출, 일정, 이해관계자 정보를<br />한곳에서 관리할 수 있도록 기획하고 구현한 경영관리 플랫폼입니다.</p>
              <a className="management-primary-cta" href="#screen-preview">프로젝트 보기 <span>→</span></a>
              <ul className="management-tags" aria-label="프로젝트 태그">
                {['#R&D', '#공연·행사', '#예산관리', '#일정관리', '#협업툴'].map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
            <div className="management-product-visual">
              <img src={heroLaptop} alt="경영관리 플랫폼 대시보드가 표시된 노트북" />
            </div>
            <aside className="management-side-copy" aria-hidden="true">
              <p>DATA<br />CONNECTS<br />PEOPLE<br />CREATES<br />BETTER<br />OPERATIONS</p>
              <i />
              <p>TURN<br />COMPLEXITY<br />INTO<br />CLARITY</p>
            </aside>
          </div>
        </section>

        <section className="management-features">
          <div className="detail-container management-feature-grid">
            <div className="feature-heading">
              <DetailMarker number="02" />
              <h2>KEY FEATURES</h2>
              <p>운영에 필요한 핵심 기능을<br />하나의 플랫폼에서.</p>
            </div>
            <div className="feature-list">
              {features.map(([icon, title, copy]) => (
                <article key={title}>
                  <FeaturePictogram index={icon} />
                  <h3>{title}</h3>
                  <p>{copy.split("\n").map((line, index) => <React.Fragment key={line}>{index ? <br /> : null}{line}</React.Fragment>)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="management-preview" id="screen-preview">
          <div className="detail-container preview-layout">
            <div className="preview-sidebar">
              <DetailMarker number="03" />
              <h2>SCREEN PREVIEW</h2>
              <p>실제 화면으로<br />기능을 확인해보세요.</p>
              <div className="preview-tabs" role="tablist" aria-label="플랫폼 화면 목록">
                {screenGroups.map((item, index) => (
                  <button className={index === activeGroup ? "is-active" : ""} key={item.id} onClick={() => selectGroup(index)} role="tab" aria-selected={index === activeGroup}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{item.label}<i>→</i>
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-stage" tabIndex="0" onKeyDown={handleKeyDown} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} aria-label="플랫폼 화면 미리보기. 좌우 방향키 또는 드래그로 이동할 수 있습니다.">
              <p className="preview-explore">EXPLORE<br />THE PLATFORM</p>
              {!isEditMode ? <a className="preview-edit-toggle" href={`${window.location.pathname}?edit=preview#screen-preview`}>설명 편집</a> : null}
              {group.slides.length > 1 ? [-1, 1].map((offset) => {
                const index = (activeSlide + offset + group.slides.length) % group.slides.length;
                return (
                  <div
                    className={`preview-ghost preview-ghost-${offset < 0 ? "left" : "right"} preview-ghost-${Math.abs(offset)}`}
                    aria-hidden="true"
                    key={`${screen.id}-${offset}`}
                  >
                    <img className="preview-frame-art" src={screenFrame} alt="" />
                    <img className="preview-capture" src={group.slides[index].image} alt="" />
                  </div>
                );
              }) : null}
              <figure
                className={`preview-screen${isEditMode ? " is-editing" : ""}`}
                key={screen.id}
                ref={previewScreenRef}
                role="button"
                tabIndex="0"
                aria-label={`${screen.label} 원본 이미지 크게 보기`}
                onClick={() => { if (!isEditMode) setIsPreviewOpen(true); }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (!isEditMode) setIsPreviewOpen(true);
                  }
                }}
              >
                <img className="preview-frame-art" src={screenFrame} alt="" aria-hidden="true" />
                <img className="preview-capture" src={screen.image} alt={screen.alt} draggable="false" />
                {screen.callouts.map((callout, index) => {
                  const line = getCalloutLine(callout);
                  return (
                  <React.Fragment key={callout.number}>
                    <svg className={`screen-callout-line${callout.isDashed ? " is-dashed" : ""}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ "--callout-delay": `${index * 900 + 120}ms` }}>
                      <path d={line.path} />
                    </svg>
                    <span
                      className="screen-callout-dot"
                      aria-hidden="true"
                      style={{ left: `${callout.targetX}%`, top: `${callout.targetY}%`, "--callout-delay": `${index * 900 + 120}ms` }}
                    />
                    {isEditMode ? (
                      <>
                        <button
                          type="button"
                          className={`callout-target-handle${index === selectedCallout ? " is-selected" : ""}`}
                          style={{ left: `${callout.targetX}%`, top: `${callout.targetY}%` }}
                          aria-label={`${callout.number} 선 끝점 이동`}
                          onClick={(event) => { event.stopPropagation(); setSelectedCallout(index); }}
                          onPointerDown={(event) => handleCalloutDrag(event, index, "target")}
                        />
                        {line.style !== "straight" ? (
                          <button
                            type="button"
                            className={`callout-bend-handle${index === selectedCallout ? " is-selected" : ""}`}
                            style={{ left: `${line.bendX}%`, top: `${line.bendY}%` }}
                            aria-label={`${callout.number} 선 각도 이동`}
                            onClick={(event) => { event.stopPropagation(); setSelectedCallout(index); }}
                            onPointerDown={(event) => handleCalloutDrag(event, index, "bend")}
                          />
                        ) : null}
                      </>
                    ) : null}
                    <div
                      className={`screen-callout${isEditMode && index === selectedCallout ? " is-selected" : ""}`}
                      style={{ left: `${callout.x}%`, top: `${callout.y}%`, "--callout-delay": `${index * 900 + 120}ms` }}
                      onClick={(event) => { event.stopPropagation(); setSelectedCallout(index); }}
                      onPointerDown={(event) => handleCalloutDrag(event, index, "label")}
                    >
                      <b>{callout.number}</b><span><strong>{callout.title}</strong><small>{callout.copy}</small></span>
                    </div>
                  </React.Fragment>
                  );
                })}
              </figure>
              <div className="preview-controls">
                <span className="preview-slide-title">{screen.title}</span>
                <span aria-live="polite">{String(activeSlide + 1).padStart(2, "0")} / {String(group.slides.length).padStart(2, "0")}</span>
                <button aria-label="이전 화면" onClick={() => move(-1)}>←</button>
                <button aria-label="다음 화면" onClick={() => move(1)}>→</button>
              </div>
              {isEditMode ? (
                <aside className="preview-editor" aria-label="프리뷰 설명 편집기">
                  <header><strong>설명 편집</strong><span>{screen.label} · {screen.title}</span><a href={window.location.pathname}>종료</a></header>
                  <div className="preview-editor-callout-tabs" aria-label="편집할 설명 선택">
                    {screen.callouts.map((item, index) => (
                      <button type="button" className={index === selectedCallout ? "is-active" : ""} key={item.number} onClick={() => setSelectedCallout(index)}>{item.number}</button>
                    ))}
                  </div>
                  {screen.callouts[selectedCallout] ? (
                    <>
                      <fieldset className="preview-editor-line-controls">
                        <legend>선 모양</legend>
                        <div>
                          {[
                            ["straight", "직선"],
                            ["elbow", "꺾은선"],
                            ["curve", "곡선"],
                          ].map(([value, label]) => (
                            <button
                              type="button"
                              className={(screen.callouts[selectedCallout].lineStyle ?? "elbow") === value ? "is-active" : ""}
                              aria-pressed={(screen.callouts[selectedCallout].lineStyle ?? "elbow") === value}
                              key={value}
                              onClick={() => updateCallout(selectedCallout, value === "curve"
                                ? { lineStyle: value, ...getCurveBend(screen.callouts[selectedCallout]) }
                                : { lineStyle: value })}
                            >{label}</button>
                          ))}
                        </div>
                        <button
                          type="button"
                          className={`preview-editor-dashed${screen.callouts[selectedCallout].isDashed ? " is-active" : ""}`}
                          aria-label={`점선으로 표시 ${screen.callouts[selectedCallout].isDashed ? "켜짐" : "꺼짐"}`}
                          onClick={() => updateCallout(selectedCallout, { isDashed: !screen.callouts[selectedCallout].isDashed })}
                        >
                          <span aria-hidden="true">{screen.callouts[selectedCallout].isDashed ? "✓" : ""}</span>
                          점선으로 표시
                        </button>
                      </fieldset>
                      <label>제목<input value={screen.callouts[selectedCallout].title} onChange={(event) => updateCallout(selectedCallout, { title: event.target.value })} /></label>
                      <label>설명<textarea rows="3" value={screen.callouts[selectedCallout].copy} onChange={(event) => updateCallout(selectedCallout, { copy: event.target.value })} /></label>
                    </>
                  ) : <p>설명을 추가해 주세요.</p>}
                  <div className="preview-editor-actions">
                    <button type="button" onClick={addCallout}>+ 추가</button>
                    <button type="button" onClick={removeCallout} disabled={!screen.callouts.length}>삭제</button>
                    <button type="button" className="is-primary" onClick={copyCallouts}>{copyStatus || "좌표 복사"}</button>
                    <button type="button" onClick={resetCallouts}>초기화</button>
                  </div>
                  <small>번호, 끝점, 각도점을 드래그하세요. 변경 내용은 이 브라우저에 자동 저장됩니다.</small>
                </aside>
              ) : null}
            </div>
          </div>
        </section>

        {isPreviewOpen ? (
          <div className="preview-lightbox" role="dialog" aria-modal="true" aria-label={`${screen.label} 원본 이미지`} onClick={() => setIsPreviewOpen(false)}>
            <div className="preview-lightbox-content" onClick={(event) => event.stopPropagation()}>
              <button type="button" aria-label="원본 이미지 닫기" onClick={() => setIsPreviewOpen(false)}>×</button>
              <img src={screen.image} alt={screen.alt} />
            </div>
          </div>
        ) : null}

        <section className="management-outcomes">
          <div className="detail-container outcome-grid">
            <div className="outcome-heading"><DetailMarker number="04" /><h2>BEFORE → AFTER</h2><p>이렇게 달라졌습니다.</p></div>
            <OutcomeCard title="BEFORE" items={["엑셀 파일로 개별 관리", "최신 버전 확인의 어려움", "수기 정리로 인한 시간 소요", "지출 현황 파악의 비효율"]} />
            <span className="outcome-arrow">→</span>
            <OutcomeCard title="AFTER" accent items={["하나의 플랫폼에서 통합 관리", "실시간 데이터로 빠른 의사결정", "업무 시간 절감 및 오류 최소화", "투명한 예산 집행 및 보고 체계"]} />
            <blockquote>흩어져 있던 정보가<br />하나로 연결되었을 때,<br />운영의 속도가 달라졌습니다.</blockquote>
          </div>
        </section>

        <section className="management-role">
          <div className="detail-container role-grid">
            <div className="role-heading"><DetailMarker number="05" /><h2>MY ROLE</h2><p>기획부터 실제 적용까지,<br />전 과정을 주도했습니다.</p></div>
            <div className="role-steps">
              {roles.map(([number, title, copy], index) => (
                <React.Fragment key={number}>
                  <article><FeaturePictogram index={index} row="role" /><h3>{number}. {title}</h3><p>{copy}</p></article>
                  {index < roles.length - 1 ? <span aria-hidden="true">→</span> : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="management-next">
          <div className="detail-container next-grid">
            <div><p>NEXT PROJECT</p><h2>고객 경험을 연결하는<br />CS 관리 플랫폼도 확인해보세요.</h2></div>
            <a href="/axtion/cs-platform" onClick={(event) => onRouteNavigate(event, "/axtion/cs-platform")}>
              <img src={csLaptop} alt="CS 관리 플랫폼 화면" />
              <span>→</span><strong>CS 관리 플랫폼 보기</strong>
            </a>
            <p>DIFFERENT PLATFORMS<br />A STRONGER ME</p>
          </div>
        </section>
      </main>

      <footer className="management-footer">
        <div className="detail-container">
          <div className="management-footer-identity">
            <div className="management-footer-brand"><b>WJ</b><span>박우정 PARK WOOJUNG<br /><small>운영 매니저 OPERATIONS MANAGER</small></span></div>
            <i aria-hidden="true" />
            <address className="management-footer-contact">
              <a href="mailto:arinawj@gmail.com">arinawj@gmail.com</a>
              <i aria-hidden="true" />
              <a href="tel:+821094956561">+82-010-9495-6561</a>
            </address>
          </div>
          <p>더 나은 운영을 위한 새로운 가능성을 고민합니다.<br />© 2026 Park Woojung. All rights reserved.</p>
          <nav><a href="/#home" aria-label="메인 홈으로 이동" title="HOME" onClick={(event) => onSectionNavigate(event, "#home")}><span aria-hidden="true">HOME</span></a></nav>
        </div>
      </footer>
      <DetailTextEditor storageKey="wj-management-detail-copy-v1" />
    </div>
  );
}

function DetailHeader({ onRouteNavigate, onSectionNavigate }) {
  return (
    <header className="management-header">
      <div className="detail-container">
        <a className="management-brand" href="/" onClick={(event) => onRouteNavigate(event, "/")}><b>WJ</b><span>박우정 PARK WOOJUNG<small>운영 매니저 OPERATIONS MANAGER</small></span></a>
        <nav aria-label="상세 페이지 내비게이션">
          <a href="/#home" onClick={(event) => onSectionNavigate(event, "#home")}>HOME</a>
          <a href="/#operate" onClick={(event) => onSectionNavigate(event, "#operate")}>OPERATE</a>
          <a href="/#manage" onClick={(event) => onSectionNavigate(event, "#manage")}>MANAGE</a>
          <a className="is-active" href="/#axtion" onClick={(event) => onSectionNavigate(event, "#axtion")}>AXTION</a>
          <a href="/#contact" onClick={(event) => onSectionNavigate(event, "#contact")}>CONTACT</a>
        </nav>
        <div className="management-language">KR <i /> EN <span>↗</span></div>
      </div>
    </header>
  );
}

function DetailMarker({ number }) {
  return <div className="detail-marker"><span>{number}</span><i /></div>;
}

function OutcomeCard({ title, items, accent = false }) {
  return <article className={`outcome-card${accent ? " is-accent" : ""}`}><h3>{title}</h3><ul>{items.map((item) => <li key={item}><span>✓</span><b>{item}</b></li>)}</ul></article>;
}

function FeaturePictogram({ index, row = "feature" }) {
  const featureOffsets = [-4, -65, -119, -176];
  const roleOffsets = [5, -43, -90, -138, -186];
  return (
    <span className={`feature-pictogram feature-pictogram-${row}`} aria-hidden="true">
      <img src={pictogramSheet} alt="" style={{ left: `${(row === "role" ? roleOffsets : featureOffsets)[index]}px`, top: row === "role" ? "-60px" : "0" }} />
    </span>
  );
}

function FeatureIcon({ name }) {
  const paths = {
    chart: <><path d="M5 20V11h4v9M11 20V5h4v15M17 20V2h4v18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 3v9h8" /></>,
    people: <><circle cx="9" cy="8" r="3" /><circle cx="16.5" cy="9" r="2.5" /><path d="M3 20c.7-4 2.7-6 6-6s5.3 2 6 6M14 15c3.8-1.2 6.3.6 7 4" /></>,
    report: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    send: <><path d="m3 11 18-8-8 18-2-7-8-3Z" /><path d="m11 14 5-6" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name] ?? paths.report}</svg>;
}

export default ManagementDetail;
