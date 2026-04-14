import { ReactNode, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router, usePathname } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

type NavItem = {
  label: string;
  href: string;
  icon: (color: string) => ReactNode;
};

export default function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 900;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (color: string) => (
          <MaterialIcons name="dashboard" size={20} color={color} />
        ),
      },
      {
        label: "Expenses",
        href: "/expenses",
        icon: (color: string) => (
          <FontAwesome6 name="receipt" size={18} color={color} />
        ),
      },
      {
        label: "Revenue",
        href: "/revenue",
        icon: (color: string) => (
          <Ionicons name="trending-up" size={20} color={color} />
        ),
      },
      {
        label: "Employees",
        href: "/employees",
        icon: (color: string) => (
          <Ionicons name="people" size={20} color={color} />
        ),
      },
      {
        label: "Reports",
        href: "/reports",
        icon: (color: string) => (
          <Ionicons name="bar-chart" size={20} color={color} />
        ),
      },
    ],
    []
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      router.replace("/login" as any);
    } catch (error) {
      console.log("Sign out failed:", error);
    }
  };

  const goTo = (href: string) => {
    setMenuOpen(false);
    router.push(href as any);
  };

  return (
    <View style={styles.page}>
      {isMobile ? (
        <>
          <View style={styles.mobileTopbar}>
            <Pressable onPress={() => setMenuOpen(true)} style={styles.menuBtn}>
              <Ionicons name="menu" size={28} color="#161821" />
            </Pressable>

            <View style={styles.mobileBrandWrap}>
              <Text style={styles.mobileBrand}>Muzzys Shack</Text>
              <Text style={styles.mobileStore}>Bensalem Store</Text>
            </View>
          </View>

          <ScrollView
            style={styles.mobileContent}
            contentContainerStyle={styles.mobileContentInner}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.mobileTitle}>{title}</Text>
            <Text style={styles.mobileSubtitle}>{subtitle}</Text>
            {children}
          </ScrollView>

          <Modal
            visible={menuOpen}
            animationType="slide"
            transparent
            onRequestClose={() => setMenuOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setMenuOpen(false)}
              />

              <View style={styles.mobileDrawer}>
                <View style={styles.mobileDrawerHeader}>
                  <Text style={styles.logo}>Muzzys Shack</Text>
                  <Text style={styles.sub}>Bensalem Store</Text>

                  <Pressable
                    onPress={() => setMenuOpen(false)}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </Pressable>
                </View>

                <View style={styles.navWrap}>
                  {navItems.map((item) => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      active={pathname === item.href}
                      onPress={() => goTo(item.href)}
                    />
                  ))}
                </View>

                <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                  <Ionicons name="log-out-outline" size={18} color="white" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.frame}>
          <View style={styles.sidebar}>
            <View>
              <View style={styles.brandBlock}>
                <Text style={styles.logo}>Muzzys Shack</Text>
                <Text style={styles.sub}>Bensalem Store</Text>
              </View>

              <View style={styles.navWrap}>
                {navItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                    onPress={() => goTo(item.href)}
                  />
                ))}
              </View>
            </View>

            <Pressable onPress={handleSignOut} style={styles.signOutButton}>
              <Ionicons name="log-out-outline" size={18} color="white" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {children}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function SidebarItem({
  item,
  active,
  onPress,
}: {
  item: NavItem;
  active: boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const showHover = Platform.OS === "web" && hovered && !active;
  const iconColor = active ? "white" : showHover ? "white" : "#eadede";

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.navItem,
        active && styles.activeNavItem,
        showHover && styles.hoverNavItem,
      ]}
    >
      <View style={styles.iconWrap}>{item.icon(iconColor)}</View>

      <Text
        style={[
          styles.navText,
          active && styles.activeNavText,
          showHover && styles.hoverNavText,
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f6f3f2",
  },

  frame: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd3cf",
    backgroundColor: "#f8f5f4",
  },

  sidebar: {
    width: 265,
    backgroundColor: "#4b0006",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
    justifyContent: "space-between",
  },

  brandBlock: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  logo: {
    color: "#ff4b47",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  sub: {
    color: "#cbbbbb",
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  navWrap: {
    marginTop: 24,
    gap: 10,
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "transparent",
  },

  activeNavItem: {
    backgroundColor: "#e11b1d",
  },

  hoverNavItem: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  iconWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    color: "#eadede",
    fontSize: 16,
    fontWeight: "700",
  },

  activeNavText: {
    color: "white",
    fontWeight: "900",
  },

  hoverNavText: {
    color: "white",
  },

  signOutButton: {
    backgroundColor: "#e11b1d",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  signOutText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },

  content: {
    flex: 1,
    backgroundColor: "#f8f5f4",
  },

  contentInner: {
    padding: 30,
  },

  title: {
    fontSize: 56,
    fontWeight: "900",
    color: "#141821",
    marginBottom: 6,
    letterSpacing: -1.2,
  },

  subtitle: {
    color: "#6f7487",
    fontSize: 17,
    marginBottom: 24,
  },

  mobileTopbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#f8f5f4",
    borderBottomWidth: 1,
    borderBottomColor: "#e9dfdb",
  },

  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eadfdb",
  },

  mobileBrandWrap: {
    flex: 1,
  },

  mobileBrand: {
    color: "#141821",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  mobileStore: {
    color: "#6f7487",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

  mobileContent: {
    flex: 1,
    backgroundColor: "#f8f5f4",
  },

  mobileContentInner: {
    padding: 16,
    paddingBottom: 40,
  },

  mobileTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#141821",
    marginBottom: 6,
    letterSpacing: -1,
    lineHeight: 46,
  },

  mobileSubtitle: {
    color: "#6f7487",
    fontSize: 16,
    marginBottom: 20,
  },

  modalOverlay: {
    flex: 1,
    flexDirection: "row",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  mobileDrawer: {
    width: "82%",
    maxWidth: 320,
    backgroundColor: "#4b0006",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
    justifyContent: "space-between",
  },

  mobileDrawerHeader: {
    position: "relative",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  closeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});