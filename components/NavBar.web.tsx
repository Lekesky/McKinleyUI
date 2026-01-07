import { Tabs } from '@/constants/Tabs';
import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import { router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/NavBar.web.styles';

export default function NavBar() {
    const { hideTabBar } = useMobileTabBar();
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    
    useEffect(() => {
        // Only hide tab bar on mobile (shouldn't be needed on web as it's hidden by Platform check)
        if (Platform.OS !== 'web') {
            hideTabBar();
        }
    }, [hideTabBar]);

    const isActive = (path: string) => {
        // Extract the tab name from the path like '/(tabs)/Home' -> 'Home'
        const tabName = path.split('/').pop();
        // Check if current segment matches
        return segments.includes(tabName || '');
    };

    return (
        <View style={styles.container}>
            <View style={styles.brandContainer}>
                <Image source={require("@/assets/images/McKinleysGrill.png")} style={styles.logo} />
            </View>
            <View style={styles.links}>
                {Tabs.filter(item => item.path !== '/(tabs)/Profile').map((item) => (
                    <TouchableOpacity
                        key={item.title}
                        onPress={() => router.push(item.path as any)}
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
                ))}
            </View>
            <View style={styles.actions}>
                {isAuthenticated ? (
                    <View style={styles.profileLink}>
                        <TouchableOpacity
                            key='Profile'
                            onPress={() => router.push('/(tabs)/Profile' as any)}
                            style={styles.linkButton}
                        >
                            <Text style={styles.linkText}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => router.push('/Login' as any)} style={styles.actionButton}>
                            <Text style={styles.actionText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/Signup' as any)} style={styles.actionButtonPrimary}>
                            <Text style={styles.actionTextPrimary}>Sign up</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}
