import React from 'react'
import { View, Text, Dimensions, StyleSheet } from "react-native"
import { Ionicons } from '@expo/vector-icons'


const PADDING_HORIZONTAL = 20
const WINDOW = Dimensions.get('window')

const POINT_WIDTH = 10
const NUM_POINTS = Math.floor((WINDOW.width - PADDING_HORIZONTAL - 20) / POINT_WIDTH)

const POINTS = new Array(NUM_POINTS).fill(0)

const Content = () => (
  <View style={{ flex: 1 }}>
    <View style={styles.content}>
      <Text style={styles.text}>
        {`Lorem ipsum dolor sit amet consectetur adipisicing elit. `}
        <Text style={styles.textBold}>Ea ullam in, vitae ipsam illo</Text>
        {` officiis sint, minima repellat aspernatur deserunt libero?\n\nMagnam atque dolore culpa ex enim similique ipsum assumenda temporibus harum praesentium.\n\nNemo impedit totam odio possimus asperiores minus consectetur earum quam adipisci aliquid facere, cupiditate corporis perferendis iusto.`}
      </Text>

      <View style={styles.separator}>
        {POINTS.map((_, index) => <Text key={index} style={styles.point}>•</Text>)}
      </View>

      <Text style={styles.text}>
        <Text style={styles.textBold}>Lorem ipsum dolor sit amet consectetur</Text>
        {` adipisicing elit.\nNesciunt ea vero voluptas autem error, alias corrupti nam quia sequi eius distinctio nemo quis molestiae provident deserunt voluptate ut iusto magnam.\n\nNesciunt, ipsum. In, cumque. Cupiditate nemo natus amet qui soluta.`}
      </Text>
    </View>

    <View style={styles.line} />

    <View style={styles.btnWrapper}>
      <View style={styles.btn}>
        <Ionicons name='share-outline' size={19} color='#FFF' />
        <Text style={styles.btnText}>Share Story</Text>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  content: {
    paddingVertical: 30,
    paddingHorizontal: PADDING_HORIZONTAL,
  },

  text: {
    fontSize: Math.min(WINDOW.width * 0.053, 20),
    color: '#989898'
  },
  textBold: {
    color: '#FFF',
    fontWeight: '600'
  },

  separator: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 25,
    paddingHorizontal: 20
  },
  point: {
    width: POINT_WIDTH,
    color: '#3D3D3D',
    fontSize: 15
  },

  line: {
    backgroundColor: '#3D3D3D',
    width: '100%',
    height: StyleSheet.hairlineWidth
  },
  btnWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100
  },

  btn: {
    width: '45%',
    backgroundColor: '#2C2C2C',
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  btnText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 4
  }
})

export default Content