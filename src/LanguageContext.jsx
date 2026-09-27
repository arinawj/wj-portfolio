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

const completeTranslations = {
  "박우정 PARK WOOJUNG": "PARK WOOJUNG",
  "현장에서 답을 찾고": "I find answers in the field,",
  "운영의 흐름을 설계하며": "design operational flows,",
  "사람과 상황을 연결해\n전체가 움직일 수 있도록.": "Connecting people and situations\nso the whole operation can move.",
  "공연과 행사, 항공, 고객 서비스, B2B까지\n서로 다른 환경에서 운영을 경험했습니다.\n사람과 상황을 이해하고 필요한 요소를 연결해\n전체가 움직일 수 있게 만드는 것이\n저의 운영 방식입니다.": "From shows and events to aviation, customer service, and B2B,\nI have managed operations across very different environments.\nMy approach is to understand people and situations, connect what is needed,\nand enable the entire operation to move together.",
  "사람이 많아질수록\n직접 움직이기보다 사람들이 움직일 수 있게.": "As the team grows,\nI focus less on doing everything myself and more on enabling people to move.",
  "800명 규모 행사에서 다양한 숙련도의 운영 인력을 함께 관리했습니다. 업무 이해도가 높은 인력을 주요 포인트에 배치하고, 저는 전체 진행을 볼 수 있는 위치에서 상황을 조율하며 필요한 순간에 지원했습니다.": "I managed an operations team of 800 people with varying levels of experience. I placed experienced staff at key points, coordinated the full operation from a central vantage point, and stepped in wherever support was needed.",
  "모든 일을 직접 해결하는 것보다, 사람의 강점을 파악하고 역할을 맡겨 전체가 움직이게 만드는 것이 운영자의 역할이라는 것을 배웠습니다.": "I learned that an operations manager's role is not to solve everything alone, but to recognize people's strengths, assign clear roles, and enable the whole team to move together.",
  "친절보다 먼저 필요한 것은\n상대의 상황을 이해하는 것입니다.": "Before kindness comes\nunderstanding the other person's situation.",
  "해외 항공사에서 다양한 국적의 승객과 동료를 만났습니다.\n정해진 방식이나 문화적 기준을 먼저 적용하기보다 상대가 처한 상황을 듣고 이해한 뒤, 필요한 방식으로 대응하고 협업했습니다.": "At an international airline, I worked with passengers and colleagues from many cultures.\nInstead of applying one fixed approach or cultural standard, I listened first, understood each person's circumstances, and responded in the way the situation required.",
  "서비스에는 하나의 정답이 없었습니다.\n상대를 먼저 이해할 때 고객에게는 필요한 지원을,\n동료와는 더 나은 협업을 만들 수 있었습니다.": "There was no single right answer in service.\nBy understanding the other person first, I could provide customers with the support they needed and build stronger collaboration with colleagues.",
  "필요한 자원이 없을 때\n관계가 새로운 선택지를 만듭니다.": "When resources are limited,\nrelationships create new options.",
  "광고주의 조건에 맞는 화물주 인프라를 바로 확보하기 어려운 상황이 있었습니다. 평소 동종·유사업계 관계자들과 꾸준히 소통하며 만들어둔 네트워크를 활용해 새로운 파트너와 연결 가능성을 찾았습니다.": "When the right logistics network for an advertiser was not immediately available, I drew on relationships built through ongoing communication with peers in related industries to identify and connect with new partners.",
  "필요할 때만 관계를 찾는 것으로는 한계가 있었습니다.\n평소 쌓아둔 신뢰와 네트워크 역시 문제를 해결하는 운영 자원이 될 수 있었습니다.": "Relationships cannot be built only when they are needed. I learned that trust and networks developed over time can become valuable operational resources for solving problems.",
  "복잡한 일을 하나의\n흐름으로 관리합니다.": "Managing complex work\nas one connected flow.",
  "현장에서 사람과 상황을 보는 법을 배웠다면\n프로젝트에서는 여러 업무가 연결되는\n전체 흐름을 관리하는 법을 배웠습니다.\n저는 복잡한 업무를 구조화하고\n사람과 자원, 일정을 연결해 결과로 이어지도록\n관리하는 방식을 만들어왔습니다.": "Field operations taught me how to read people and situations.\nProject work taught me how to manage the full flow connecting multiple tasks.\nI structure complex work and connect people, resources, and schedules so they lead to results.",
  "여러 업무가 동시에 움직일 때\n무엇이 먼저 연결되어야 하는지를 정리했습니다.": "When multiple tasks moved at once,\nI clarified what needed to connect first.",
  "프로젝트에서는 일정 하나만 움직이지 않습니다. 예산, 이해관계자, 행정과 산출물이 서로 연결되어 있기 때문에 개별 업무보다 전체 흐름을 먼저 보고 관리했습니다.": "A project is never driven by schedules alone. Budgets, stakeholders, administration, and deliverables are interconnected, so I managed the overall flow before individual tasks.",
  "전체 일정과 주요 마일스톤을 파악": "Map the full schedule and key milestones",
  "일정과 연결된 예산, 행정, 이해관계자를 확인": "Identify budgets, administration, and stakeholders tied to the schedule",
  "내부·외부 파트너의 진행사항을 조율": "Coordinate progress across internal and external partners",
  "누락과 지연이 없도록 전체 진행을 관리": "Manage overall progress to prevent omissions and delays",
  "일정 수립 및\n마일스톤 관리": "Schedule planning and\nmilestone management",
  "예산 계획 및\n집행 관리": "Budget planning and\nexecution management",
  "이해관계자 협업 및\n커뮤니케이션": "Stakeholder collaboration\nand communication",
  "행정 절차 및\n진행 프로세스": "Administrative procedures\nand delivery processes",
  "최종 산출물 및\n결과 관리": "Final deliverables and\noutcome management",
  "과제01 :청소년 대상 현실 및 가상 창작, 협동, 참여형 가변복합 공간 실크로드 콘텐츠 플랫폼": "Project 01: Silk Road content platform for youth creativity, collaboration, and participation across physical and virtual spaces",
  "과제02 :실·가상 환경 해석 기반 적응형 인터랙션 기술 개발": "Project 02: Adaptive interaction technology based on physical and virtual environment analysis",
  "과제03 :시장 확대형_AR/XR 기술융합을 통한 Edu Tech 서비스 교육 플랫폼": "Project 03: EdTech learning platform integrating AR/XR technologies for market expansion",
  "과제04 :웨어러블 디바이스 성능평가 기술 개발": "Project 04: Performance evaluation technology for wearable devices",
  "용역 프로젝트명 01 : 2022년 스마트 삼척시립박물관 구축사업": "Service Project 01: 2022 Smart Samcheok City Museum Development",
  "용역 프로젝트명 02 : 2022년 국립중앙극장 실감형 콘텐츠 개발사업": "Service Project 02: 2022 National Theater Immersive Content Development",
  "플랫폼 사용성 관리": "PLATFORM USABILITY MANAGEMENT",
  "앱·웹 사용 중 불편과 개선사항을 점검해 개발팀과 소통\n업데이트 이슈 발생 시 고객 사전 안내": "Review app and web usability, coordinate improvements with developers,\nand notify customers in advance of update issues",
  "생각에서 멈추지 않고,": "I do not stop at ideas.",
  "가능한 방법을 찾아 시도합니다.": "I find a workable path and put it into action.",
  "운영 과정에서 반복되는 문제를 발견하고\nAI 에이전트를 활용해 필요한 업무 시스템을\n직접 기획하고 구현했습니다.\n\n현재 보고계신 포트폴리오 웹페이지도 AI활용하여\n제작되었습니다.": "I identified recurring operational problems and used AI agents to plan and build the systems needed to solve them.\n\nThis portfolio website was also created with AI.",
  "사업부에서의 사용 경험을 바탕으로\n본사 공용 플랫폼 구축을 위한 참고 사례로 개발팀과 공유했습니다.": "Based on practical use within the business unit, I shared the work with the development team as a reference for building a company-wide platform.",
  "흩어진 사업 데이터를\n하나의 흐름으로.": "Turn scattered business data\ninto one connected flow.",
  "여러 공공·행사 프로젝트의 예산, 지출, 일정, 이해관계자 정보를\n한곳에서 관리할 수 있도록 기획하고 구현한 경영관리 플랫폼입니다.": "A business management platform designed and built to manage budgets, expenses, schedules, and stakeholder information for multiple public and event projects in one place.",
  "#손익현황": "#PROFIT&LOSS", "#정산": "#SETTLEMENT", "#예산관리": "#BUDGET", "#지출관리": "#EXPENSES", "#직원요청": "#STAFFREQUESTS",
  "운영에 필요한 핵심 기능을\n하나의 플랫폼에서.": "Essential operational functions\nin one platform.",
  "프로젝트·예산·지출·일정을\n한곳에서 관리": "Manage projects, budgets, expenses,\nand schedules in one place",
  "예산 진행, 정산, 일정 등\n최신 정보 실시간 업데이트": "Real-time updates on budgets,\nsettlements, schedules, and more",
  "기관·파트너·팀 간\n정보 공유 및 커뮤니케이션": "Share information and communicate\nacross agencies, partners, and teams",
  "주요 지표 리포트 자동 생성\n의사결정 지원": "Automatically generate key reports\nto support decision-making",
  "실제 화면으로\n기능을 확인해보세요.": "Explore the features\nthrough real screens.",
  "주요 지표 요약": "KEY METRICS SUMMARY",
  "월별 현황을 한 화면에서 확인합니다.": "Review monthly performance at a glance.",
  "예산/손익/원가/정산": "BUDGET / P&L / COST / SETTLEMENT",
  "월별 예산 대비 실제 집행 흐름을 비교합니다.": "Compare monthly budgets with actual spending.",
  "최근 경영 알림": "RECENT MANAGEMENT ALERTS",
  "중요한 마감과 운영 상태를 빠르게 확인합니다.": "Quickly review key deadlines and operational status.",
  "엑셀 파일로 개별 관리": "Managed separately in Excel files",
  "최신 버전 확인의 어려움": "Difficulty identifying the latest version",
  "수기 정리로 인한 시간 소요": "Time-consuming manual organization",
  "지출 현황 파악의 비효율": "Inefficient expense tracking",
  "하나의 플랫폼에서 통합 관리": "Integrated management in one platform",
  "실시간 데이터로 빠른 의사결정": "Faster decisions with real-time data",
  "업무 시간 절감 및 오류 최소화": "Reduced work time and fewer errors",
  "투명한 예산 집행 및 보고 체계": "Transparent budget execution and reporting",
  "흩어져 있던 정보가\n하나로 연결되었을 때\n운영의 속도가 달라졌습니다.": "When scattered information\nwas connected in one place,\nthe speed of operations changed.",
  "기획부터 실제 적용까지\n전 과정을 주도했습니다.": "I led the entire process,\nfrom planning to implementation.",
  "01. 문제 발견": "01. IDENTIFY PROBLEMS", "현업 페인포인트 분석": "Analyze operational pain points",
  "02. 요구사항 정의": "02. DEFINE REQUIREMENTS", "운영 흐름 및 기능 기획": "Plan workflows and features",
  "03. 시스템 설계": "03. DESIGN THE SYSTEM", "화면 구성 및 데이터 구조 설계": "Design interfaces and data structures",
  "04. 개발 협업 및 테스트": "04. BUILD & TEST", "프로토타입 검증 및 개선": "Validate and improve prototypes",
  "05. 실제 적용": "05. IMPLEMENT", "실무 배포 및 사용자 피드백 반영": "Deploy in practice and incorporate user feedback",
  "고객 경험을 연결하는\nCS 관리 플랫폼도 확인해보세요.": "Explore the CS platform\nthat connects customer experiences.",
  "CS 관리 플랫폼 보기": "VIEW CS MANAGEMENT PLATFORM",
  "고객의 목소리를\n더 나은 경험으로.": "Turn customer voices\ninto better experiences.",
  "여러 채널로 들어오는 고객 문의를 하나의 플랫폼에서\n통합 관리하고 더 빠르고 정확한 응대를 가능하게 한 CS 관리 플랫폼입니다.": "A CS management platform that brings customer inquiries from multiple channels into one place, enabling faster and more accurate responses.",
  "#고객관리": "#CUSTOMERMANAGEMENT", "#상담관리": "#SUPPORTMANAGEMENT", "#운영효율화": "#OPERATIONALEFFICIENCY", "#데이터기반개선": "#DATA-DRIVENIMPROVEMENT",
  "고객 응대의 전체 과정을\n하나의 플랫폼에서.": "The entire customer response process\nin one platform.",
  "여러 채널의 고객 문의를\n한곳에서 통합 관리": "Bring customer inquiries from\nmultiple channels into one place",
  "템플릿과 자동 분류로\n응대 시간 단축": "Reduce response time with\ntemplates and automatic classification",
  "문의 유형과 응대 현황 분석으로\n서비스 품질 향상": "Improve service quality by analyzing\ninquiry types and response status",
  "고객 히스토리 기반의\n맞춤형 응대 가능": "Deliver personalized responses\nbased on customer history",
  "전체 문의, 처리율, 평균 응답 시간을 한눈에 확인합니다.": "Review total inquiries, resolution rate, and average response time at a glance.",
  "VOC 분석 현황": "VOC ANALYTICS",
  "문의 유형과 채널별 흐름을 데이터로 확인합니다.": "Analyze inquiry types and channel flows through data.",
  "최근 VOC": "RECENT VOC",
  "새로 접수된 고객 문의와 처리 상태를 빠르게 파악합니다.": "Quickly review new customer inquiries and their status.",
  "여러 채널의 문의를 개별 확인": "Check inquiries separately across channels",
  "상담 이력 파악의 어려움": "Difficulty tracking support history",
  "응대 지연으로 고객 불만 증가": "Customer dissatisfaction caused by slow responses",
  "문의 유형 분석이 어려워 개선이 느림": "Slow improvement due to limited inquiry analysis",
  "빠른 응대로 고객 만족도 향상": "Improve customer satisfaction with faster responses",
  "고객 히스토리 기반 맞춤형 응대": "Personalized responses based on customer history",
  "데이터 분석을 통한 지속적 개선": "Continuous improvement through data analysis",
  "고객의 목소리가\n한곳에 모였을 때\n우리는 더 빠르게\n더 나은 경험을 만들 수 있습니다.": "When customer voices\ncome together in one place,\nwe can move faster\nand create a better experience.",
  "현업 CS 업무 분석": "Analyze day-to-day CS operations",
  "데이터가 만드는\n더 나은 경영 경험을 확인해보세요.": "Explore a better management experience\npowered by data.",
  "경영관리 플랫폼 보기": "VIEW BUSINESS MANAGEMENT PLATFORM",
  "더 나은 운영을 위한 새로운 가능성을 고민합니다.\n© 2026 Park Woojung. All rights reserved.": "Exploring new possibilities for better operations.\n© 2026 Park Woojung. All rights reserved.",
  "대시보드": "DASHBOARD", "문의 관리": "INQUIRY MANAGEMENT", "상담 이력": "SUPPORT HISTORY", "고객 관리": "CUSTOMER MANAGEMENT", "지식베이스": "KNOWLEDGE BASE", "통계 분석": "ANALYTICS",
  "지출 전체": "ALL EXPENSES", "정기결제": "RECURRING PAYMENTS", "일반결제": "GENERAL PAYMENTS", "영수증 리스트": "RECEIPTS", "비품 구매": "SUPPLY PURCHASES", "영수증 드라이브": "RECEIPT DRIVE",
  "예산 현황": "BUDGET STATUS", "예산요청서 작성": "BUDGET REQUEST", "월간 예산 사용현황": "MONTHLY BUDGET USE", "올해 예산 전체 현황": "ANNUAL BUDGET STATUS",
  "손익 전체": "P&L OVERVIEW", "매출": "SALES", "매입": "PURCHASES", "판관비": "SG&A", "월 손익": "MONTHLY P&L", "연간 현황": "ANNUAL STATUS",
  "문서 링크": "DOCUMENT LINKS", "사업자등록정보": "BUSINESS REGISTRATION", "계정·권한": "ACCOUNTS & PERMISSIONS", "비목 설정": "ACCOUNT SETTINGS", "승인 대기": "PENDING APPROVAL", "처리 완료": "COMPLETED", "비품 구매 요청": "SUPPLY REQUEST", "건의사항": "SUGGESTIONS",
  "종료": "CLOSE", "선 모양": "LINE STYLE", "직선": "STRAIGHT", "꺾은선": "ELBOW", "곡선": "CURVE", "점선으로 표시": "DASHED LINE", "제목": "TITLE", "설명": "DESCRIPTION", "+ 추가": "+ ADD", "삭제": "DELETE", "좌표 복사": "COPY COORDINATES", "초기화": "RESET", "설명을 추가해 주세요.": "Add a callout.",
};

function normalizeTranslationKey(value) {
  return value.replace(/\u00a0/g, " ").split("\n").map((line) => line.trim().replace(/\s+/g, " ")).join("\n").trim();
}

const translationLookup = new Map([
  ...[...translations].map(([key, value]) => [normalizeTranslationKey(key), value]),
  ...Object.entries(completeTranslations).map(([key, value]) => [normalizeTranslationKey(key), value]),
]);

export function translatePortfolioText(value) {
  if (!value?.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  const translated = translationLookup.get(normalizeTranslationKey(core)) ?? core
    .split("\n")
    .map((line) => translationLookup.get(normalizeTranslationKey(line)) ?? line)
    .join("\n");
  return `${leading}${translated}${trailing}`;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
    if (requestedLanguage === "en" || requestedLanguage === "ko") return requestedLanguage;
    return window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "ko";
  });

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
