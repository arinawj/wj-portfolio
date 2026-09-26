import eventImage from "../assets/main/case-event.png";
import aviationImage from "../assets/main/case-aviation.png";
import b2bImage from "../assets/main/case-network-handshake-v3.png";
import businessLaptopImage from "../assets/main/axtion-laptop-business-front.png";
import csLaptopImage from "../assets/main/axtion-laptop-cs-front.png";

export const navItems = [
  { label: "ABOUT", href: "#home" },
  { label: "OPERATE", href: "#operate" },
  { label: "MANAGE", href: "#manage" },
  { label: "AXTION", href: "#axtion" },
  { label: "CONTACT", href: "#contact" },
];

export const heroCards = [
  {
    title: "OPERATE",
    copy: "People in motion",
    href: "#operate",
  },
  {
    title: "MANAGE",
    copy: "From complexity\nto flow",
    href: "#manage",
  },
  {
    title: "AXTION",
    copy: "AI Transformation\n× Action",
    href: "#axtion",
  },
];

export const operateCases = [
  {
    number: "01",
    label: "PEOPLE",
    category: "SHOW & EVENT",
    image: eventImage,
    alt: "대규모 행사 현장에서 관객과 스태프가 움직이는 장면",
    headline: "사람이 많아질수록,\n직접 움직이기보다\n사람들이 움직일 수 있게.",
    body:
      "800명 규모 행사에서 다양한 숙련도의 운영 인력을 함께 관리했습니다.\n업무 이해도가 높은 인력을 주요 포인트에 배치하고,\n저는 전체 진행을 볼 수 있는 위치에서 상황을 조율하며\n필요한 순간에 지원했습니다.",
    keywords: ["IDENTIFY", "POSITION", "CONTROL", "SUPPORT"],
    learned:
      "모든 일을 직접 해결하는 것보다,\n사람의 강점을 파악하고 역할을 맡겨\n전체가 움직이게 만드는 것이 운영자의 역할이라는 것을 배웠습니다.",
  },
  {
    number: "02",
    label: "UNDERSTANDING",
    category: "SERVICE (AVIATION)",
    image: aviationImage,
    alt: "항공 서비스 현장에서 객실승무원이 업무 중인 장면",
    headline: "친절보다 먼저 필요한 것은\n상대의 상황을 이해하는 것입니다.",
    body:
      "해외 항공사에서 다양한 국적의 승객과 동료를 만났습니다.\n정해진 방식이나 문화적 기준을 먼저 적용하기보다\n상대가 처한 상황을 듣고 이해한 뒤,\n필요한 방식으로 대응하고 협업했습니다.",
    keywords: ["LISTEN", "UNDERSTAND", "ADAPT", "SUPPORT"],
    learned:
      "서비스에는 하나의 정답이 없었습니다.\n상대를 먼저 이해할 때 고객에게는 필요한 지원을,\n동료와는 더 나은 협업을 만들 수 있었습니다.",
  },
  {
    number: "03",
    label: "CONNECTION",
    category: "B2B OPERATIONS",
    image: b2bImage,
    alt: "택배 물류 현장에서 협력 관계를 맺은 파트너들이 악수하는 장면",
    headline: "필요한 자원이 없을 때,\n관계가 새로운 선택지를 만듭니다.",
    body:
      "광고주의 조건에 맞는 화물주 인프라를\n바로 확보하기 어려운 상황이 있었습니다.\n평소 동종·유사업계 관계자들과 꾸준히 소통하며\n만들어둔 네트워크를 활용해\n새로운 파트너와 연결 가능성을 찾았습니다.",
    keywords: ["RELATIONSHIP", "NETWORK", "CONNECTION", "SOLUTION"],
    learned:
      "필요할 때만 관계를 찾는 것으로는 한계가 있었습니다.\n평소 쌓아둔 신뢰와 네트워크 역시\n문제를 해결하는 운영 자원이 될 수 있었습니다.",
  },
];

export const projectFlow = [
  {
    title: "SCHEDULE",
    copy: "일정 수립 및\n마일스톤 관리",
    icon: "calendar",
  },
  {
    title: "BUDGET",
    copy: "예산 계획 및\n집행 관리",
    icon: "budget",
  },
  {
    title: "STAKEHOLDER",
    copy: "이해관계자 협업 및\n커뮤니케이션",
    icon: "people",
  },
  {
    title: "PROCESS",
    copy: "행정 절차 및\n진행 프로세스",
    icon: "document",
  },
  {
    title: "DELIVERABLE",
    copy: "최종 산출물 및\n결과 관리",
    icon: "check",
  },
];

