
import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from '../../styles/AdminMembers.styles';

type Users = {
    uid: string;
    firstName: string;
    lastName: string;
    userRole: string;
};

interface MembersProps {
    readonly userSearch: string;
}

export default function AdminMembers({ userSearch }: MembersProps) {
    const { uid } = useAuth();
    const { showTabBar } = useMobileTabBar();
    const api = useMemo(() => createAPIClient(), []);
    
    const [customers, setCustomers] = useState<Users[] | null>([]);
    const [staff, setStaff] = useState<Users[] | null>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Pagination states
    const PAGE_SIZE = 20;
    const [staffPageNumber, setStaffPageNumber] = useState(0);
    const [customerPageNumber, setCustomerPageNumber] = useState(0);
    const [hasMoreStaff, setHasMoreStaff] = useState(true);
    const [hasMoreCustomers, setHasMoreCustomers] = useState(true);
    const [loadingMoreStaff, setLoadingMoreStaff] = useState(false);
    const [loadingMoreCustomers, setLoadingMoreCustomers] = useState(false);

    const updateStaffList = useCallback((currentList: Users[] | null, newContent: Users[], isFirstPage: boolean) => {
        if (isFirstPage) return newContent;
        
        const current = currentList || [];
        const existingIds = new Set(current.map(p => p.uid));
        const uniqueNew = newContent.filter(item => !existingIds.has(item.uid));
        
        return [...current, ...uniqueNew];
    }, []);

    const handleStaffFetch = useCallback((page = 0) => {
        if (loadingMoreStaff) return Promise.resolve();

        setStaff(prevStaff => {
            if (page > 0 && (!hasMoreStaff || (prevStaff && prevStaff.length < PAGE_SIZE))) {
                setHasMoreStaff(false);
                setLoadingMoreStaff(false);
                return prevStaff;
            }

            setLoadingMoreStaff(true);

            api.get('user/staff', {
                params: { page: Number(page), size: PAGE_SIZE }
            })
            .then((response) => {
                if (!response?.data?.content) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'No valid data received from API',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                    setHasMoreStaff(false);
                    return;
                }

                const newContent: Users[] = response.data.content;
                
                if (newContent.length < PAGE_SIZE) {
                    setHasMoreStaff(false);
                } else {
                    setHasMoreStaff(!response.data.last);
                }

                setStaff(prev => updateStaffList(prev, newContent, page === 0));
                setStaffPageNumber(page);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch staff';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch staff',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
                setHasMoreStaff(false);
            })
            .finally(() => {
                setLoadingMoreStaff(false);
            });

            return prevStaff;
        });

        return Promise.resolve();
    }, [api, hasMoreStaff, loadingMoreStaff, updateStaffList]);

    const handleCustomersFetch = useCallback((page = 0) => {
        if (loadingMoreCustomers) return Promise.resolve();

        setCustomers(prevCustomers => {
            if (page > 0 && (!hasMoreCustomers || (prevCustomers && prevCustomers.length < PAGE_SIZE))) {
                setHasMoreCustomers(false);
                setLoadingMoreCustomers(false);
                return prevCustomers;
            }

            setLoadingMoreCustomers(true);

            api.get('user/customers', {
                params: { page: Number(page), size: PAGE_SIZE }
            })
            .then((response) => {
                if (!response?.data?.content) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'No data received from API',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                    setHasMoreCustomers(false);
                    return;
                }

                const newContent = response.data.content || [];

                if (newContent.length < PAGE_SIZE) {
                    setHasMoreCustomers(false);
                } else {
                    setHasMoreCustomers(!response.data.last);
                }

                if (page === 0) {
                    setCustomers(newContent);
                } else {
                    setCustomers(prev => [...(prev || []), ...newContent]);
                }
                setCustomerPageNumber(page);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch customers';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch customers',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
                setHasMoreCustomers(false);
            })
            .finally(() => {
                setLoadingMoreCustomers(false);
            });

            return prevCustomers;
        });

        return Promise.resolve();
    }, [api, hasMoreCustomers, loadingMoreCustomers]);

    // Initial data fetch
    useEffect(() => {
        let mounted = true;
        
        if (mounted) {
            handleStaffFetch(0);
            handleCustomersFetch(0);
        }
        
        return () => {
            mounted = false;
        };
    }, []);

    // Filtered users for dropdown
    const filteredUsers = useMemo(() => {
        if (!userSearch || !staff) return [];
        const searchLower = userSearch.toLowerCase();
        return staff.filter(user =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower)
        );
    }, [userSearch, staff]);

    const filteredStaff = staff && staff.length > 0
        ? staff.filter(user =>
            (user.firstName + " " + user.lastName).toLowerCase().includes(userSearch.toLowerCase())
        )
        : [];


    return (
        <View style={{ flex: 1 }}>
            {/* Search Results Dropdown */}
            {dropdownVisible && userSearch.length > 0 && (
                <View 
                    style={[styles.dropdown, { elevation: 5 }]}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <TouchableOpacity
                                key={user.uid}
                                onPress={() => {
                                    setDropdownVisible(false);
                                    showTabBar();
                                    router.push({
                                        pathname: '/UserProfile',
                                        params: { user: user.uid }
                                    });
                                }}
                                style={[styles.dropdownItem, { borderRadius: 8 }]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.userIcon, { backgroundColor: '#f0f0f0' }]}>
                                        <Icon source="account" size={20} color="#871919ff" />
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={[styles.dropdownItemText, { fontWeight: '600' }]}>
                                            {user.firstName} {user.lastName}
                                        </Text>
                                        <Text style={{ color: '#666', fontSize: 12 }}>{user.userRole}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ padding: 16, alignItems: 'center' }}>
                            <Icon source="account-search" size={24} color="#666" />
                            <Text style={[styles.emptyMessage, { marginTop: 8 }]}>No users found</Text>
                        </View>
                    )}
                </View>
            )}

            <ScrollView 
                contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const paddingToBottom = 20;
                    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
                        contentSize.height - paddingToBottom;
                    
                    if (isCloseToBottom) {
                        if (hasMoreStaff) {
                            handleStaffFetch(staffPageNumber + 1);
                        }
                        if (hasMoreCustomers) {
                            handleCustomersFetch(customerPageNumber + 1);
                        }
                    }
                }}
                scrollEventThrottle={400}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            // Reset pagination states
                            setStaffPageNumber(0);
                            setCustomerPageNumber(0);
                            setHasMoreStaff(true);
                            setHasMoreCustomers(true);
                            
                            // Fetch initial data
                            Promise.all([
                                handleStaffFetch(0),
                                handleCustomersFetch(0)
                            ]).finally(() => {
                                setRefreshing(false);
                            });
                        }}
                        colors={['#871919ff']}
                    />
                }
            >
                {/* Staff Section */}
                <View style={[styles.sectionHeader, { marginTop: 16 }]}> 
                    <View style={styles.headerRow}>
                        <Icon source="account-tie" size={24} color="#871919ff" />
                        <Text style={[styles.subtitle, { marginLeft: 8 }]}>Staff Members</Text>
                    </View>
                    <Text style={styles.totalCount}>
                        {staff?.length || 0} total
                    </Text>
                </View>
                <View style={[styles.sectionContainer, { marginTop: 8 }]}> 
                    {filteredStaff.length > 0 ? (
                        filteredStaff.map(user => (
                            <TouchableOpacity 
                                key={user.uid}
                                style={styles.userCard}
                                onPress={() => {
                                    router.push({
                                        pathname: '/UserProfile',
                                        params: { user: user.uid }
                                    });
                                }}
                            >
                                {/* Avatar */}
                                <View style={styles.avatar}>
                                    <Icon source="account-tie" size={28} color="#871919ff" />
                                </View>
                                {/* Info */}
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>
                                        {user.firstName} {user.lastName}
                                    </Text>
                                    <View style={styles.roleContainer}>
                                        <Text style={styles.userRole}>{user.userRole}</Text>
                                        {user.uid === uid && (
                                            <View style={styles.meBadge}>
                                                <Text style={styles.meBadgeText}>Me</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <Icon source="chevron-right" size={26} color="#c1bcbc" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Icon source="account-off" size={48} color="#666" />
                            <Text style={[styles.emptyMessage, { marginTop: 12 }]}>No staff members found</Text>
                        </View>
                    )}
                </View>
                {/* Members Section */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}> 
                    <View style={styles.headerRow}>
                        <Icon source="account-group" size={24} color="#871919ff" />
                        <Text style={[styles.subtitle, { marginLeft: 8 }]}>Members</Text>
                    </View>
                    <Text style={styles.totalCount}>
                        {customers?.length || 0} total
                    </Text>
                </View>
                <View style={[styles.sectionContainer, { marginTop: 8 }]}> 
                    {customers && customers.length > 0 ? (
                        customers.filter(user =>
                            (user.firstName + " " + user.lastName).toLowerCase().includes(userSearch.toLowerCase())
                        ).map(user => (
                            <TouchableOpacity 
                                key={user.uid}
                                style={styles.userCard}
                                onPress={() => {
                                    router.push({
                                        pathname: '/UserProfile',
                                        params: { user: user.uid }
                                    });
                                }}
                            >
                                {/* Avatar */}
                                <View style={styles.avatar}>
                                    <Icon source="account" size={28} color="#871919ff" />
                                </View>
                                {/* Info */}
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>
                                        {user.firstName} {user.lastName}
                                    </Text>
                                    <View style={styles.roleContainer}>
                                        <Text style={styles.userRole}>{user.userRole}</Text>
                                        {user.uid === uid && (
                                            <View style={styles.meBadge}>
                                                <Text style={styles.meBadgeText}>Me</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <Icon source="chevron-right" size={26} color="#c1bcbc" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Icon source="account-off" size={48} color="#666" />
                            <Text style={[styles.emptyMessage, { marginTop: 12 }]}>No members found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}   

