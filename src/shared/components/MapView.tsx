import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { MapPin } from 'lucide-react-native';

interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: number;
}

export default function MapView({
  latitude,
  longitude,
  title,
  height = 250,
}: MapViewProps) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            center: [${latitude}, ${longitude}],
            zoom: 15,
            scrollWheelZoom: false,
            zoomControl: false,
          });
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);
          L.marker([${latitude}, ${longitude}]).addTo(map)
            .bindPopup('${title || ''}')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View className="rounded-2xl overflow-hidden" style={{ height }}>
      <WebView
        source={{ html }}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled
        domStorageEnabled
        style={{ backgroundColor: 'transparent' }}
      />
      <View className="absolute top-3 left-3 bg-white/90 rounded-xl px-3 py-2 flex-row items-center">
        <MapPin size={14} color="#436CF5" />
        <Text className="text-neutral-900 text-xs font-lato ml-1">
          {title || `${latitude}, ${longitude}`}
        </Text>
      </View>
    </View>
  );
}
