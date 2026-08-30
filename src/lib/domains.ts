import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Blocks,
  Boxes,
  Braces,
  Brain,
  CheckCircle2,
  ClipboardList,
  Code2,
  Compass,
  Database,
  Film,
  LayoutGrid,
  Megaphone,
  Palette,
  PenLine,
  PenTool,
  PieChart,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Table2,
  TrendingUp,
  Workflow,
} from "lucide-react";

export interface Specialty {
  readonly id: string;
  /** Short canonical name — used as the AI focus area and in breadcrumbs. */
  readonly label: string;
  /** Headline shown on the homepage practice card. */
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly difficulty: 1 | 2 | 3;
}

export interface DomainTheme {
  readonly text: string;
  readonly badgeBg: string;
  readonly pillBg: string;
  readonly pillText: string;
  readonly border: string;
  readonly dot: string;
  /** Light section backdrop tint — keeps each category bright and distinct
   * instead of a repeated neutral-gray box. */
  readonly wash: string;
}

export interface DomainConfig {
  /** Must match a ModuleDefinition.id in src/modules/registry.ts — this is
   * what resolves /interview/[domain]/[specialty] to the right module. */
  readonly id: string;
  readonly label: string;
  readonly sectionTitle: string;
  /** One line, shown on the /fields carousel card. */
  readonly description: string;
  readonly icon: LucideIcon;
  readonly theme: DomainTheme;
  readonly specialties: readonly Specialty[];
  /** True when no module is registered yet — card renders but doesn't navigate. */
  readonly comingSoon?: boolean;
}

