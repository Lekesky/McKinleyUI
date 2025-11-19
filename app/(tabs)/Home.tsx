import CustomerHome from "@/components/ui/CustomerHome";
import WaitressHome from "@/components/ui/WaitressHome";
import ViewControl from "@/components/ViewSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View } from "react-native";
import styles from "../../styles/Home.styles";

const VIEWS = ["Customer", "Waitress"];

export default function HomeScreen() {
  const { userRole } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(userRole === 'CUSTOMER' ? 0 : 1);
  
  return (
    <View style={styles.container}>
      
      {/* View Switcher */}
        {userRole && (userRole === 'WAITRESS' || userRole === 'ADMIN' || userRole === 'CHEF') && (
          <ViewControl
              values={VIEWS}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
              width={300}
              height={40}
              activeColor="#ffffff"
              inactiveColor="#d3d3d3"
              activeTextColor="#000"
              textColor="#333"
              borderRadius={20}
              containerStyle={styles.viewController}
          />
        )}

        {/* Customer View */}
        {selectedIndex === 0 && (
          <CustomerHome />
        )}

        {/* Waitress View */}
        {selectedIndex === 1 && (
          <WaitressHome />
        )}
    </View>
  );
}



