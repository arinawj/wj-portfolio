import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);
const LANGUAGE_KEY = "portfolio-language-v1";

const translations = new Map([
  ["운영 매니저 OPERATIONS MANAGER", "OPERATIONS MANAGER"],
  ["현장에서 답을 찾고,", "I find answers in the field,"],
  ["운영의 흐름을 설계하며,", "design operational flows,"],
  ["생각을 실행으로 만듭니다.", "and turn ideas into action."],
  ["사람이 많아질수록,", "As the team grows,"],
  ["직접 움직이기보다", "I focus less on doing everything myself"],
  ["사람들이 움직일 수 있게.", "and more on enabling people to move."],
  ["800명 규모 행사에서 다양한 숙련도의 운영 인력을 함께 관리했습니다.", "I managed an operations team of 800 people with varying levels of experience."],
  ["업무 이해도가 높은 인력을 주요 포인트에 배치하고,", "I positioned experienced staff at key points,"],
  ["저는 전체 진행을 볼 수 있는 위치에서 상황을 조율하며", "coordinated the operation from a central vantage point,"],
  ["필요한 순간에 지원했습니다.", "and stepped in wherever support was needed."],
  ["모든 일을 직접 해결하는 것보다,", "Rather than solving every task myself,"],
  ["사람의 강점을 파악하고 역할을 맡겨", "I learned to identify each person's strengths, assign clear roles,"],
  ["전체가 움직이게 만드는 것이 운영자의 역할이라는 것을 배웠습니다.", "and create the conditions for the whole operation to move."],
  ["친절보다 먼저 필요한 것은", "Before kindness comes"],
  ["상대의 상황을 이해하는 것입니다.", "understanding the other person's situation."],
  ["해외 항공사에서 다양한 국적의 승객과 동료를 만났습니다.", "At an international airline, I worked with passengers and colleagues from many cultures."],
  ["정해진 방식이나 문화적 기준을 먼저 적용하기보다", "Instead of applying one fixed approach or cultural standard,"],
  ["상대가 처한 상황을 듣고 이해한 뒤,", "I listened first and understood each person's circumstances,"],
  ["필요한 방식으로 대응하고 협업했습니다.", "then responded and collaborated in the way the situation required."],
  ["필요한 자원이 없을 때,", "When resources are limited,"],
  ["관계가 새로운 선택지를 만듭니다.", "relationships create new options."],
  ["광고주의 조건에 맞는 화물주 인프라를", "When the right logistics network for an advertiser"],
  ["바로 확보하기 어려운 상황이 있었습니다.", "was not immediately available,"],
  ["평소 동종·유사업계 관계자들과 꾸준히 소통하며", "I drew on relationships built through ongoing communication"],
  ["만들어둔 네트워크를 활용해", "with peers and partners in adjacent industries"],
  ["새로운 파트너와 연결 가능성을 찾았습니다.", "to identify and connect with new partners."],
  ["경영관리", "BUSINESS MANAGEMENT"],
  ["CS 관리", "CS MANAGEMENT"],
  ["프로젝트 관리", "PROJECT MANAGEMENT"],
  ["파트너 네트워크", "PARTNER NETWORK"],
  ["플랫폼 개선 협업", "PLATFORM IMPROVEMENT"],
  ["사업부 경영관리, 예산, 지출, 정산 등", "Business administration, budgets, expenses, and settlements"],
  ["카카오톡 채널 기반 고객 문의 및 CS 운영", "Customer inquiries and CS operations through KakaoTalk channels"],
  ["사업부 프로젝트 일정 및 진행 관리", "Project schedules and delivery management"],
  ["광고 조건에 맞는 화물주·파트너 인프라 확보 및 관계 관리", "Partner sourcing and relationship management for campaign requirements"],
  ["앱·웹 사용 중 불편과 개선사항을 점검해 개발팀과 소통하고, 업데이트 이슈 발생 시 고객 사전 안내", "Review app and web usability, coordinate improvements with developers, and notify customers before updates"],
  ["문제 발견", "IDENTIFY PROBLEMS"],
  ["업무 흐름 구조화", "STRUCTURE WORKFLOWS"],
  ["AI 기반 구현", "BUILD WITH AI"],
  ["실제 환경에서 테스트", "TEST IN PRACTICE"],
  ["운영하며 지속 개선", "OPERATE AND IMPROVE"],
  ["경영관리 플랫폼", "BUSINESS MANAGEMENT PLATFORM"],
  ["CS 관리 플랫폼", "CS MANAGEMENT PLATFORM"],
  ["흩어진 사업 데이터를", "Turn scattered business data"],
  ["하나의 운영 흐름으로.", "into one operational flow."],
  ["반복되는 고객 대응을", "Turn recurring customer support"],
  ["축적하고 관리할 수 있는", "into a system that can be"],
  ["운영 체계로.", "captured and managed."],
  ["고객의 목소리를", "Turn customer voices"],
  ["더 나은 경험으로.", "into better experiences."],
  ["프로젝트 보기", "VIEW PROJECT"],
  ["직접 만든 플랫폼을 실제 사업부 업무에 사용하고 있습니다.", "The platforms I built are used in day-to-day business operations."],
  ["현재도 직접 관리, 수정, 개선하며 운영하고 있습니다.", "I continue to manage, update, and improve them in production."],
  ["사업부에서의 사용 경험을 바탕으로", "Based on practical use within the business unit,"],
  ["본사 공용 플랫폼 구축을 위한 참고 사례로", "I shared the work with the development team as a reference"],
  ["개발팀과 공유했습니다.", "for building a company-wide platform."],
  ["실제 화면으로", "Explore the features"],
  ["기능을 확인해보세요.", "through real screens."],
  ["이렇게 달라졌습니다.", "HERE IS WHAT CHANGED."],
  ["기획부터 실제 적용까지,", "From planning to implementation,"],
  ["전 과정을 주도했습니다.", "I led the entire process."],
  ["더 나은 운영을 위한 새로운 가능성을 고민합니다.", "Exploring new possibilities for better operations."],
  ["문구 편집", "EDIT COPY"],
  ["편집 종료", "FINISH EDITING"],
  ["문구 편집 중", "EDITING COPY"],
  ["본문 편집 중", "EDITING CONTENT"],
  ["설명 편집", "EDIT CALLOUTS"],
  ["이전 화면", "PREVIOUS SCREEN"],
  ["다음 화면", "NEXT SCREEN"],
  ["통합 데이터 관리", "INTEGRATED DATA"],
  ["실시간 현황 확인", "REAL-TIME STATUS"],
  ["협업 효율화", "EFFICIENT COLLABORATION"],
  ["보고 자동화", "AUTOMATED REPORTING"],
  ["통합 문의 관리", "UNIFIED INQUIRY MANAGEMENT"],
  ["빠른 응대 지원", "FASTER RESPONSES"],
  ["데이터 기반 개선", "DATA-DRIVEN IMPROVEMENT"],
  ["고객 경험 강화", "BETTER CUSTOMER EXPERIENCE"],
  ["고객 응대의 전체 과정을", "Bring the entire customer response process"],
  ["하나의 플랫폼에서.", "into one platform."],
  ["여러 채널로 들어오는 고객 문의를 하나의 플랫폼에서", "This CS platform brings inquiries from multiple channels into one place,"],
  ["통합 관리하고, 더 빠르고 정확한 응대를 가능하게 한 CS 관리 플랫폼입니다.", "enabling faster and more accurate customer responses."],
  ["고객의 목소리가", "When customer voices"],
  ["한곳에 모였을 때,", "came together in one place,"],
  ["우리는 더 빠르게,", "we were able to move faster"],
  ["더 나은 경험을 만들 수 있었습니다.", "and create a better experience."],
  ["설정", "SETTINGS"],
  ["대시보드", "DASHBOARD"],
  ["지출 관리", "EXPENSES"],
  ["예산 관리", "BUDGET"],
  ["손익 현황", "PROFIT & LOSS"],
  ["원가 관리", "COST MANAGEMENT"],
  ["문서 관리", "DOCUMENTS"],
  ["세금계산서", "TAX INVOICES"],
  ["어드민", "ADMIN"],
  ["직원 요청 포털", "STAFF REQUEST PORTAL"],
  ["VOC 관리", "VOC MANAGEMENT"],
  ["고객 DB", "CUSTOMER DB"],
  ["SOP 매뉴얼", "SOP MANUAL"],
  ["메시징 센터", "MESSAGING CENTER"],
  ["분석 대시보드", "ANALYTICS DASHBOARD"],
  ["내 티켓 관리", "MY TICKETS"],
  ["승인 관리", "APPROVALS"],
  ["상위 관리 티켓", "ESCALATED TICKETS"],
]);

