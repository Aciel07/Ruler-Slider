import React, { useState, useEffect } from 'react'
import { View, Text, PanResponder, LayoutChangeEvent } from 'react-native'

interface RulerSliderProps {
    height?: number | string
    onChangeValue?: (value: string) => void
}

const RulerSlider: React.FC<RulerSliderProps> = ({ height, onChangeValue }) => {
    const maxFt = 8
    const minFt = 4
    const totalFeet = maxFt - minFt // total ft range
    const lineWidth = 2

    // Knob Position
    const [position, setPosition] = useState<number>(0)
    // Height of the ruler
    const [heightValue, setHeightValue] = useState<number>(0)

    // Reset position when height changes
    useEffect(() => {
        setPosition(0)
    }, [heightValue])

    // Convert position to ft in decimal
    const ftValue = (pos: number) => {
        const decimalFeet =
            minFt + ((heightValue - pos) / heightValue) * totalFeet
        return decimalFeet.toFixed(5) + ' ft'
    }

    // Convert position to ft and inches format
    const ftAndInchValue = (pos: number) => {
        const currentPos = Math.max(0, Math.min(heightValue, pos))
        const decimalFeet =
            minFt + ((heightValue - currentPos) / heightValue) * totalFeet
        const feet = Math.floor(decimalFeet)
        const inches = Math.round((decimalFeet - feet) * 12)
        return `${feet}'${inches}"`
    }

    // Convert position to cm
    const cmValue = (pos: number) => {
        const decimalFeet =
            minFt + ((heightValue - pos) / heightValue) * totalFeet
        return (decimalFeet * 30.48).toFixed(2) + ' cm'
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            let newPos = position + gesture.dy
            newPos = Math.max(0, Math.min(heightValue, newPos))
            setPosition(newPos)
            onChangeValue && onChangeValue(cmValue(newPos))
        },
        onPanResponderRelease: () => {
            console.log(
                `Measurement: ${ftValue(position)} || ${cmValue(position)}`,
            )
        },
    })

    return (
        <View
            className="h-full"
            onLayout={(event: LayoutChangeEvent) => {
                const parentHeight = event.nativeEvent.layout.height

                if (typeof height === 'string' && height.includes('%')) {
                    const percentageValue = parseFloat(height) / 100
                    setHeightValue(parentHeight * percentageValue)
                } else if (typeof height === 'number') {
                    setHeightValue(height)
                } else {
                    setHeightValue(parentHeight)
                }
            }}
        >
            <View
                {...panResponder.panHandlers}
                className="relative w-10 border-r-2 border-black bg-yellow-400 justify-center shadow-lg"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    height: heightValue,
                }}
            >
                {/* Ruler lines */}
                {Array.from({ length: Math.floor(heightValue / 10) }).map(
                    (_, index) => (
                        <View
                            key={index}
                            className="absolute bg-black"
                            style={{
                                top: index * 10,
                                height: 1,
                                width: index % 5 === 0 ? '50%' : '25%',
                            }}
                        />
                    ),
                )}

                {/* Display ft and inch value on UI*/}
                <View
                    className="absolute left-12"
                    style={{ top: position - 10 }}
                >
                    <Text className="text-m font-bold text-black">
                        {ftAndInchValue(position)}
                    </Text>
                </View>

                {/* Indicator line */}
                <View
                    className="absolute w-10 bg-blue-500"
                    style={{ top: position, height: lineWidth }}
                />
            </View>
        </View>
    )
}

export default RulerSlider