export const domains: readonly DomainConfig[] = [
  {
    id: "tech",
    label: "Development",
    sectionTitle: "Công nghệ",
    description: "Web, mobile, AI, DevOps — luyện phỏng vấn kỹ thuật thực tế.",
    icon: Code2,
    theme: {
      text: "text-green-600",
      badgeBg: "bg-green-600",
      pillBg: "bg-green-50",
      pillText: "text-green-600",
      border: "border-green-200",
      dot: "bg-green-500",
      wash: "bg-green-50/70 dark:bg-green-950/20",
    },
    specialties: [
      {
        id: "web-development",
        label: "Web Development",
        title: "Web Development",
        description: "DOM, các mẫu React và bố cục CSS phức tạp.",
        icon: Braces,
        difficulty: 2,
      },
      {
        id: "mobile-development",
        label: "Mobile Development",
        title: "Mobile Development",
        description: "iOS, Android và phát triển ứng dụng đa nền tảng.",
        icon: Smartphone,
        difficulty: 2,
      },
      {
        id: "software-development",
        label: "Software Development",
        title: "Software Development",
        description: "Thiết kế hệ thống, cấu trúc dữ liệu và giải thuật.",
        icon: Code2,
        difficulty: 3,
      },
      {
        id: "ai-ml",
        label: "AI & ML",
        title: "AI & ML",
        description: "Machine learning, mô hình hóa và triển khai AI.",
        icon: Brain,
        difficulty: 3,
      },
      {
        id: "devops-cloud",
        label: "DevOps & Cloud",
        title: "DevOps & Cloud",
        description: "Container hóa, CI/CD và hạ tầng cloud.",
        icon: Server,
        difficulty: 3,
      },
      {
        id: "data",
        label: "Data",
        title: "Data",
        description: "Truy vấn SQL, pipeline và phân tích dữ liệu.",
        icon: Database,
        difficulty: 2,
      },
      {
        id: "qa-testing",
        label: "QA & Testing",
        title: "QA & Testing",
        description: "Kiểm thử tự động, quy trình QA và đảm bảo chất lượng.",
        icon: CheckCircle2,
        difficulty: 1,
      },
      {
        id: "blockchain",
        label: "Blockchain",
        title: "Blockchain",
        description: "Smart contract, Web3 và hệ thống phi tập trung.",
        icon: Blocks,
        difficulty: 3,
      },
      {
        id: "cybersecurity",
        label: "Cybersecurity",
        title: "Cybersecurity",
        description: "Bảo mật ứng dụng, penetration testing và an toàn hệ thống.",
        icon: ShieldCheck,
        difficulty: 3,
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    sectionTitle: "Marketing",
    description: "SEO, quảng cáo, content — chiến lược marketing đa kênh.",
    icon: Megaphone,
    theme: {
      text: "text-rose-600",
      badgeBg: "bg-rose-600",
      pillBg: "bg-rose-50",
      pillText: "text-rose-600",
      border: "border-rose-200",
      dot: "bg-rose-500",
      wash: "bg-rose-50/70 dark:bg-rose-950/20",
    },
    specialties: [
      {
        id: "seo",
        label: "SEO",
        title: "SEO",
        description: "SEO kỹ thuật và chiến lược nội dung.",
        icon: Search,
        difficulty: 2,
      },
      {
        id: "ads",
        label: "Ads",
        title: "Ads & Growth",
        description: "Tối ưu phễu chuyển đổi và marketing hiệu suất.",
        icon: TrendingUp,
        difficulty: 1,
      },
      {
        id: "content",
        label: "Content",
        title: "Content",
        description: "Chiến lược nội dung đa kênh và giữ chân người dùng.",
        icon: PenLine,
        difficulty: 2,
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    sectionTitle: "Thiết kế",
    description: "UI/UX, graphic, motion — tư duy thiết kế trải nghiệm.",
    icon: Palette,
    theme: {
      text: "text-emerald-600",
      badgeBg: "bg-emerald-600",
      pillBg: "bg-emerald-50",
      pillText: "text-emerald-600",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      wash: "bg-emerald-50/70 dark:bg-emerald-950/20",
    },
    // No ModuleDefinition registered for "design" yet — shown for product
    // completeness, cards render disabled instead of routing to a 404.
    comingSoon: true,
    specialties: [
      {
        id: "ui-ux",
        label: "UI/UX",
        title: "UI/UX",
        description: "Luồng người dùng, prototyping và hệ thống thiết kế.",
        icon: LayoutGrid,
        difficulty: 3,
      },
      {
        id: "graphic",
        label: "Graphic Design",
        title: "Graphic Design",
        description: "Bố cục, màu sắc và hệ thống nhận diện thương hiệu.",
        icon: PenTool,
        difficulty: 2,
      },
      {
        id: "motion",
        label: "Motion Design",
        title: "Motion Design",
        description: "Chuyển động, storyboard và diễn hoạt giao diện.",
        icon: Film,
        difficulty: 2,
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    sectionTitle: "Data & Analytics",
    description:
      "Data analyst, engineer, scientist — phân tích và ra quyết định bằng số liệu.",
    icon: BarChart3,
    theme: {
      text: "text-sky-600",
      badgeBg: "bg-sky-600",
      pillBg: "bg-sky-50",
      pillText: "text-sky-600",
      border: "border-sky-200",
      dot: "bg-sky-500",
      wash: "bg-sky-50/70 dark:bg-sky-950/20",
    },
    // Mock preview — no module registered yet.
    comingSoon: true,
    specialties: [
      {
        id: "data-analyst",
        label: "Data Analyst",
        title: "Data Analyst",
        description: "Truy vấn SQL, trực quan hóa và kể chuyện bằng số liệu.",
        icon: Table2,
        difficulty: 1,
      },
      {
        id: "data-engineer",
        label: "Data Engineer",
        title: "Data Engineer",
        description: "Thiết kế pipeline, ETL và kho dữ liệu quy mô lớn.",
        icon: Workflow,
        difficulty: 3,
      },
      {
        id: "data-scientist",
        label: "Data Scientist",
        title: "Data Scientist",
        description: "Mô hình hóa, thống kê và thử nghiệm A/B.",
        icon: Brain,
        difficulty: 3,
      },
      {
        id: "bi",
        label: "BI Analyst",
        title: "BI Analyst",
        description: "Dashboard, chỉ số kinh doanh và báo cáo tự động.",
        icon: PieChart,
        difficulty: 2,
      },
    ],
  },
  {
    id: "product",
    label: "Product",
    sectionTitle: "Product",
    description:
      "Product manager, product owner — dẫn dắt sản phẩm từ ý tưởng đến ra mắt.",
    icon: Boxes,
    theme: {
      text: "text-amber-600",
      badgeBg: "bg-amber-600",
      pillBg: "bg-amber-50",
      pillText: "text-amber-600",
      border: "border-amber-200",
      dot: "bg-amber-500",
      wash: "bg-amber-50/70 dark:bg-amber-950/20",
    },
    // Mock preview — no module registered yet.
    comingSoon: true,
    specialties: [
      {
        id: "product-manager",
        label: "Product Manager",
        title: "Product Manager",
        description: "Ưu tiên hóa roadmap, khám phá vấn đề và ra quyết định.",
        icon: ClipboardList,
        difficulty: 3,
      },
      {
        id: "product-owner",
        label: "Product Owner",
        title: "Product Owner",
        description: "Backlog, user story và làm việc với đội ngũ kỹ thuật.",
        icon: Compass,
        difficulty: 2,
      },
    ],
  },
];

export function findDomain(domainId: string): DomainConfig | undefined {
  return domains.find((domain) => domain.id === domainId);
}

export function findSpecialty(
  domainId: string,
  specialtyId: string
): Specialty | undefined {
  return findDomain(domainId)?.specialties.find(
    (specialty) => specialty.id === specialtyId
  );
}