export function translatePortfolioText(value) {
  if (!value?.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  const translated = translations.get(core) ?? core
    .split("\n")
    .map((line) => translations.get(line.trim()) ?? line)
    .join("\n");
  return `${leading}${translated}${trailing}`;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "ko");

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function LanguageSwitch({ detail = false }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={detail ? "management-language" : "language-switch"} aria-label="Language switch">
      {!detail ? <i aria-hidden="true" /> : null}
      <button type="button" aria-pressed={language === "ko"} onClick={() => setLanguage("ko")}>KR</button>
      <i aria-hidden="true" />
      <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
    </div>
  );
}

export function PageTranslator() {
  const { language } = useLanguage();

  useEffect(() => {
    let applying = false;
    const applyLanguage = (root = document) => {
      if (applying) return;
      applying = true;
      const elements = root.querySelectorAll?.("*:not(script):not(style):not(input):not(textarea)") ?? [];
      elements.forEach((element) => {
      if (element.closest(".main-copy-content, .detail-copy-content")) return;
      element.childNodes.forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue.trim()) return;
        if (!node.__portfolioKorean) node.__portfolioKorean = node.nodeValue;
        node.nodeValue = language === "en" ? translatePortfolioText(node.__portfolioKorean) : node.__portfolioKorean;
      });
      });
      applying = false;
    };

    applyLanguage();
    const observer = new MutationObserver((mutations) => {
      if (applying) return;
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) applyLanguage(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return null;
}