export const whatIDid = [
  {
    title: "PLAN",
    copy: "전체 일정과 주요 마일스톤을 파악",
  },
  {
    title: "CONNECT",
    copy: "일정과 연결된 예산, 행정, 이해관계자를 확인",
  },
  {
    title: "COORDINATE",
    copy: "내부·외부 파트너의 진행사항을 조율",
  },
  {
    title: "CONTROL",
    copy: "누락과 지연이 없도록 전체 진행을 관리",
  },
];

export const projectGroups = [
  {
    title: "GOVERNMENT R&D",
    count: "04",
    summary: "LEAD 01 · PARTICIPATING 03",
    items: [
      { name: "과제명 01", detail: "" },
      { name: "과제명 02", detail: "" },
      { name: "과제명 03", detail: "" },
      { name: "과제명 04", detail: "" },
    ],
  },
  {
    title: "SERVICE / PUBLIC PROJECT",
    count: "02",
    items: [
      { name: "용역 프로젝트명 01", detail: "" },
      { name: "용역 프로젝트명 02", detail: "" },
    ],
  },
];

export const businessOperations = [
  {
    title: "경영관리",
    copy: "사업부 경영관리, 예산, 지출, 정산 등",
  },
  {
    title: "CS 관리",
    copy: "카카오톡 채널 기반 고객 문의 및 CS 운영",
  },
  {
    title: "프로젝트 관리",
    copy: "사업부 프로젝트 일정 및 진행 관리",
  },
  {
    title: "파트너 네트워크",
    copy: "광고 조건에 맞는 화물주·파트너 인프라 확보 및 관계 관리",
  },
  {
    title: "플랫폼 개선 협업",
    copy: "앱·웹 사용 중 불편과 개선사항을 점검해 개발팀과 소통하고, 업데이트 이슈 발생 시 고객 사전 안내",
  },
];

export const axtionProcess = [
  {
    title: "FIND",
    copy: "문제 발견",
    accent: "violet",
    icon: "search",
  },
  {
    title: "STRUCTURE",
    copy: "업무 흐름 구조화",
    accent: "violet",
    icon: "grid",
  },
  {
    title: "BUILD",
    copy: "AI 기반 구현",
    accent: "violet",
    icon: "build",
  },
  {
    title: "TEST",
    copy: "실제 환경에서 테스트",
    accent: "violet",
    icon: "flask",
  },
  {
    title: "USE & IMPROVE",
    copy: "운영하며 지속 개선",
    accent: "gold",
    icon: "note",
  },
];

export const platformProjects = [
  {
    number: "01",
    title: "경영관리 플랫폼",
    copy: "흩어진 사업 데이터를\n하나의 운영 흐름으로.",
    tags: ["BUDGET", "EXPENSE", "P&L", "SETTLEMENT", "COST"],
    href: "/axtion/management-platform",
    image: businessLaptopImage,
    alt: "경영관리 플랫폼 화면이 열린 노트북 mockup",
    accent: "purple",
  },
  {
    number: "02",
    title: "CS 관리 플랫폼",
    copy: "반복되는 고객 대응을\n축적하고 관리할 수 있는\n운영 체계로.",
    tags: ["VOC", "CUSTOMER", "SOP", "MESSAGE", "ANALYSIS"],
    href: "/cs",
    image: csLaptopImage,
    alt: "CS 관리 플랫폼 화면이 열린 노트북 mockup",
    accent: "emerald",
  },
];

export const axtionEvidence = [
  {
    title: "ACTUAL USE",
    copy: "직접 만든 플랫폼을 실제 사업부 업무에 사용하고 있습니다.",
  },
  {
    title: "OWNERSHIP",
    copy: "현재도 직접 관리, 수정, 개선하며 운영하고 있습니다.",
  },
  {
    title: "EXPANDED VALUE",
    copy: "사업부에서의 사용 경험을 바탕으로\n본사 공용 플랫폼 구축을 위한 참고 사례로\n개발팀과 공유했습니다.",
  },
];
