import {
  IdCard,
  RefreshCw,
  FileSearch,
  Car,
  ArrowLeftRight,
  Receipt,
  ClipboardCheck,
  FileText,
  CalendarCheck,
  MapPin,
  ScanSearch,
  type LucideIcon
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  IdCard,
  RefreshCw,
  FileSearch,
  Car,
  ArrowLeftRight,
  Receipt,
  ClipboardCheck,
  FileText,
  CalendarCheck,
  MapPin,
  ScanSearch
};

export function getIcon(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || FileText;
}
