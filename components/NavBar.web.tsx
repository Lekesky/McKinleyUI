import { Tabs } from '@/constants/Tabs';
import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import { useResponsive } from '@/hooks/useResponsive';
import { router, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import styles from '../styles/NavBar.web.styles';

export default function NavBar() {
    const { hideTabBar } = useMobileTabBar();
    const { isAuthenticated } = useAuth();
    const segments = useSegments() as string[];
    const { isMobile } = useResponsive();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Check if we're on the landing page
    const isLandingPage = segments.length === 0 || segments[0] === 'index';
    
    useEffect(() => {
        // Only hide tab bar on mobile (shouldn't be needed on web as it's hidden by Platform check)
        if (Platform.OS !== 'web') {
            hideTabBar();
        }
    }, [hideTabBar]);

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        if (!isMobile) {
            setMobileMenuOpen(false);
        }
    }, [isMobile]);

    const isActive = (path: string) => {
        // Extract the tab name from the path like '/(tabs)/Home' -> 'Home'
        const tabName = path.split('/').pop();
        // Check if current segment matches
        return segments.includes(tabName || '');
    };

    const handleNavigation = (path: string) => {
        router.push(path as any);
        setMobileMenuOpen(false);
    };

    const filteredTabs = Tabs.filter(item => {
        // Always exclude Profile from main nav (shown in actions section)
        if (item.path === '/(tabs)/Profile') {
            return false;
        }
        // Hide Order, Cart, Notification if not authenticated
        if (!isAuthenticated && (item.name === 'Order' || item.name === 'Cart' || item.name === 'Notification')) {
            return false;
        }
        return true;
    });

    return (
        <View style={styles.container}>
            <View style={styles.brandContainer}>
                <TouchableOpacity onPress={() => handleNavigation('/')}>
                    <Image source={require("@/assets/images/McKinleysGrill.png")} style={styles.logo} />
                </TouchableOpacity>
            </View>
            
            {/* Desktop Navigation */}
            {!isMobile && (
                <>
                    <View style={styles.links}>
                        {(isAuthenticated || !isLandingPage) && 
                            filteredTabs.map((item) => (
                                <TouchableOpacity
                                    key={item.title}
                                    onPress={() => handleNavigation(item.path)}
                                    style={[
                                        styles.linkButton,
                                        isActive(item.path) && styles.linkButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.linkText,
                                        isActive(item.path) && styles.linkTextActive
                                    ]}>{item.title}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    <View style={styles.actions}>
                        {isAuthenticated ? (
                            <View style={styles.profileLink}>
                                <TouchableOpacity
                                    key='Profile'
                                    onPress={() => handleNavigation('/(tabs)/Profile')}
                                    style={styles.linkButton}
                                >
                                    <Text style={styles.linkText}>Profile</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => handleNavigation('/Login')} style={styles.actionButton}>
                                    <Text style={styles.actionText}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleNavigation('/Signup')} style={styles.actionButtonPrimary}>
                                    <Text style={styles.actionTextPrimary}>Sign up</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </>
            )}

            {/* Mobile Hamburger Menu */}
            {isMobile && (
                <TouchableOpacity 
                    style={styles.hamburger}
                    onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Icon source={mobileMenuOpen ? "close" : "menu"} size={28} color="#871919" />
                </TouchableOpacity>
            )}

            {/* Mobile Menu Modal */}
            <Modal
                visible={mobileMenuOpen && isMobile}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setMobileMenuOpen(false)}
            >
                <View style={styles.mobileMenuOverlay}>
                    <View style={styles.mobileMenuContainer}>
                        {/* Close Button Header */}
                        <View style={styles.mobileMenuHeader}>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setMobileMenuOpen(false)}
                            >
                                <Icon source="close" size={24} color="#871919" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.mobileMenuContent}>
                            {/* Mobile Navigation Links */}
                            {(isAuthenticated || !isLandingPage) && 
                                filteredTabs.map((item) => (
                                    <TouchableOpacity
                                        key={item.title}
                                        onPress={() => handleNavigation(item.path)}
                                        style={[
                                            styles.mobileMenuItem,
                                            isActive(item.path) && styles.mobileMenuItemActive
                                        ]}
                                    >
                                        <Text style={[
                                            styles.mobileMenuText,
                                            isActive(item.path) && styles.mobileMenuTextActive
                                        ]}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))
                            }

                            {/* Mobile Auth Actions */}
                            <View style={styles.mobileMenuActions}>
                                {isAuthenticated ? (
                                    <TouchableOpacity
                                        onPress={() => handleNavigation('/(tabs)/Profile')}
                                        style={styles.mobileActionButton}
                                    >
                                        <Text style={styles.mobileActionText}>Profile</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <>
                                        <TouchableOpacity 
                                            onPress={() => handleNavigation('/Login')} 
                                            style={styles.mobileActionButton}
                                        >
                                            <Text style={styles.mobileActionText}>Login</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => handleNavigation('/Signup')} 
                                            style={styles.mobileActionButtonPrimary}
                                        >
                                            <Text style={styles.mobileActionTextPrimary}>Sign up</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
