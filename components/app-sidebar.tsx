import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowDownFromLine, CreditCard, FolderSync } from "lucide-react";
import Link from "next/link";
import { SheetTitle } from "./ui/sheet";

export function AppSidebar() {
  const items = [
    {
      title: "Deposit",
      url: "/deposit",
      icon: CreditCard,
    },
    {
      title: "Withdraw",
      url: "/withdraw",
      icon: ArrowDownFromLine,
    },
    {
      title: "Transfer",
      url: "/transfer",
      icon: FolderSync,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Banking App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
