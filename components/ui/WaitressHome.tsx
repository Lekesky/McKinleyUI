import { useTable } from "@/context/TableContext";
import { router } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import styles from "../../styles/WaitressHome.styles";

export default function WaitressHome() {
    const { tableNum, setTableNum } = useTable();
    
    const handleEnter = (num : number) => {
        if(num !== 0){
            console.log("Table Number: ", num);
            setTableNum(num);
            router.push("/WaitressMenu");
        } else {
            Alert.alert("Please select a table number.");
            console.log("Missing table number.");
        }
    };
    return (
        <View style={styles.waitressContainerWrapper}>
            <View style={styles.waitressContainer}>
              <Text style={styles.waitressTitle}>Table Selection</Text>
              
              {/* Visual Table Layout */}
              <View style={styles.tableLayout}>
                {/* Row 1 */}
                <View style={styles.tableRow}>
                  {[1, 2, 3, 4].map(num => (
                    <TouchableOpacity 
                      key={num}
                      style={[
                        styles.tableButton, 
                        tableNum === num && styles.selectedTableButton
                      ]}
                      onPress={() => setTableNum(num)}
                    >
                      <Text style={[styles.tableButtonText, tableNum === num && styles.selectedTableText]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Row 2 */}
                <View style={styles.tableRow}>
                  {[5, 6, 7, 8].map(num => (
                    <TouchableOpacity 
                      key={num}
                      style={[
                        styles.tableButton, 
                        tableNum === num && styles.selectedTableButton
                      ]}
                      onPress={() => setTableNum(num)}
                    >
                      <Text style={[styles.tableButtonText, tableNum === num && styles.selectedTableText]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Row 3 */}
                <View style={styles.tableRow}>
                  {[9, 10, 11, 12].map(num => (
                    <TouchableOpacity 
                      key={num}
                      style={[
                        styles.tableButton, 
                        tableNum === num && styles.selectedTableButton
                      ]}
                      onPress={() => setTableNum(num)}
                    >
                      <Text style={[styles.tableButtonText, tableNum === num && styles.selectedTableText]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Selected Table Info */}
              <View style={styles.selectedTableInfo}>
                <Text style={styles.selectedTableText}>
                  {tableNum ? `Table ${tableNum} selected` : "No table selected"}
                </Text>
              </View>
              
              {/* Take Order Button */}
              <TouchableOpacity 
                onPress={() => handleEnter(tableNum)} 
                style={[
                  styles.takeOrderButton,
                  !tableNum && styles.disabledButton
                ]}
                disabled={!tableNum}
              >
                <Icon source="food-fork-drink" size={24} color="#ffffff"  />
                <Text style={styles.takeOrderButtonText}>Take Order</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
}



