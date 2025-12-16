import { UserAvatar } from "@/shared/ui/refine/layout/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/shared/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  useActiveAuthProvider,
  useLogout,
  useRefineOptions,
} from "@refinedev/core";
import { LogOutIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-11",
        "shrink-0",
        "items-center",
        "gap-3",
        "border-b",
        "border-gray-200",
        "bg-white",
        "pr-4",
        "justify-end",
        "z-40"
      )}
    >
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-red-600 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View Store
      </Link>
      <UserDropdown />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-10",
        "shrink-0",
        "items-center",
        "gap-1.5",
        "border-b",
        "border-gray-200",
        "bg-white",
        "pr-2",
        "justify-between",
        "z-40"
      )}
    >
      <SidebarTrigger
        className={cn("text-gray-500", "rotate-180", "ml-1", "h-6 w-6", {
          "opacity-0": open,
          "opacity-100": !open || isMobile,
          "pointer-events-auto": !open || isMobile,
          "pointer-events-none": open && !isMobile,
        })}
      />

      <div
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-start",
          "gap-1.5",
          "transition-discrete",
          "duration-200",
          {
            "pl-2": !open,
            "pl-3": open,
          }
        )}
      >
        <div className="shrink-0">{title.icon}</div>
        <span
          style={{ fontSize: '11px', fontWeight: 600 }}
          className={cn(
            "text-black",
            "leading-none",
            "transition-opacity",
            "duration-200",
            {
              "opacity-0 w-0": !open,
              "opacity-100": open,
            }
          )}
        >
          {title.text}
        </span>
      </div>

      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-0.5 text-[9px] text-gray-500 hover:text-red-600 transition-colors"
      >
        <ExternalLink className="h-2.5 w-2.5" />
        Store
      </Link>
    </header>
  );
}

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn("text-red-600", "hover:text-red-600")}
          />
          <span className={cn("text-red-600", "hover:text-red-600")}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = "Header";
MobileHeader.displayName = "MobileHeader";
DesktopHeader.displayName = "DesktopHeader";
