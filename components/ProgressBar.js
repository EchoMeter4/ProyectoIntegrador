import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress = 0, danger = false }) {
    return (
        <View style={styles.track}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${Math.min(progress * 100, 100)}%`,
                        backgroundColor: danger ? '#C0392B' : '#0F6D66',
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        width: '100%',
        height: 8,
        borderRadius: 999,
        backgroundColor: '#E8F2F1',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
    },
});

