import { Tabs } from '@/constants/Tabs';
import { useMobileTabBar } from '@/context/TabBarContext';
import { useResponsive } from '@/hooks/useResponsive';
import {
    clearAuthRedirectAction,
    storeAuthRedirectAction,
} from '@/services/authRedirect';
import {
    getAuth0AuthorizeOptions,
    getAuth0AuthorizeParameters,
} from '@/services/auth0';
import { router, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Icon } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from '../styles/NavBar.web.styles';

export default function NavBar() {
    const { authorize, isLoading, user } = useAuth0();
    const { hideTabBar } = useMobileTabBar();
    const segments = useSegments() as string[];
    const { isMobile } = useResponsive();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLandingPage = segments.length === 0 || segments[0] === 'index';

    useEffect(() => {
        if (Platform.OS !== 'web') hideTabBar();
    }, [hideTabBar]);

    useEffect(() => {
        if (!isMobile) setMobileMenuOpen(false);
    }, [isMobile]);

    const isActive = (path: string) => {
        const tabName = path.split('/').pop();
        return segments.includes(tabName || '');
    };

    const handleNavigation = (path: string) => {
        router.push(path as any);
        setMobileMenuOpen(false);
    };

    const handleAuth = async (action: 'login' | 'signup') => {
        try {
            setMobileMenuOpen(false);
            storeAuthRedirectAction(action);
            await authorize(
                getAuth0AuthorizeParameters(),
                getAuth0AuthorizeOptions()
            );
        } catch {
            clearAuthRedirectAction();
            Toast.show({
                type: 'error',
                text1: `${action === 'login' ? 'Login' : 'Signup'} Failed`,
                text2: 'An error occurred. Please try again.',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        }
    };

    const filteredTabs = Tabs.filter(({ path, name }) =>
        path !== '/(tabs)/Profile' &&
        (user || !['Order', 'Cart', 'Notification'].includes(name))
    );

    const navLinks = (user || !isLandingPage) && filteredTabs.map((item) => (
        <TouchableOpacity
            key={item.title}
            onPress={() => handleNavigation(item.path)}
            style={[styles.linkButton, isActive(item.path) && styles.linkButtonActive]}
        >
            <Text style={[styles.linkText, isActive(item.path) && styles.linkTextActive]}>
                {item.title}
            </Text>
        </TouchableOpacity>
    ));

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
                    <View style={styles.links}>{navLinks}</View>
                    <View style={styles.actions}>
                        {isLoading ? null : user ? (
                            <View style={styles.profileLink}>
                                <TouchableOpacity onPress={() => handleNavigation('/(tabs)/Profile')} style={styles.linkButton}>
                                    <Text style={styles.linkText}>Profile</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => handleAuth('login')} style={styles.actionButton}>
                                    <Text style={styles.actionText}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAuth('signup')} style={styles.actionButtonPrimary}>
                                    <Text style={styles.actionTextPrimary}>Sign up</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </>
            )}

            {/* Mobile Hamburger */}
            {isMobile && (
                <TouchableOpacity style={styles.hamburger} onPress={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                        <View style={styles.mobileMenuHeader}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setMobileMenuOpen(false)}>
                                <Icon source="close" size={24} color="#871919" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.mobileMenuContent}>
                            {(user || !isLandingPage) && filteredTabs.map((item) => (
                                <TouchableOpacity
                                    key={item.title}
                                    onPress={() => handleNavigation(item.path)}
                                    style={[styles.mobileMenuItem, isActive(item.path) && styles.mobileMenuItemActive]}
                                >
                                    <Text style={[styles.mobileMenuText, isActive(item.path) && styles.mobileMenuTextActive]}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <View style={styles.mobileMenuActions}>
                                {isLoading ? null : user ? (
                                    <TouchableOpacity onPress={() => handleNavigation('/(tabs)/Profile')} style={styles.mobileActionButton}>
                                        <Text style={styles.mobileActionText}>Profile</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={() => handleAuth('login')} style={styles.mobileActionButton}>
                                            <Text style={styles.mobileActionText}>Login</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleAuth('signup')} style={styles.mobileActionButtonPrimary}>
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
