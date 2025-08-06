import { Tabs } from 'expo-router';
import { Chrome as Home, Video, Image, Zap, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#8b5cf6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feed',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="video"
          options={{
            title: 'Create',
            tabBarIcon: ({ size, color }) => (
              <Video size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="image"
          options={{
            title: 'Image',
            tabBarIcon: ({ size, color }) => (
              <Image size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="training"
          options={{
            title: 'Training',
            tabBarIcon: ({ size, color }) => (
              <Zap size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
  );
}